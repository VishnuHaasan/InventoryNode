var Game = require('../models/game');
var Genre = require('../models/genre');
var async = require('async');
const {body,validationResult} = require('express-validator');
const { render } = require('pug');
const fs = require('fs');
exports.game_list = function(req, res, next){
  Game.find({})
    .populate('genre')
    .exec(function(err, game){
      if(err){
        return next(err);
      }
      res.render('game_list', {title: 'Games list',games: game});
    })
}

exports.game_detail = function(req, res, next) {
  Game.findById(req.params.id)
    .populate('genre')
    .exec(function(err, game){
      if(err){
        return next(err);
      }
      console.log(game);
      res.render('game_detail', {title: 'Game Page',game: game});
    })
}

exports.game_create_get = function(req, res, next) {
  Genre.findById(req.params.genreid)
    .exec(function(err, genre){
      if(err){
        console.log(err);
        return next(err);
      }
      res.render('game_form', {title: 'Create Game',genre: genre, isUpdate: false});
    })
}

exports.game_create_post = [body('title', 'Title is required').trim().isLength({min: 1}).escape(),body('description', 'Description is necessary').trim().isLength({min: 1}).escape(),body('cost', 'Cost is required').isNumeric().trim().escape(),body('stock', 'Stock is required').isNumeric().trim().escape(), (req, res, next) => {
  const errors = validationResult(req);

  if(!errors.isEmpty()){
    res.render('game_form', {title: 'Create Game',game: req.body, errors: errors.array(), isUpdate: false});
    return;
  }
  else{
    var game = new Game({
      title: req.body.title,
      description: req.body.description,
      cost: req.body.cost,
      stock: req.body.stock,
      genre: req.params.genreid,
      file: req.file.filename
    });

    game.save(function(err){
      if(err){
        return next(err);
      }
      res.redirect(game.url);
    })
  }
}]

exports.game_delete_get = function(req, res, next){
  Game.findById(req.params.id)
    .populate('genre')
    .exec(function(err, game){
      if(err){
        return next(err);
      }
      if(game==null){
        res.redirect('/store/games');
      }
      res.render('game_delete', {title: 'Delete Game',game: game, genre: game.genre,pwd: ''});
    })
}

exports.game_delete_post = function(req, res, next){
  Game.findById(req.params.id)
    .populate('genre')
    .exec(function(err, game){
      if(err){
        return next(err);
      }
      if(req.body.password!==process.env['ADMIN_PWD']){
        res.render('game_delete', {title: 'Delete Game',game: game, genre: game.genre,pwd: 'The administrator password is incorrect'});
        return;
      }
      else{
        const filepath = '/images/game/' + game.file;
        fs.unlink("public" + filepath, (err) => {
          if(err)
          console.log(err);
        })
        Game.findByIdAndRemove(game._id, function(err){
          if(err){
            return next(err);
          }
          res.redirect('/store/games');
        })
      }
    })
}

exports.game_update_get = function(req, res, next){
  Game.findById(req.params.id)
    .populate('genre')
    .exec(function(err, game){
      if(err){
        return next(err);
      }
      res.render('game_form', {title: 'Update Game',game: game, genre: game.genre, isUpdate: true});
    })
}

exports.game_update_post = [body('title', 'Title is required').trim().isLength({min: 1}).escape(),body('description', 'Description is necessary').trim().isLength({min: 1}).escape(),body('cost', 'Cost is required').isNumeric().trim().escape(),body('stock', 'Stock is required').isNumeric().trim().escape(), (req, res, next) => {
  const errors = validationResult(req);
  const file = req.file;
  var filename = file;
  Game.findById(req.params.id)
    .populate('genre')
    .exec(function(err, game){
      if(err){
        return next(err);
      }
      if(req.body.password!==process.env['ADMIN_PWD']){
        res.render('game_form', {title: 'Update Game',game: game,genre: game.genre, errors: errors.array(), isUpdate: true, pwd: 'The administrator password is incorrect.'});
        return;
      }
      if(file==undefined){
        filename = game.file;
      }
      else{
        filename = file.filename;
        const filepath = '/images/game/' + game.file;
        fs.unlink('public' + filepath,(err) => {
          if(err)
          console.log(err);
        })
        var game = new Game({
          title: req.body.title,
          description: req.body.description,
          cost: req.body.cost,
          stock: req.body.stock,
          genre: req.body.genreid,
          _id: req.params.id,
          file: filename
        });
      
        if(!errors.isEmpty()){
          res.render('game_form', {title: 'Update Game',game: game,genre: game.genre, errors: errors.array(), isUpdate: true, pwd: ''});
          return;
        }
        
        else{
          Game.findByIdAndUpdate(game._id, game, function(err, thegame){
            if(err){
              return next(err);
            }
            res.redirect(thegame.url);
          })
        }
      }
    })
}]