var mongoose = require('mongoose');
var conf = require('./conf');

var Schema = mongoose.Schema,
    ObjectId = mongoose.ObjectId;

mongoose.connect(conf.mongo_url);

var ServiceLink = new Schema({
    type : String,
    id : String,
    data : {}
});

var User = new Schema({
    slug  : { type: String, unique: true },
    email : { type: String, unique: true },
    registered : Boolean,
    services : [ServiceLink],
    created : Date
});

mongoose.model('User', User);

//Add exports
exports.User = mongoose.model('User');

