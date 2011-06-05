var everyauth = require('everyauth');
var conf = require('./conf');

var usersByLinkedinId = {};
var usersByGhId = {};

everyauth.linkedin
    .myHostname(conf.url)
    .consumerKey(conf.linkedin.key)
    .consumerSecret(conf.linkedin.secret)
    .findOrCreateUser( function (session, accessToken, accessTokenSecret, linkedinUser) {
        return usersByLinkedinId[linkedinUser.id] || (usersByLinkedinId[linkedinUser.id] = linkedinUser);
    })
    .redirectPath('/');

everyauth.github
    .myHostname(conf.url)
    .appId(conf.github.id)
    .appSecret(conf.github.secret)
    .findOrCreateUser( function (sess, accessToken, accessTokenExtra, ghUser) {
        console.log(ghUser);
        return usersByGhId[ghUser.id] || (usersByGhId[ghUser.id] = ghUser);
    })
    .redirectPath('/');

//And finally define exports
exports.everyauth = everyauth;

