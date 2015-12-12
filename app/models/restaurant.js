var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var RestaurantSchema   = new Schema({
    name: String,
    votes: Number
});

module.exports = mongoose.model('Restaurant', RestaurantSchema);
