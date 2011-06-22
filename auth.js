var everyauth = require('everyauth');
var conf = require('./conf');
var model = require('./model');

var usersByLinkedinId = {};

var Promise = everyauth.Promise;
var User = model.User;

var searchForService = function(user, serviceName) {
    if(user.service) {
        for(var i = 0; i < user.services.length; i++) {
            if(user.services[i].type === serviceName) {
                return user.services[i];
            }
        }
    }
};

everyauth.everymodule.logoutRedirectPath(conf.url + '/');

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
                        slug:String(linkedinUser.id),
                        email:String(linkedinUser.id),
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
    .redirectPath(conf.url + "/");

everyauth.github
    .myHostname(conf.url)
    .appId(conf.github.id)
    .appSecret(conf.github.secret)
    .scope('repo')
    .findOrCreateUser( function (session, accessToken, accessTokenSecret, ghUser) {
        var promise = new Promise();

        var githubNewFunc = function() {
            User.findOne({
                'services.type':'github',
                'services.id': String(ghUser.id)
            }, function(err, user) {
                if(!err && user) {
                    return promise.fulfill(user);
                } else {
                    var newUser = new User({
                        slug:String(ghUser.id),
                        email:String(ghUser.id),
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
        };

        session.github = {  accessToken: accessToken, accessTokenSecret: accessTokenSecret };
        ghUser.accessToken = accessToken;
        ghUser.accessTokenSecret = accessTokenSecret;
        if(session.auth && session.auth.loggedIn) {
            User.findById(session.auth.userId, function(err,user) {
                if(!err && user) {
                    if(!searchForService(user, 'github')) {
                        user.services.push({
                            type: 'github',
                            id: String(ghUser.id),
                            data: ghUser
                        });
                        user.save();
                    }
                    return promise.fulfill(user);
                } else {
                    githubNewFunc();
                }
            });
        } else {
            githubNewFunc();
        }
        return promise;
    })
    .redirectPath(conf.url + "/");

everyauth.facebook
    .myHostname(conf.url)
    .appId(conf.facebook.id)
    .appSecret(conf.facebook.secret)
    .findOrCreateUser( function (session, accessToken, accessTokenSecret, fbUser) {
        var promise = new Promise();
        session.facebook = {  accessToken: accessToken, accessTokenSecret: accessTokenSecret };
        fbUser.accessToken = accessToken;
        fbUser.accessTokenSecret = accessTokenSecret;
        if(session.auth && session.auth.loggedIn) {
            User.findById(session.auth.userId, function(err,user) {
                if(!err) {
                    if(!searchForService(user, 'facebook')) {
                        user.services.push({
                            type: 'facebook',
                            id: String(fbUser.id),
                            data: fbUser
                        });
                        user.save();
                    }
                    return promise.fulfill(user);
                }
            });
        } else {
            User.findOne({
                'services.type':'facebook',
                'services.id': String(fbUser.id)
            }, function(err, user) {
                if(!err && user) {
                    return promise.fulfill(user);
                } else {
                    var newUser = new User({
                        slug:String(fbUser.id),
                        email:String(fbUser.id),
                        registered: false,
                        services: [
                            {
                                type: 'github',
                                id: String(fbUser.id),
                                data: fbUser
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
    .redirectPath(conf.url + "/");


everyauth.twitter
    .myHostname(conf.url)
    .consumerKey(conf.twitter.key)
    .consumerSecret(conf.twitter.secret)
    .findOrCreateUser( function (session, accessToken, accessTokenSecret, twitUser) {
        var promise = new Promise();
        session.twitter = {  accessToken: accessToken, accessTokenSecret: accessTokenSecret };
        if(session.auth && session.auth.loggedIn) {
            User.findById(session.auth.userId, function(err,user) {
                if(!err) {
                    if(!searchForService(user, 'twitter')) {
                        user.services.push({
                            type: 'twitter',
                            id: String(twitUser.id),
                            data: twitUser
                        });
                        user.save();
                    }
                    return promise.fulfill(user);
                }
            });
        } else {
            User.findOne({
                'services.type':'twitter',
                'services.id': String(twitUser.id)
            }, function(err, user) {
                if(!err && user) {
                    return promise.fulfill(user);
                } else {
                    var newUser = new User({
                        slug: String(twitUser.id),
                        email:String(twitUser.id),
                        registered: false,
                        services: [
                            {
                                type: 'twitter',
                                id: String(twitUser.id),
                                data: twitUser
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
    .redirectPath(conf.url + "/");

