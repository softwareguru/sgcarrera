var everyauth = require('everyauth');
var conf = require('./conf');
var model = require('./model');

var usersByLinkedinId = {};

var Promise = everyauth.Promise;
var User = model.User;

everyauth.linkedin
    .myHostname(conf.url)
    .consumerKey(conf.linkedin.key)
    .consumerSecret(conf.linkedin.secret)
    .findOrCreateUser( function (session, accessToken, accessTokenSecret, linkedinUser) {
        var promise = new Promise();
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
        return promise;
    })
    .redirectPath('/');

everyauth.github
    .myHostname(conf.url)
    .appId(conf.github.id)
    .appSecret(conf.github.secret)
    .findOrCreateUser( function (sess, accessToken, accessTokenExtra, ghUser) {
        var promise = new Promise();
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
        return promise;
    })
    .redirectPath('/');

