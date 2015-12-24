var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var ClientSchema   = new Schema({
	firstName: String,
  lastName: String,
  email: String
});

module.exports = mongoose.model('Client', ClientSchema);
