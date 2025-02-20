const db = require('../config/db');

const getFavorites = async (req, res) => {
    const { username } = req.params;
    try {
        const favorites = await db('favorites')
            .join('recipes', 'favorites.recipe_id', '=', 'recipes.recipe_id')
            .where('favorites.username', '=', username)
            .select(
                'favorites.username',
                'favorites.recipe_id',
                'recipes.title',
                'recipes.image',
                'recipes.servings',
                'recipes.minutes',
                'recipes.ingredients',
                'recipes.instructions',
                'recipes.summary'
            );
        res.json(favorites);
    } catch (error) {
        console.log(error);
        res.status(400).json('failed to retrieve favorites');
    }
};

const addFavorite = async (req, res) => {
    const { username, recipe_id, title, image, servings, minutes, ingredients, instructions, summary } = req.body;

    const trx = await db.transaction();

    try {
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
            .onConflict('recipe_id')
            .ignore();

        await trx('favorites').insert({
            username,
            recipe_id,
        });

        await trx.commit();
        res.json('saved to favorites');
    } catch (error) {
        await trx.rollback();
        console.log(error);
        res.status(400).json('failed to save to favorites');
    }
};

const checkFavorite = async (req, res) => {
    const { username, recipeId } = req.params;
    try {
        const favorite = await db('favorites')
            .where({
                username: username,
                recipe_id: recipeId
            })
            .first();
        
        res.json({ isFavorited: !!favorite });
    } catch (error) {
        console.log(error);
        res.status(400).json('failed to check favorite status');
    }
};

const removeFavorite = async (req, res) => {
    const {username, recipe_id} = req.body;
    try {
        await db('favorites')
            .where({username, recipe_id})
            .del();
        res.json("removed from favorites");
    } catch (error) {
        console.log(error);
        res.status(400).json('failed to remove from favorites');
    }
};

module.exports = {
    getFavorites,
    addFavorite,
    checkFavorite,
    removeFavorite
}; 