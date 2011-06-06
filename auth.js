var everyauth = require('everyauth');
var conf = require('./conf');
var model = require('./model');

var usersByLinkedinId = {};

var Promise = everyauth.Promise;
var User = model.User;

var searchForService = function(user, serviceName) {
    for(var i = 0; i < user.services.length; i++) {
        if(user.services[i].type === serviceName) {
            return user.services[i];
        }
    }
};

everyauth.linkedin
    .myHostname(conf.url)
    .consumerKey(conf.linkedin.key)
    .consumerSecret(conf.linkedin.secret)
    .findOrCreateUser( function (session, accessToken, accessTokenSecret, linkedinUser) {
        var promise = new Promise();

        session.linkedin = {  accessToken: accessToken, accessTokenSecret: accessTokenSecret };

        if(session.auth && session.auth.loggedIn) {
            User.findById(session.auth.userId, function(err,user) {
                if(!err) {
                    if(!searchForService(user, 'linkedin')) {
                        user.services.push({
                            type: 'linkedin',
                            id: linkedinUser.id,
                            data: linkedinUser
                        });
                        user.save();
                    }
                    return promise.fulfill(user);
                }
            });
        } else {
            User.findOne({
                'services.type':'linkedin',
                'services.id': linkedinUser.id
            }, function(err, user) {
                if(!err && user) {
                    return promise.fulfill(user);
                } else {
                    var newUser = new User({
                        slug:'',
                        email:'',
                        registered: false,
                        services: [
                            {
                                type: 'linkedin',
                                id: linkedinUser.id,
                                data: linkedinUser
                            }
                        ],
                        created: new Date()
                    });
                    newUser.save();
                    return promise.fulfill(newUser);
                }
            });
        }
        return promise;
    })
    .redirectPath('/');

everyauth.github
    .myHostname(conf.url)
    .appId(conf.github.id)
    .appSecret(conf.github.secret)
    .findOrCreateUser( function (session, accessToken, accessTokenSecret, ghUser) {
        var promise = new Promise();
        session.github = {  accessToken: accessToken, accessTokenSecret: accessTokenSecret };
        if(session.auth && session.auth.loggedIn) {
            User.findById(session.auth.userId, function(err,user) {
                if(!err) {
                    if(!searchForService(user, 'github')) {
                        user.services.push({
                            type: 'github',
                            id: String(ghUser.id),
                            data: ghUser
                        });
                        user.save();
                    }
                    return promise.fulfill(user);
                }
            });
        } else {
            User.findOne({
                'services.type':'github',
                'services.id': String(ghUser.id)
            }, function(err, user) {
                if(!err && user) {
                    return promise.fulfill(user);
                } else {
                    var newUser = new User({
                        slug:'',
                        email:'',
                        registered: false,
                        services: [
                            {
                                type: 'github',
                                id: String(ghUser.id),
                                data: ghUser
                            }
                        ],
                        created: new Date()
                    });
                    newUser.save();
                    return promise.fulfill(newUser);
                }
            });
        }
        return promise;
    })
    .redirectPath('/');

