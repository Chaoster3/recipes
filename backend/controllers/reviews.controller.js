const db = require('../config/db');

const getReviews = async (req, res) => {
    try {
        const reviews = await db
            .select(
                'reviews.review_id',
                'reviews.username',
                'reviews.review',
                'reviews.recipe_id',
                'recipes.title',
                'recipes.image',
                'recipes.servings',
                'recipes.minutes',
                'recipes.ingredients',
                'recipes.instructions',
                'recipes.summary',
            )
            .from('reviews')
            .join('recipes', 'reviews.recipe_id', '=', 'recipes.recipe_id')
            .orderBy('reviews.review_id', 'desc');

        res.json(reviews);
    } catch (error) {
        console.log(error);
        res.status(400).json('failed to retrieve reviews');
    }
};

const addReview = async (req, res) => {
    const { username, recipe_id, title, image, servings, minutes, ingredients, instructions, summary, review } = req.body;
    
    try {
        await db.transaction(async trx => {
            // Insert the recipe into the 'recipes' table if it doesn't already exist
            await trx('recipes')
                .insert({
                    recipe_id,
                    title,
                    image,
                    servings,
                    minutes,
                    ingredients,
                    instructions,
                    summary,
                })
                .onConflict('recipe_id')  // Prevent inserting a duplicate recipe
                .ignore();  // Ignore the insertion if the recipe_id already exists

            // Insert the new post into the 'reviews' table
            await trx('reviews').insert({
                username,
                recipe_id,
                review,
            });

            res.json("successfully posted review");
        });
    } catch (error) {
        console.log(error);
        res.status(400).json('failed to post');
    }
};

module.exports = {
    getReviews,
    addReview
}; 