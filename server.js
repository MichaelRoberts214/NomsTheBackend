var express    = require('express');
var bodyParser = require('body-parser');
var mongoose   = require('mongoose');
var Restaurant = require('./app/models/restaurant');
var User = require('./app/models/user');

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
  res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
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
    var restaurant = new Restaurant();
    restaurant.name = req.body.restaurant.name || req.body.name || restaurant.name;
    restaurant.votes = req.body.restaurant.votes || req.body.votes || restaurant.votes;
    var name = restaurant.name
    restaurant.save(function(err) {
      if (err) {
      	res.send(500, { error: 'POST restaurants failed.' });
      } else {
        Restaurant.findOne({name: name}, function(err, resta) {
          console.log(resta);
          // this doesn't work
      	  res.status(200).json(resta);
        })
      }
    });
  })

  .get(function(req, res) {
    Restaurant.find(function(err, restaurants) {
      if (err) {
        res.send(500, {error: 'GET restaurants failed.'});
      } else {
      	res.status(200).json({"restaurants": restaurants});
      }
    });
  });

router.route('/restaurants/:restaurant_id')
  .get(function(req, res) {
    Restaurant.findById(req.params.restaurant_id, function(err, restaurant) {
      if (err) {
        res.status(500).send(err);
      } else {
    		res.status(200).json({"restaurant": restaurant});
      }
    });
  })

  .put(function(req, res) {
    Restaurant.findById(req.params.restaurant_id, function(err, restaurant) {
      if (err) {
        res.status(500).send(err);
      }
      restaurant.name = req.body.restaurant.name || req.body.name || restaurant.name;
      restaurant.votes = req.body.restaurant.votes || req.body.votes || restaurant.votes;
      restaurant.save(function(err) {
        if (err) {
          res.status(500).send(err);
        }
        res.status(200).json({ message: req.body });
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

// USER routes
router.route('/users')
  .post(function(req, res) {
    var user = new User();
    user.name = req.body.user.name || req.body.name || user.name;
    user.votes = req.body.user.votes || req.body.votes || user.votes;
    var name = user.name
    user.save(function(err) {
      if (err) {
      	res.send(500, { error: 'POST users failed.' });
      } else {
        User.findOne({name: name}, function(err, resta) {
          console.log(resta);
          // this doesn't work
      	  res.status(200).json(resta);
        })
      }
    });
  })

  .get(function(req, res) {
    User.find(function(err, users) {
      if (err) {
        res.send(500, {error: 'GET users failed.'});
      } else {
      	res.status(200).json({"users": users});
      }
    });
  });

router.route('/users/:user_id')
  .get(function(req, res) {
    User.findById(req.params.user_id, function(err, user) {
      if (err) {
        res.status(500).send(err);
      } else {
    		res.status(200).json({"user": user});
      }
    });
  })

  .put(function(req, res) {
    User.findById(req.params.user_id, function(err, user) {
      if (err) {
        res.status(500).send(err);
      }
      user.name = req.body.user.name || req.body.name || user.name;
      user.votes = req.body.user.votes || req.body.votes || user.votes;
      user.save(function(err) {
        if (err) {
          res.status(500).send(err);
        }
        res.status(200).json({ message: req.body });
      });
    })
   })

  .delete(function(req, res) {
      User.remove({
        _id: req.params.user_id
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
