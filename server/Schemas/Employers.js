var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var EmployerSchema = new Schema({
  name:  {type:String, required:true}
  following: [{
    username: String,
    name: String,
    profileThumbUrl: String,
    lastViewed: Date,
    lastUpdated: Date,
    notes: [{
      note: String,
      noteStub: String, 
      timeWritten: Date}] 
  }],
});

var Employer = mongoose.model('Employer', EmployerSchema);

module.exports = Employer;