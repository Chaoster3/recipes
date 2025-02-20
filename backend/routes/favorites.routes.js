const express = require('express');
const router = express.Router();
const favoritesController = require('../controllers/favorites.controller');

router.get('/:username', favoritesController.getFavorites);
router.post('/', favoritesController.addFavorite);
router.get('/check/:username/:recipeId', favoritesController.checkFavorite);
router.delete('/', favoritesController.removeFavorite);

module.exports = router; 