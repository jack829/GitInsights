var mongoose = require('mongoose');

var FollowedUsers = new mongoose.Schema({
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

var EmployerSchema = new mongoose.Schema({
  name:  {type:String, required:true},
  following: [FollowedUsers],
});

var FollowedUser = mongoose.model('FollowedUser',FollowedUsers);
var Employer = mongoose.model('Employer', EmployerSchema);

module.exports.Employer = Employer;
module.exports.FollowedUser = FollowedUser;