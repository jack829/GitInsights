

var Employers = require('../Schemas/Employers').Employer;
//var FollowedUsers = require('../Schemas/Employers').FollowedUser;

module.exports = function(app){
  console.log("in employer router")
  app.route('/:name')
    .get(function(req,res){
      Employers.findOne({name:req.params.name},function(err,employer){
        res.send(employer);
      });
    })
    .post(function(req,res){
      Employers.create({name:req.params.name},function(err,employer){
        res.send(employer);
      });
    })
    .put(function(req,res){
      Employers.findOneAndUpdate(
        {name:req.params.name},
        {
        //http://docs.mongodb.org/manual/reference/operator/update/addToSet/
          $addToSet: {following: req.body}
        },
        {safe: true, upsert: true},
        function(err,employer){
          if(err) console.log(err);
          res.send(employer);
      });
    })
    .delete(function(req,res){
      Employers
        .findOneAndRemove({name:req.params.name},
          function(err,employer){
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
}
