var model = require('./model');
var hashlib = require('hashlib');

var User = model.User;

var taken= [
    'select',
    'edit',
    'interact'
];

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
                        res.render('select', {slug: slug, email: email});
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
                        styles=['http://ajax.googleapis.com/ajax/libs/jqueryui/1.8.13/themes/base/jquery-ui.css','/css/validationEngine.jquery.css'];
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
                    user.url = [formUser.url];

                    for(i = 1; i <= numJobs; i++) {
                        var job = req.body['job' + i];
                        jobs.push(job);
                    }

                    for(i = 1; i <= numSchools; i++) {
                        var school = req.body['school' + i];
                        schools.push(school);
                    }

                    for(i = 1; i <= numPublications; i++) {
                        var publication = req.body['publication' + i];
                        publications.push(publication);
                    }

                    for(i = 1; i <= numAffiliations; i++) {
                        var affiliation = req.body['affiliation' + i];
                        affiliations.push(affiliation.title);
                    }

                    user.jobs = jobs;
                    user.educations = schools;
                    user.publications = publications;
                    user.affiliations = affiliations;

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

    app.get('/:slug', function(req, res) {

        User.findOne({'slug':req.params.slug}, function(err,user) {
            if(!err && user) {
                var gravatar = hashlib.md5(user.email);
                res.render('profile', {person:user, gravatar:gravatar});
            } else {
                res.send('Quien es ese?', 404);
            }
        });
    });
};

exports.configure = configure;

