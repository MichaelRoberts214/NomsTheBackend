var express    = require('express');
var bodyParser = require('body-parser');
var mongoose   = require('mongoose');
var Restaurant = require('./app/models/restaurant');

var app        = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
var options = { server: { socketOptions: { keepAlive: 1, connectTimeoutMS: 30000 } }, 
                replset: { socketOptions: { keepAlive: 1, connectTimeoutMS : 30000 } } };       

mongoose.connect('mongodb://admin:admin@ds059644.mongolab.com:59644/nomsdb');

var conn = mongoose.connection;  
conn.on('error', console.error.bind(console, 'connection error:'));  

var port = process.env.PORT || 8080;

// Enable CORS
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Content-Type", "application/json");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// API ROUTES
var router = express.Router();

// middleware to use for all requests
router.use(function(req, res, next) {
  console.log('Logging: Something is happening.');
  next();
});

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {
  res.status(200).json({ message: 'Welcome to Noms: The Api™' });   
});

router.route('/restaurants')
  .post(function(req, res) {
    console.log(req.body);
    var restaurant = new Restaurant();
    restaurant.name = req.body.name;
    restaurant.votes = req.body.votes;
    restaurant.save(function(err) {
      if (err) {
      	res.send(500, { error: 'POST restaurants failed.' });
      } else {
      	res.status(200).json({ message: 'Restaurant created.' });
      }
    });
  })

  .get(function(req, res) {
    Restaurant.find(function(err, restaurants) {
      if (err) {
        res.send(500, {error: 'GET restaurants failed.'});
      } else {
      	res.status(200).json(restaurants);
      }
    });
  });

router.route('/restaurants/:restaurant_id')
  .get(function(req, res) {
    Restaurant.findById(req.params.restaurant_id, function(err, restaurant) {
      if (err) {
        res.status(500).send(err);
      } else {
    		res.status(200).json(restaurant);
      }
    });
  })

  .put(function(req, res) {
    Restaurant.findById(req.params.restaurant_id, function(err, restaurant) {
      if (err) {
        res.status(500).send(err);
      }
      restaurant.name = req.body.name;
      restaurant.save(function(err) {
        if (err) {
          res.status(500).send(err);
        }
        res.status(200).json({ message: 'Restaurant updated' });
      });
    })
   })

  .delete(function(req, res) {
      Restaurant.remove({
        _id: req.params.restaurant_id
      }, function(err, restaurant) {
        if (err) {
            res.status(500).send(err);
        }
        res.status(200).json({ message: 'Successfully deleted.' });
      });
    });

// REGISTER ROUTES
// all routes will be prefixed with /api
app.use('/api', router);

// START THE SERVER
app.listen(port);
console.log('Magic happens on port ' + port);