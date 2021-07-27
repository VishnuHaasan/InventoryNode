var express = require('express');
var router = express.Router();
var genre_controller = require('../controller/genrecontroller');
var game_controller = require('../controller/gamecontroller');
var multer = require('multer');
const path = require('path');
const genrestorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, process.cwd() + '/public/images/genre');
  },
  filename: (req, file, cb) => {
    console.log(file);
    console.log(Date.now() + path.extname(file.originalname));
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const gamestorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, process.cwd() + '/public/images/game');
  },
  filename: (req, file, cb) => {
    console.log(file);
    console.log(Date.now() + path.extname(file.originalname));
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const genreupload = multer({ storage: genrestorage});
// GENRE ROUTES //
const gameupload = multer({storage: gamestorage});
// LIST GENRES
router.get('/genres', genre_controller.genre_list);

// CREATE GENRE GET
router.get('/genre/create', genre_controller.genre_create_get);

// CREATE GENRE POST
router.post('/genre/create', genreupload.single('genre-img'), genre_controller.genre_create_post);

//GET REQUEST TO DELETE A GENRE
router.get('/genre/:id/delete', genre_controller.genre_delete_get);

//POST REQUEST TO DELETE A GENRE
router.post('/genre/:id/delete', genre_controller.genre_delete_post);

//GET REQUEST TO UPDATE A GENRE
router.get('/genre/:id/update', genre_controller.genre_update_get);

//POST REQUEST TO UPDATE A GENRE
router.post('/genre/:id/update', genreupload.single('genre-img'), genre_controller.genre_update_post);

//GET REQUEST FOR A CERTAIN GENRE
router.get('/genre/:id', genre_controller.genre_detail);

// GAME ROUTES //

//LIST ROUTES
router.get('/games', game_controller.game_list);

// GET REQUEST FOR A CERTAIN GAME
router.get('/game/:id', game_controller.game_detail);

// GET REQUEST FOR GAME CREATE
router.get('/genre/:genreid/game/create', game_controller.game_create_get);

// POST REQUEST FOR GAME CREATE
router.post('/genre/:genreid/game/create',gameupload.single('game-img'), game_controller.game_create_post);

//GET REQUEST FOR GAME DELETE
router.get('/game/:id/delete', game_controller.game_delete_get);

//POST REQUEST FOR GAME DELETE
router.post('/game/:id/delete', game_controller.game_delete_post);

//GET REQUEST FOR GAME UPDATE
router.get('/game/:id/update', game_controller.game_update_get);

//POST REQUEST FOR GAME UPDATE
router.post('/game/:id/update',gameupload.single('game-img'), game_controller.game_update_post);

module.exports = router;