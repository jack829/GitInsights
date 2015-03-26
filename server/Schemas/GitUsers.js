var mongoose = require('mongoose');

var UserProfile = {
  name:String,
  company:String,
  blog:String, 
  location:String,
  email:String,
  hireable:Boolean,
  bio:String,
  public_repos:Number,
  private_repos:Number,
  public_gists:Number,
  followers:Number,
  following:Number,
  created_at:Date,
  updated_at:Date,
};

var GitUserSchema = new mongoose.Schema({
    username: String,
    oauthToken: String,
    totalLinesOfCode: Number, 
    languages: [{language:String, lines:Number, percentage:Number}],
    profileInfo: {
      name:String,
      company:String,
      blog:String, 
      location:String,
      email:String,
      hireable:Boolean,
      bio:String,
      public_repos:Number,
      private_repos:Number,
      public_gists:Number,
      followers:Number,
      following:Number,
      created_at:Date,
      updated_at:Date,
    }
});

var GitUser = mongoose.model('GitUser', GitUserSchema);

module.exports = GitUser;