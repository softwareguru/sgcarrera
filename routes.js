var model = require('./model');

var http = require('http');
var hashlib = require('hashlib');

var User = model.User;
var DominantSkill = model.DominantSkill;

var taken= [
    'select',
    'edit',
    'interact',
    'logout',
    'auth'
];

var findService = function(user, serviceName) {
    for(var i = 0; i < user.services.length; i++) {
        if(user.services[i].type == serviceName) {
            return user.services[i];
        }
    }
};

var findSkill = function(skills, skillName) {
    for(var i = 0; i < skills.length; i++) {
        if(skills[i].name == skillName) {
            return skills[i];
        }
    }
};

var storeIfMax = function(skill) {
    DominantSkill.findOne({name:skill.name}, function(err,foundSkill) {
        if(!err && foundSkill) {
            if(foundSkill.level < skill.level) {
                foundSkill.level = skill.level;
                foundSkill.save(function(err) {
                    if(err) {
                        console.log(err);
                    }
                });
            }
        } else {
            var newSkill = new DominantSkill(skill);
            newSkill.save(function(err) {
                if(err) {
                    console.log(err);
                }
            });
        }
    });
};

configure = function(app) {
    app.get('/', function(req, res) {
        if(req.loggedIn) {
            User.findById(req.session.auth.userId, function(err,user) {
                if(!err) {
                    if(!user.registered) {
                        res.redirect('select');
                    } else {
                        if(!user.filled) {
                            res.redirect('edit');
                        } else {
                            res.redirect(user.slug);
                        }
                    }
                } else {
                    res.render('index');
                }
            });
        } else {
            res.render('index');
        }
    });

    app.get('/select', function(req, res) {
        if(req.session.auth && req.session.auth.loggedIn) {
            User.findById(req.session.auth.userId, function(err,user) {
                if(!err) {
                    var scripts;
                    var styles;
                    if(!user.registered) {
                        var slug  = '';
                        var email = '';
                        if(user.services.length > 0) {
                            var service = user.services[0];
                            if(service.type === 'github') {
                                slug  = service.data.login;
                                email = service.data.email;
                            }
                        }
                        scripts=['/js/jquery.validationEngine.js','/js/jquery.validationEngine-es.js','/js/select.js'];
                        styles=['/css/validationEngine.jquery.css'];
                        res.render('select', {slug: slug, email: email, scripts:scripts, styles:styles});
                    } else {
                        res.redirect(user.slug);
                    }
                } else {
                    res.redirect('/');
                }
            });
        } else {
            res.redirect('/');
        }
    });

    app.post('/select', function(req, res) {
        if(req.session.auth && req.session.auth.loggedIn) {
            User.findById(req.session.auth.userId, function(err,user) {
                if(!err) {
                    if(!user.registered) {
                        user.slug = req.body.user.slug;
                        user.email = req.body.user.email;
                        user.registered = true;

                        user.save(function(err) {
                            if(err) {
                                req.flash('warning', err);
                                res.redirect('select');
                            } else {
                                req.flash('success', 'Tu usuario fue creado correctamente!');
                                res.redirect('edit');
                            }
                        });

                    } else {
                        res.redirect(user.slug);
                    }
                } else {
                    res.redirect('/');
                }
            });
        } else {
            res.redirect('/');
        }
    });

    app.get('/edit', function(req, res) {
        if(req.loggedIn) {
            User.findById(req.session.auth.userId, function(err,user) {
                if(!err && user) {
                    if(user.registered) {
                        var hasLinkedin = false;
                        for(var i = 0; i < user.services.length; i++) {
                            if(user.services[i].type == 'linkedin') {
                                hasLinkedin = true;
                                break;
                            }
                        }
                        scripts=['/js/jquery.validationEngine.js','/js/jquery.validationEngine-es.js','/js/edit.js'];
                        styles=['/css/validationEngine.jquery.css'];
                        res.render('edit', {person:user, hasLinkedin: hasLinkedin, scripts:scripts});
                    } else {
                        res.redirect('select');
                    }
                } else {
                    res.render('/');
                }
            });
        } else {
            res.redirect('/');
        }
    });

    app.post('/edit', function(req, res) {
        var numJobs;
        var numSchools;
        var numAffiliations;
        var numPublications;
        var jobs = [];
        var schools = [];
        var publications = [];
        var affiliations = [];
        var i;

        if(req.session.auth && req.session.auth.loggedIn) {
            User.findById(req.session.auth.userId, function(err,user) {
                if(!err) {
                    formUser = req.body.user;

                    numJobs = req.body.numJobs || 0;
                    numSchools = req.body.numSchools|| 0;
                    numPublications = req.body.numPublications || 0;
                    numAffiliations = req.body.numAffiliations || 0;

                    user.name = formUser.name;
                    user.lastNames = formUser.lastNames;
                    user.title = formUser.title;
                    user.summary = formUser.summary;
                    user.place = formUser.place;
                    user.url = [formUser.url];

                    for(i = 1; i <= numJobs; i++) {
                        var job = req.body['job' + i];
                        if(job) {
                            jobs.push(job);
                        }
                    }

                    for(i = 1; i <= numSchools; i++) {
                        var school = req.body['school' + i];
                        if(school) {
                            schools.push(school);
                        }
                    }

                    for(i = 1; i <= numPublications; i++) {
                        var publication = req.body['publication' + i];
                        if(publication) {
                            publications.push(publication);
                        }
                    }

                    for(i = 1; i <= numAffiliations; i++) {
                        var affiliation = req.body['affiliation' + i];
                        if(affiliation) {
                            affiliations.push(affiliation.title);
                        }
                    }

                    user.jobs = jobs;
                    user.educations = schools;
                    user.publications = publications;
                    user.affiliations = affiliations;

                    user.filled = true;

                    user.save(function(err) {
                        if(!err) {
                            req.flash('success', 'Tus datos se han guardado exitosamente');
                            res.redirect(user.slug);
                        } else {
                            req.flash('warning', err);
                            res.redirect('edit');
                        }
                    });

                } else {
                    res.redirect('/');
                }
            });
        } else {
            res.redirect('/');
        }
    });

    app.get('/skills/:slug', function(req, res) {
        User.find({'skills.name':req.params.slug}, function(err, users) {
            if(!err) {
                res.render('people', {users:users, skill: req.params.slug, md5:hashlib.md5});
            }
        });
    });

    app.get('/:slug', function(req, res) {

        User.findOne({'slug':req.params.slug}, function(err,user) {
            var i;
            var scripts;
            if(!err && user) {
                var gravatar = hashlib.md5(user.email);
                DominantSkill.find({}, function(err, dominantSkills) {
                    var skills = [];
                    if(!err) {
                        user.skills.forEach(function(skill) {
                            var uiSkill = {
                                id: escape(skill.name),
                                name: skill.name,
                                level: 5 * skill.level / findSkill(dominantSkills, skill.name).level,
                                stars: []
                            };
                            for(i = 0; i < uiSkill.level; i++) {
                                uiSkill.stars.push('active');
                            }
                            for(; i < 5; i++) {
                                uiSkill.stars.push('inactive');
                            }
                            skills.push(uiSkill);
                        });
                    } else {
                        res.flash('warning', err);
                    }
                    scripts=['/js/profile.js'];
                    res.render('profile', {person:user, gravatar:gravatar, skills:skills, scripts:scripts});
                });
            } else {
                res.send('Quien es ese?', 404);
            }
        });
    });

    app.get('/edit/skills', function(req, res) {
        if(req.session.auth && req.session.auth.loggedIn) {
            User.findById(req.session.auth.userId, function(err,user) {
                if(!err) {
                    var globalSkills = [];
                    var service = findService(user, 'github');

                    if(service) {
                        var fetchRepos = function fetchRepos(path) {
                            path = path || '/api/v2/json/repos/show/' + service.data.login;


                            var options = {
                                host: 'github.com',
                                port: 80,
                                path: path
                            };

                            http.get(options, function(result) {
                                var jsonResult = '';
                                result.on('data', function(chunk) {
                                    jsonResult += chunk;
                                });
                                result.on('end', function() {
                                    var next = result.headers['x-next'];
                                    var repos = JSON.parse(jsonResult).repositories;
                                    var foundSkill;

                                    var processLanguages = function(result) {
                                        var skillText = '';
                                        result.on('data', function(chunk) {
                                            skillText += chunk;
                                        });
                                        result.on('end', function() {
                                            var skills = JSON.parse(skillText).languages;
                                            for(var skill in skills) {
                                                if(skills.hasOwnProperty(skill)) {
                                                    foundSkill = findSkill(globalSkills, skill);
                                                    if(!foundSkill) {
                                                        foundSkill = {
                                                            name: skill,
                                                            level: skills[skill]
                                                        };
                                                        globalSkills.push(foundSkill);
                                                    } else {
                                                        foundSkill.level += skills[skill];
                                                    }
                                                    user.skills = globalSkills;
                                                    user.save();
                                                    storeIfMax(foundSkill);
                                                }
                                            }
                                        });
                                    };

                                    for(var i = 0; i < repos.length; i++) {
                                        var options = {
                                            host: 'github.com',
                                            port: 80,
                                            path: '/api/v2/json/repos/show/' + service.data.login + '/' + repos[i].name + '/languages'
                                        };
                                        http.get(options, processLanguages);
                                    }


                                    if(next) {
                                        fetchRepos(next);
                                    } else {
                                        req.flash('success', 'Tus skills estan siendo calculados, regresa en unos segundos');
                                        res.redirect(user.slug);
                                    }

                                });
                            }).on('error', function(e) {
                                req.flash('warning', e);
                                res.redirect(user.slug);
                            });
                        };

                        fetchRepos();

                    } else {
                        req.flash('warning', 'No se encontro cuenta de github asociada');
                        res.redirect(user.slug);
                    }
                } else {
                    req.flash('warning', err);
                    res.redirect('/');
                }
            });
        } else {
            res.redirect('/');
        }

        

    });

    app.get('/logout', function(req, res) {
        req.session.destroy();
        res.redirect('/');
    });
};

exports.configure = configure;

