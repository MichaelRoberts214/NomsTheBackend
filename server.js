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

router.route('/restaurants')
  .post(function(req, res) {
    var restaurant = new Restaurant();
    restaurant.name = req.body.name;
    restaurant.save(function(err) {
      if (err) {
      	res.send(500, { error: 'POST restaurants failed.' });
      } else {
      	res.json({ message: 'Restaurant created.' });
      }
    });
  })

  .get(function(req, res) {
    Restaurant.find(function(err, restaurants) {
      if (err) {
        res.send(500, {error: 'GET restaurants failed.'});
      } else {
      	res.json(restaurants);
      }
    });
  });

router.route('/restaurants/:restaurant_id')
  .get(function(req, res) {
    Restaurant.findById(req.params.restaurant_id, function(err, restaurant) {
      if (err) {
        res.send(err);
      } else {
    		res.json(bear);
      }
    });
  })

  .put(function(req, res) {
    Restaurant.findById(req.params.bear_id, function(err, restaurant) {
      if (err) {
        res.send(err);
      }
      restaurant.name = req.body.name;
      restaurant.save(function(err) {
        if (err) {
          res.send(err);
        }
        res.json({ message: 'Restaurant updated' });
      });
    })
   })

  .delete(function(req, res) {
      Restaurant.remove({
        _id: req.params.restaurant_id
      }, function(err, restaurant) {
        if (err) {
            res.send(err);
        }
        res.json({ message: 'Successfully deleted.' });
      });
    });

// REGISTER ROUTES
// all routes will be prefixed with /api
app.use('/api', router);

// START THE SERVER
app.listen(port);
console.log('Magic happens on port ' + port);