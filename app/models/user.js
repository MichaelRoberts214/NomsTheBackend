var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var UserSchema   = new Schema({
    name: {type: String, default: 'Generic User Name'},
    here: Boolean
});

module.exports = mongoose.model('User', UserSchema);
