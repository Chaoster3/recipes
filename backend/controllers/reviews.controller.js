const supabase = require('../config/db');

const getReviews = async (req, res) => {
    try {
        const { data: reviews, error } = await supabase
            .from('reviews')
            .select(`
                review_id,
                username,
                review,
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
            .order('review_id', { ascending: false });

        if (error) throw error;

        // Transform the nested data to match the previous format
        const transformedReviews = reviews.map(r => ({
            review_id: r.review_id,
            username: r.username,
            review: r.review,
            recipe_id: r.recipe_id,
            ...r.recipes
        }));

        res.json(transformedReviews);
    } catch (error) {
        console.log(error);
        res.status(400).json('failed to retrieve reviews');
    }
};

const addReview = async (req, res) => {
    const { username, recipe_id, title, image, servings, minutes, ingredients, instructions, summary, review } = req.body;
    
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

        // Then, insert the review
        const { error: reviewError } = await supabase
            .from('reviews')
            .insert({
                username,
                recipe_id,
                review
            });

        if (reviewError) throw reviewError;

        res.json("successfully posted review");
    } catch (error) {
        console.log(error);
        res.status(400).json('failed to post');
    }
};

module.exports = {
    getReviews,
    addReview
}; 