var express = require('express');
var bodyparser = require('body-parser');
var morgan = require('morgan')

// var GitUsers = require('./Schemas/GitUsers');
// var Employers = require('./Schemas/Employers');

// var mongoose = require('mongoose');
// var mongoURI = process.env.MONGO || 'mongodb://localhost/gitInsights';
// mongoose.connect(mongoURI);
// var db = mongoose.connection;

module.exports = function (app) {

  app.use(bodyparser.json());
  app.use(morgan('dev'));
  app.use(express.static(__dirname + '/../client'))

  app.get('/', function (req, res) {
    res.sendFile('index.html');
  });

}