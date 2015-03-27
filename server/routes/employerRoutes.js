// var express = require('express');
// var router = express.Router();

var Employers = require('../Schemas/Employers').Employer;
var FollowedUsers = require('../Schemas/Employers').FollowedUser;

module.exports = function(app){
  app.route('/:name')
    .get(function(req,res){
      Employers.findOne({name:req.params.name},function(err,employer){
        res.send('Get '+employer);
      });
    })
    .post(function(req,res){
      Employers.create({name:req.params.name},function(err,employer){
        res.send('Posted new employer:'+employer);
      });
    })
    .put(function(req,res){
      console.log(req.body);
      Employers.findOneAndUpdate(
        {name:req.params.name},
        {
        //http://docs.mongodb.org/manual/reference/operator/update/addToSet/
          $addToSet: {following: new FollowedUsers(req.body)._id}
        },
        {safe: true, upsert: true},
        function(err,employer){
          if(err) console.log(err);
          res.send('Updated employer:'+employer);
      });
    })
    .delete(function(req,res){
      Employers
        .findOneAndRemove({name:req.params.name},
          function(err,employer){
            res.send('Delete '+req.params.name);
          }
        );
    });

  app.route('/:name/following')
    .get(function(req,res){
      console.log("!!!",req.params.name);
      Employers
      .findOne({name:req.params.name})
      //.populate('following')
      .exec(function(err,employer){
        res.send('Get following '+employer.following);
      })
    });

  // router.get('/employer/:name', function(req, res, next) {
  //   var getThisName = req.params.name;
  //   Employers.findOne({name: getThisName},function(err,employerData){
  //     if(err){console.error(err);}
  //     res.send(employerData);
  //   });
  // });
}


//module.exports = router;