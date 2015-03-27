var express = require('express');
var bodyparser = require('body-parser');
var morgan = require('morgan')


module.exports = function (app,express) {
  var employerRouter = express.Router();

  app.use(bodyparser.json());
  app.use(morgan('dev'));
  app.use(express.static(__dirname + '/../client'))

  app.get('/', function (req, res) {
    res.sendFile('index.html');
  });

  app.use('/employer', employerRouter);

  require('./routes/employerRoutes.js')(employerRouter);

}