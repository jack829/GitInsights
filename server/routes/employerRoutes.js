// var express = require('express');
// var router = express.Router();

var Employers = require('../Schemas/Employers');

module.exports = function(app){
  app.route('/:name')
    .get(function(req,res){
      res.send('Get '+req.params.name);
    })
    .post(function(req,res){
      res.send('Post '+req.params.name);
    })
    .put(function(req,res){
      res.send('Put '+req.params.name);
    })
    .delete(function(req,res){
      res.send('Delete '+req.params.name);
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