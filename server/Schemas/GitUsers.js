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

var GitUserSchema = new mongoose.Schema({
    username: String,
    following: [FollowedUsers],
    gitUserData: mongoose.Schema.Types.Mixed
    // oauthToken: String,
    // totalLinesOfCode: Number, 
    // languages: [{language:String, lines:Number, percentage:Number}],
    // profileInfo: {
    //   name:String,
    //   company:String,
    //   blog:String, 
    //   location:String,
    //   email:String,
    //   hireable:Boolean,
    //   bio:String,
    //   public_repos:Number,
    //   private_repos:Number,
    //   public_gists:Number,
    //   followers:Number,
    //   following:Number,
    //   created_at:Date,
    //   updated_at:Date,
    // }
});

var FollowedUser = mongoose.model('FollowedUser',FollowedUsers);
var GitUser = mongoose.model('GitUser', GitUserSchema);

module.exports = GitUser;