const db = require('../config/db');

const getFavorites = async (req, res) => {
    const { username } = req.params;
    try {
        console.log(username);
        const result = await db.query(
            `SELECT f.*, r.* 
            FROM favorites f 
            JOIN recipes r ON f.recipe_id = r.recipe_id 
            WHERE f.username = $1`,
            [username]
        );
        
        // The PostgreSQL driver automatically parses JSON fields, so no need to parse again
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(400).json('failed to retrieve favorites');
    }
};

const addFavorite = async (req, res) => {
    const { username, recipe_id, title, image, servings, minutes, ingredients, instructions, summary } = req.body;
    const client = await db.pool.connect();
    
    try {
        await client.query('BEGIN');

        // First, insert or update recipe
        await client.query(
            `INSERT INTO recipes (recipe_id, title, image, servings, minutes, ingredients, instructions, summary)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            ON CONFLICT (recipe_id) DO UPDATE SET
            title = EXCLUDED.title,
            image = EXCLUDED.image,
            servings = EXCLUDED.servings,
            minutes = EXCLUDED.minutes,
            ingredients = EXCLUDED.ingredients,
            instructions = EXCLUDED.instructions,
            summary = EXCLUDED.summary`,
            [recipe_id, title, image, servings, minutes, ingredients, instructions, summary]
        );

        // Then, add to favorites
        await client.query(
            `INSERT INTO favorites (username, recipe_id)
            VALUES ($1, $2)
            ON CONFLICT (username, recipe_id) DO NOTHING`,
            [username, recipe_id]
        );

        await client.query('COMMIT');
        res.json('saved to favorites');
    } catch (error) {
        await client.query('ROLLBACK');
        console.error(error);
        res.status(400).json('failed to save to favorites');
    } finally {
        client.release();
    }
};

const checkFavorite = async (req, res) => {
    const { username, recipeId } = req.params;
    try {
        const result = await db.query(
            'SELECT EXISTS(SELECT 1 FROM favorites WHERE username = $1 AND recipe_id = $2)',
            [username, recipeId]
        );
        res.json({ isFavorited: result.rows[0].exists });
    } catch (error) {
        console.error(error);
        res.status(400).json('failed to check favorite status');
    }
};

const removeFavorite = async (req, res) => {
    const { username, recipe_id } = req.body;
    try {
        await db.query(
            'DELETE FROM favorites WHERE username = $1 AND recipe_id = $2',
            [username, recipe_id]
        );
        res.json("removed from favorites");
    } catch (error) {
        console.error(error);
        res.status(400).json('failed to remove from favorites');
    }
};

module.exports = {
    getFavorites,
    addFavorite,
    checkFavorite,
    removeFavorite
}; 