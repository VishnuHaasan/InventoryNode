var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var GenreSchema = new Schema({
  name: {type: String, required: true},
  description: {type: String, required: true},
  file: {type: String, required: true}
})

GenreSchema
.virtual('url')
.get(function(){
  return '/store/genre/' + this._id;
});

GenreSchema
.virtual('newgameurl')
.get(function(){
  return '/store/genre/' + this._id + '/game/create';
})

GenreSchema
.virtual('imgurl')
.get(function(){
  return '/images/genre/' + this.file;
})

module.exports = mongoose.model('Genre', GenreSchema);