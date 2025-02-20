const fetch = require('node-fetch');

const getRandomRecipes = async (req, res) => {
    try {
        const response = await fetch(
            `https://api.spoonacular.com/recipes/random?number=3&apiKey=${process.env.SPOONACULAR_API_KEY}&includeNutrition=false`
        );
        
        if (!response.ok) {
            throw new Error('Failed to fetch recipes');
        }

        const data = await response.json();
        const transformed = {
            results: data.recipes
        };
        res.json(transformed);
    } catch (error) {
        console.log('Error:', error);
        res.status(500).json({ error: 'Failed to fetch recipes' });
    }
};

const searchRecipes = async (req, res) => {
    const { query } = req.query;
    try {
        const response = await fetch(
            `https://api.spoonacular.com/recipes/complexSearch?apiKey=${process.env.SPOONACULAR_API_KEY}&number=9&query=${query}&addRecipeInformation=true&instructionsRequired=true&fillIngredients=true`
        );

        if (!response.ok) {
            throw new Error('Failed to fetch recipes');
        }

        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.log('Error:', error);
        res.status(500).json({ error: 'Failed to fetch recipes' });
    }
};

module.exports = {
    getRandomRecipes,
    searchRecipes
}; 