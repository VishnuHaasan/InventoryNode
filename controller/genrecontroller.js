var Genre = require('../models/genre');
var Game = require('../models/game');
var async = require('async');
const {body,validationResult} = require('express-validator');
const fs = require('fs');
const path = require('path');
// DISPLAY LIST OF GENRES
exports.genre_list = function(req, res, next){
  Genre.find({})
    .exec(function(err, genres){
      if(err){
        return next(err);
      }
      res.render('genre_list', {title: 'Genre List', genres: genres});;
    })
}

// DISPLAY DETAIL OF GENRES
exports.genre_detail = function(req, res, next){
  async.parallel({
    genre: function(callback){
      Genre.findById(req.params.id).exec(callback)
    },
    games: function(callback){
      Game.find({'genre': req.params.id}).exec(callback)
    },
  }, function(err, results){
    if(err){
      return next(err);
    }
    res.render('genre_detail', {title: 'Genre Detail',genre: results.genre, genre_games: results.games});
  })
}

exports.genre_create_get = function(req, res, next){
  res.render('genre_form', {title: 'Genre Create', isUpdate: false});
}

exports.genre_create_post = [body('name', 'Name of genre is required').trim().isLength({min: 1}).escape(), body('description', 'Description is required').trim().isLength({min: 1}).escape(),(req,res,next) => {
  const errors = validationResult(req);

  if(!errors.isEmpty()){
    res.render('genre_form', {title: 'Genre Create',genre: req.body, errors: errors.array(), isUpdate: false});
    return;
  }
  else{
    var genre = new Genre({
      name: req.body.name,
      description: req.body.description,
      file: req.file.filename
    });

    console.log(genre)

    genre.save(function(err, thegenre){
      if(err){
        return next(err);
      }
      res.redirect(thegenre.url);
    })
  }
}]

exports.genre_delete_get = function(req, res, next){
  async.parallel({
    genre: function(callback){
      Genre.findById(req.params.id).exec(callback)
    },
    games: function(callback){
      Game.find({'genre': req.params.id}).exec(callback)
    },
  },function(err, results){
    if(err){
      return next(err);
    }
    if(results.genre==null){
      res.redirect('/store/genres');
    }
    res.render('genre_delete', {title: 'Genre Delete',genre: results.genre, genre_games: results.games,pwd: ''})
  })
}

exports.genre_delete_post = function(req, res, next){
  async.parallel({
    genre: function(callback){
      Genre.findById(req.body.genreid).exec(callback)
    },
    games: function(callback){
      Game.find({'genre': req.body.genreid}).exec(callback)
    }
  }, function(err, results){
    if(err){
      return next(err);
    }
    if(req.body.password!==process.env['ADMIN_PWD']){
      res.render('genre_delete', {title: 'Genre Delete',genre: results.genre, genre_games: results.games,pwd: 'The administrator password is incorrect.'});
      return;
    }
    if(results.games.length > 0){
      res.render('genre_delete', {title: 'Genre Delete',genre: result.genre, genre_games: result.games})
    }
    else{
      const filepath = '/images/genre/' + results.genre.file;
      fs.unlink("public" + filepath, (err) => {
        if(err)
        console.log(err);
      })
      Genre.findByIdAndRemove(results.genre._id, function(err){
        if(err){
          return next(err);
        }
        res.redirect('/store/genres');
      })
    }
  });
};

exports.genre_update_get = function(req, res, next){
  Genre.findById(req.params.id)
    .exec(function(err, genre){
      if(err){
        return next(err);
      }
      res.render('genre_form', {title: 'Genre Update',genre: genre, isUpdate: true});
    })
}

exports.genre_update_post = [body('name', 'Name of genre is required').trim().isLength({min: 1}).escape(), body('description', 'Description is required').trim().isLength({min: 1}).escape(),(req,res,next) => {
  const errors = validationResult(req);
  const file = req.file;
  var filename = file;
  Genre.findById(req.params.id)
    .exec(function(err, genre){
      if(err){
        return next(err);
      }
      if(req.body.password!==process.env['ADMIN_PWD']){
        res.render('genre_form', {title: 'Genre Update',genre: genre, errors: errors.array(), isUpdate: true, pwd: 'The administrator password is incorrect.'});
        return;
      }
      if(file==undefined){
        filename = genre.file;
      }
      else{
        filename = file.filename;
        const filepath = '/images/genre/' + genre.file;
        fs.unlink("public" + filepath,(err) => {
          if(err)
          console.log(err);
        })
      }
      var genre = new Genre({
        name: req.body.name,
        description: req.body.description,
        _id: req.params.id,
        file: filename
      })
    
      if(!errors.isEmpty()){
        res.render('genre_form', {title: 'Genre Update',genre: genre, errors: errors.array(), isUpdate: true, pwd: ''});
        return;
      }
    
      else{
        Genre.findByIdAndUpdate(genre._id, genre, function(err, thegenre){
          if(err){
            return next(err);
          }
          res.redirect(thegenre.url);
        });
      }
    })
}]
