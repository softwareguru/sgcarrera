var model = require('./model');
var conf = require('./conf');
var OAuth = require('oauth').OAuth;

configure = function(app) {
    app.get('/interact/importLinkedin', function(req, res) {
        res.contentType('application/json');
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
        if(req.session.linkedin) {
            var accessToken = req.session.linkedin.accessToken,
                accessTokenSecret = req.session.linkedin.accessTokenSecret;
            linkedinOAuth.get('http://api.linkedin.com/v1/people/~:full', accessToken, accessTokenSecret,
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
};

exports.configure = configure;

