const express = require('express');
const router = express.Router();
const recipesController = require('../controllers/recipes.controller');

router.get('/random', recipesController.getRandomRecipes);
router.get('/search', recipesController.searchRecipes);

module.exports = router; 