var mongoose = require('mongoose');
var conf = require('./conf');

var Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

mongoose.connect(conf.mongo_url);

var School = new Schema({
    name: { type: String, unique: true },
    md5: String
});

var Company = new Schema({
    name: { type: String, unique: true },
    md5: String
});

var Education = new Schema({
    title: String,
    summary: String,
    start: Date,
    end: Date,
    school: String
});

var Job = new Schema({
    title: String,
    summary: String,
    start: Date,
    end: Date,
    company: String
});

var Skill = new Schema({
    name: String,
    level: Number
});

var DominantSkill = new Schema({
    name: String,
    level: Number
});

var ServiceLink = new Schema({
    type : String,
    id : String,
    data : {}
});

var Publication = new Schema({
    title: String,
    url: String
});

var User = new Schema({
    slug  : { type: String, unique: true },
    email : { type: String, unique: true },
    registered : Boolean,
    title: String,
    name: String,
    lastNames: String,
    place: String,
    url: [String],
    phone: [String],
    summary: String,
    filled: Boolean,
    services : [ServiceLink],
    skills: [Skill],
    jobs: [Job],
    educations: [Education],
    affiliations: [String],
    publications: [Publication],
    created : Date
});

mongoose.model('User', User);
mongoose.model('DominantSkill', DominantSkill);
mongoose.model('Company', Company);
mongoose.model('School', School);

//Add exports
exports.User = mongoose.model('User');
exports.DominantSkill = mongoose.model('DominantSkill');
exports.Company = mongoose.model('Company');
exports.School = mongoose.model('School');

