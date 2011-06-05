var model = require('./model');
var hashlib = require('hashlib');

var User = model.User;

var taken= [
    'select'
];

configure = function(app) {
    app.get('/', function(req, res) {
        if(req.session.auth && req.session.auth.loggedIn) {
            User.findById(req.session.auth.userId, function(err,user) {
                if(!err) {
                    if(!user.registered) {
                        res.redirect('select');
                    } else {
                        res.redirect(user.slug);
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

                        user.save();

                        res.redirect('select');
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

    app.get('/:slug', function(req, res) {
        User.findOne({'slug':req.params.slug}, function(err,user) {
            if(!err) {
                var gravatar = hashlib.md5(user.email);
                res.render('profile', {person:user, gravatar:gravatar});
            } else {
                res.send('Quien es ese?', 404);
            }
        });
    });
};

exports.configure = configure;

