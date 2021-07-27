var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var GameSchema = new Schema({
  title: {type: String, required: true},
  description: {type: String, required: true},
  genre: {type: Schema.Types.ObjectId, ref: 'Genre', required: true},
  cost: {type: Number, required: true},
  stock: {type: Number, required: true},
  file: {type: String, required: true}
});

GameSchema
.virtual('url')
.get(function(){
  return '/store/game/' + this._id;
});

GameSchema
.virtual('imgurl')
.get(function(){
  return '/images/game/' + this.file;
})


module.exports = mongoose.model('Game',GameSchema);