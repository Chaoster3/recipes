const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Import routes
const authRoutes = require('../routes/auth.routes');
const recipesRoutes = require('../routes/recipes.routes');
const favoritesRoutes = require('../routes/favorites.routes');
const reviewsRoutes = require('../routes/reviews.routes');

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use('/', authRoutes);
app.use('/recipes', recipesRoutes);
app.use('/favorites', favoritesRoutes);
app.use('/reviews', reviewsRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

module.exports = app;