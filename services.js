var model = require('./model');
var conf = require('./conf');
var OAuth = require('oauth').OAuth;
var OAuth2 = require('oauth').OAuth2;

var User = model.User;

var findService = function(user, serviceName) {
    for(var i = 0; i < user.services.length; i++) {
        if(user.services[i].type == serviceName) {
            return user.services[i];
        }
    }
};

var linkedinOAuth = new OAuth(
        'https://api.linkedin.com/uas/oauth/requestToken',
        'https://api.linkedin.com/uas/oauth/accessToken',
        conf.linkedin.key,
        conf.linkedin.secret,
        '1.0',
        null,
        'HMAC-SHA1',
        null,
        {
            Accept: '/',
            Connection: 'close',
            'User-Agent': 'SGCarrera extractor',
            'x-li-format': 'json'
        });

var githubOAuth = new OAuth2(
        conf.github.id,
        conf.github.secret,
        'https://github.com',
        'https://github.com/login/oauth/authorize',
        'https://github.com/login/oauth/access_token'
        );


configure = function(app) {
    app.get('/interact/self', function(req, res) {
        res.contentType('application/json');
        if(req.loggedIn) {
            User.findById(req.session.auth.userId, function(err,user) {
                if(!err) {
                    res.send(user);
                } else {
                    res.send({access:'Not allowed'});
                }
            });
        } else {
            res.send({access:'Not allowed'});
        }
    });
    app.get('/interact/importLinkedin', function(req, res) {
        res.contentType('application/json');
        if(req.session.linkedin) {
            var accessToken = req.session.linkedin.accessToken,
                accessTokenSecret = req.session.linkedin.accessTokenSecret;
            linkedinOAuth.get('http://api.linkedin.com/v1/people/~:(id,first-name,last-name,headline,location:(name,country:(code)),industry,num-connections,num-connections-capped,summary,specialties,proposal-comments,associations,honors,interests,positions,publications,patents,languages,skills,certifications,educations,three-current-positions,three-past-positions,num-recommenders,recommendations-received,phone-numbers,im-accounts,twitter-accounts,date-of-birth,main-address,member-url-resources,picture-url,site-standard-profile-request:(url),api-standard-profile-request:(url,headers),public-profile-url)', accessToken, accessTokenSecret,
            function(err, data, response) {
                if(!err) {
                    res.send(data);
                } else {
                    res.send(err);
                }
            });
        } else {
            res.send({access:'Not allowed'});
        }
    });
    app.get('/interact/githubRepos', function(req, res) {
        res.contentType('application/json');
        if(req.session.github) {
            var accessToken = req.session.github.accessToken,
                accessTokenSecret = req.session.github.accessTokenSecret;
            var service;
            User.findById(req.session.auth.userId, function(err,user) {
                if(!err && user) {
                    var service = findService(user, 'github');
                    githubOAuth.get('https://github.com/api/v2/json/repos/show/' + service.data.login, accessToken,
                    function(err, data, response) {
                        if(!err) {
                            res.send(data);
                        } else {
                            res.send(err);
                        }
                    });
                } else {
                    res.send(err);
                }
            });
        } else {
            res.send({access:'Not allowed'});
        }
    });

};

exports.configure = configure;

