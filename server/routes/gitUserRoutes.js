var GitUsers = require('../Schemas/GitUsers');
//var FollowedUsers = require('../Schemas/Employers').FollowedUser;

module.exports = function(app){
  app.route('/:name')
    .get(function(req,res){
      GitUsers.findOne({username:req.params.name},function(err,gitUser){
        console.log("gitUser",gitUser);
        if(gitUser){
          res.send(gitUser);
        } else {
          res.send("");
        }
      });
    })
    .post(function(req,res){
      GitUsers.create({username:req.params.name,gitUserData:req.body},function(err,gitUser){
        res.send(gitUser);
      });
    })
    // .put(function(req,res){
    //   GitUsers.findOneAndUpdate(
    //     {name:req.params.name},
    //     {
    //     //http://docs.mongodb.org/manual/reference/operator/update/addToSet/
    //       $addToSet: {following: req.body}
    //     },
    //     {safe: true, upsert: true},
    //     function(err,gitUser){
    //       if(err) console.log(err);
    //       res.send(gitUser);
    //   });
    // })
    .delete(function(req,res){
      GitUsers
        .findOneAndRemove({name:req.params.name},
          function(err,gitUser){
            res.send('Deleted '+req.params.name);
          }
        );
    });

  app.route('/:name/following')
    .get(function(req,res){
      Employers
      .findOne({name:req.params.name})
      //.populate('following')
      .exec(function(err,employer){
        res.send(employer.following);
      })
    });

  app.route('/:name/nf')
    .get(function(req,res){
      GitUsers.findOne({username:req.params.name},function(err,gitUser){
        if(gitUser){
          res.send({username:gitUser.username,following:gitUser.following});
        } else {
          res.send("");
        }
      });
    })
    .post(function(req,res){
      GitUsers.create({username:req.params.name,gitUserData:req.body},function(err,gitUser){
        res.send({username:gitUser.username,following:gitUser.following});
      });
    })
}