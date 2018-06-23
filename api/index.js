var express = require('express');
var router = express.Router();

var movies = require('./movies.js');
var casts = require('./casts.js');
var directors = require( './directors.js');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

router.get('/movies', movies.defaultRoute);
router.get('/sortMoviesRoute',movies.sortMoviesRoute);
router.get('/areaQueryMoviesRoute',movies.areaQueryMoviesRoute);
router.get('/searchMoviesRoute',movies.searchMoviesRoute);
router.get('/getYearMovies',movies.getYearMovies);

router.get('/casts', casts.defaultRoute);
router.get('/castspaging', casts.castspaging);
router.get('/deleteCasts',casts.deleteCasts);
router.get('/addCastsRoute',casts.addCastsRoute);
router.post('/addCastsAction',casts.addCastsAction);
router.get('/updateCastsRoute', casts.updateCastsRoute);


router.get('/directors', directors.defaultRoute);

module.exports = router;
