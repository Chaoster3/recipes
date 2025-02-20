const express = require('express');
const router = express.Router();
const reviewsController = require('../controllers/reviews.controller');

router.get('/', reviewsController.getReviews);
router.post('/', reviewsController.addReview);

module.exports = router; 