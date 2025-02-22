const supabase = require('../config/db');

const getFavorites = async (req, res) => {
    const { username } = req.params;
    try {
        const { data: favorites, error } = await supabase
            .from('favorites')
            .select(`
                username,
                recipe_id,
                recipes (
                    title,
                    image,
                    servings,
                    minutes,
                    ingredients,
                    instructions,
                    summary
                )
            `)
            .eq('username', username);

        if (error) throw error;
        
        // Transform the nested data to match the previous format
        const transformedFavorites = favorites.map(f => ({
            username: f.username,
            recipe_id: f.recipe_id,
            ...f.recipes
        }));

        res.json(transformedFavorites);
    } catch (error) {
        console.log(error);
        res.status(400).json('failed to retrieve favorites');
    }
};

const addFavorite = async (req, res) => {
    const { username, recipe_id, title, image, servings, minutes, ingredients, instructions, summary } = req.body;

    try {
        // First, insert or update the recipe
        const { error: recipeError } = await supabase
            .from('recipes')
            .upsert({
                recipe_id,
                title,
                image,
                servings,
                minutes,
                ingredients,
                instructions,
                summary
            });

        if (recipeError) throw recipeError;

        // Then, insert the favorite
        const { error: favoriteError } = await supabase
            .from('favorites')
            .insert({
                username,
                recipe_id
            });

        if (favoriteError) throw favoriteError;

        res.json('saved to favorites');
    } catch (error) {
        console.log(error);
        res.status(400).json('failed to save to favorites');
    }
};

const checkFavorite = async (req, res) => {
    const { username, recipeId } = req.params;
    try {
        const { data, error } = await supabase
            .from('favorites')
            .select()
            .eq('username', username)
            .eq('recipe_id', recipeId)
            .single();

        if (error && error.code !== 'PGRST116') throw error; // PGRST116 is "not found"
        
        res.json({ isFavorited: !!data });
    } catch (error) {
        console.log(error);
        res.status(400).json('failed to check favorite status');
    }
};

const removeFavorite = async (req, res) => {
    const {username, recipe_id} = req.body;
    try {
        const { error } = await supabase
            .from('favorites')
            .delete()
            .eq('username', username)
            .eq('recipe_id', recipe_id);

        if (error) throw error;
        
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