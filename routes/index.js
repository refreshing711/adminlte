var express = require('express');
var router = express.Router();

var multer =require('multer');
var upload = multer({
  dest : 'uploads/'
})

var movies = require('./movies.js');
var casts = require('./casts.js');
var directors = require( './directors.js');
var amdin = require( './admin.js');
var banner = require( './banner' );

/* GET home page. */
router.get('/', function(req, res, next) {
  // console.log( req.cookies );

  var type = req.cookies.loginState == 1? 'index' : 'login';

  res.render( type );
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

router.get('/amdin', amdin.defaultRoute);
router.post('/adminLoginAction',amdin.adminLoginAction);
router.get('/adminLogOut', amdin.adminLogOut);

router.get('/banner', banner.defaultRoute);
router.get('/addBannerRouter', banner.addBannerRouter);
router.post('/addBannerAction', upload.single('bannerimg'), banner.addBannerAction);

module.exports = router;
