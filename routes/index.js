var express = require('express');
const { header } = require('express/lib/request');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next){
  res.render('index', { title: 'Home' });
});

/* GET Menu page. */
router.get('/menu', (req, res) => {
  res.redirect('/menu.pdf');
});

/* GET About page. */
router.get('/about', function(req, res, next){
  res.render('about', { title: 'About Us' });
});



/* GET Reviews page. */
router.get('/reviews', function(req, res, next){
  res.render('reviews', { title: 'Reviews' });
  });

  module.exports = router;