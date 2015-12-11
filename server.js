var express    = require('express');
var bodyParser = require('body-parser');
var mongoose   = require('mongoose');
var Restaurant = require('./app/models/restaurant');

var app        = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// mongoose.connect('mongodb://node:node@novus.modulusmongo.net:27017/Iganiq8o');
mongoose.connect('mongodb://admin:admin@ds059644.mongolab.com:59644/nomsdb');

var port = process.env.PORT || 8080;

// API ROUTES
var router = express.Router();

// middleware to use for all requests
router.use(function(req, res, next) {
  console.log('Logging: Something is happening.');
  next();
});

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {
  res.json({ message: 'Welcome to noms api' });   
});

// more routes for our API will happen here

// REGISTER ROUTES
// all routes will be prefixed with /api
app.use('/api', router);

// START THE SERVER
app.listen(port);
console.log('Magic happens on port ' + port);