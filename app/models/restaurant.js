var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var RestaurantSchema   = new Schema({
    name: {type: String, default: 'Adjective Plural Noun'},
    votes: {type: Number, default: 0}
});

module.exports = mongoose.model('Restaurant', RestaurantSchema);
