var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var FollowedUsers = new Schema({
    username: String,
    name: String,
    profileThumbUrl: String,
    lastViewed: Date,
    lastUpdated: Date,
    notes: [{
      note: String,
      noteStub: String, 
      timeWritten: Date
    }] 
});

var EmployerSchema = new Schema({
  name:  {type:String, required:true},
  following: [
    {
      type: Schema.Types.ObjectId,
      ref: 'FollowedUsers'
    }
  ],
});

var Employer = mongoose.model('Employer', EmployerSchema);

module.exports = Employer;