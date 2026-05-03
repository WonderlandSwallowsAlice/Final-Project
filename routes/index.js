var express = require('express');
const { header } = require('express/lib/request');
const escape = require('escape-html');
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



/* GET Reviews page */
router.get('/reviews', (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = 10;
  const offset = (page - 1) * limit;

  const countQuery = 'SELECT COUNT(*) AS total FROM reviews';
  const dataQuery = 'SELECT * FROM reviews ORDER BY created_at DESC LIMIT ? OFFSET ?';

  req.db.query(countQuery, (err, countResult) => {
    if (err) {
      console.error('Error fetching reviews:', err);
      return res.render('reviews', {
        title: 'Reviews',
        reviews: [],
        error: 'Could not load reviews. Please try again later.',
        currentPage: 1,
        totalPages: 1
      });
    }

    const total = countResult[0].total;
    const totalPages = Math.ceil(total / limit);

    req.db.query(dataQuery, [limit, offset], (err, results) => {
      if (err) {
        console.error('Error fetching reviews:', err);
        return res.render('reviews', {
          title: 'Reviews',
          reviews: [],
          error: 'Could not load reviews. Please try again later.',
          currentPage: page,
          totalPages
        });
      }

      res.render('reviews', {
        title: 'Reviews',
        reviews: results,
        currentPage: page,
        totalPages,
        error: null
      });
    });
  });
});

/* POST Reviews page */
router.post('/reviews', (req, res) => {
  const username = escape(req.body.username?.trim());
  const comment = escape(req.body.comment?.trim());
  const errors = [];

  // Server-side validation
  if (!username) errors.push('Name cannot be empty.');
  if (!comment) errors.push('Comment cannot be empty.');
  if (username.length > 50) errors.push('Name cannot exceed 50 characters.');
  if (comment.length > 500) errors.push('Comment cannot exceed 500 characters.');

  if (errors.length > 0) {
    return res.render('reviews', {
      title: 'Reviews',
      reviews: [],
      error: errors.join(' '),
      currentPage: 1,
      totalPages: 1
    });
  }

  const query = 'INSERT INTO reviews (username, comment) VALUES (?, ?)';
  req.db.query(query, [username, comment], (err) => {
    if (err) {
      console.error('Error saving review:', err);
      return res.render('reviews', {
        title: 'Reviews',
        reviews: [],
        error: 'Could not save your review. Please try again later.',
        currentPage: 1,
        totalPages: 1
      });
    }
    res.redirect('/reviews');
  });
});

  module.exports = router;