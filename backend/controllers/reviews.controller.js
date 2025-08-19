const db = require('../config/db');

const getReviews = async (req, res) => {
    const username = req.query.username;
    try {
        const result = await db.query(
            `SELECT r.*, 
                    u.username,
                    r.overall_rating,
                    r.taste_rating,
                    r.presentation_rating,
                    r.difficulty_rating,
                    r.upvotes,
                    r.downvotes,
                    rec.title,
                    rec.image,
                    rec.servings,
                    rec.minutes,
                    rec.ingredients,
                    rec.instructions,
                    rec.summary,
                    rv.vote_type as user_vote
             FROM reviews r 
             JOIN login u ON r.username = u.username 
             JOIN recipes rec ON r.recipe_id = rec.recipe_id
             LEFT JOIN review_votes rv ON r.review_id = rv.review_id AND rv.username = $1
             ORDER BY r.review_id DESC`,
            [username]
        );
        
        // The PostgreSQL driver automatically parses JSON fields, so no need to parse again
        res.json(result.rows);
        console.log(result.rows);
    } catch (error) {
        console.error(error);
        res.status(400).json('failed to retrieve reviews');
    }
};

const addReview = async (req, res) => {
    const { 
        username, 
        recipe_id, 
        review, 
        overall_rating,
        taste_rating,
        presentation_rating,
        difficulty_rating,
        title,
        image,
        servings,
        minutes,
        ingredients,
        instructions,
        summary
    } = req.body;

    const client = await db.pool.connect();
    
    try {
        await client.query('BEGIN');

        // First, insert or update the recipe
        const recipeQuery = `
            INSERT INTO recipes (
                recipe_id, title, image, servings, minutes, 
                ingredients, instructions, summary
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            ON CONFLICT (recipe_id) DO UPDATE SET
                title = EXCLUDED.title,
                image = EXCLUDED.image,
                servings = EXCLUDED.servings,
                minutes = EXCLUDED.minutes,
                ingredients = EXCLUDED.ingredients,
                instructions = EXCLUDED.instructions,
                summary = EXCLUDED.summary
        `;

        await client.query(recipeQuery, [
            recipe_id,
            title,
            image,
            servings,
            minutes,
            ingredients,
            instructions,
            summary
        ]);

        // Then, insert the review
        await client.query(
            `INSERT INTO reviews (
                username, 
                recipe_id, 
                review,
                overall_rating,
                taste_rating,
                presentation_rating,
                difficulty_rating
            ) VALUES ($1, $2, $3, $4, $5, $6, $7)`,
            [username, recipe_id, review, overall_rating, taste_rating, presentation_rating, difficulty_rating]
        );

        await client.query('COMMIT');
        res.json("successfully posted review");
    } catch (error) {
        await client.query('ROLLBACK');
        console.error(error);
        res.status(400).json('failed to post');
    } finally {
        client.release();
    }
};

const voteReview = async (req, res) => {
    const { username, review_id, vote_type } = req.body;
    const client = await db.pool.connect();

    console.log('Vote request received:', { username, review_id, vote_type });

    try {
        await client.query('BEGIN');

        // Check if user has already voted
        const existingVote = await client.query(
            'SELECT vote_type FROM review_votes WHERE username = $1 AND review_id = $2',
            [username, review_id]
        );

        console.log('Existing vote check:', existingVote.rows);

        if (existingVote.rows.length > 0) {
            const currentVote = existingVote.rows[0].vote_type;
            
            // If user clicks the same vote type, remove the vote
            if (currentVote === vote_type) {
                console.log('Removing existing vote');
                await client.query(
                    'DELETE FROM review_votes WHERE username = $1 AND review_id = $2',
                    [username, review_id]
                );

                // Decrease the vote count
                await client.query(
                    `UPDATE reviews SET 
                        ${vote_type === 'up' ? 'upvotes = upvotes - 1' : 'downvotes = downvotes - 1'}
                     WHERE review_id = $1`,
                    [review_id]
                );
            } else {
                // User is changing their vote
                console.log('Changing vote from', currentVote, 'to', vote_type);
                await client.query(
                    'UPDATE review_votes SET vote_type = $1 WHERE username = $2 AND review_id = $3',
                    [vote_type, username, review_id]
                );

                // Update vote counts: decrease old vote, increase new vote
                await client.query(
                    `UPDATE reviews SET 
                        upvotes = upvotes ${currentVote === 'up' ? '-1' : '+1'},
                        downvotes = downvotes ${currentVote === 'down' ? '-1' : '+1'}
                     WHERE review_id = $1`,
                    [review_id]
                );
            }
        } else {
            // New vote
            console.log('Adding new vote');
            await client.query(
                'INSERT INTO review_votes (username, review_id, vote_type) VALUES ($1, $2, $3)',
                [username, review_id, vote_type]
            );

            // Increase the vote count
            await client.query(
                `UPDATE reviews SET 
                    ${vote_type === 'up' ? 'upvotes = upvotes + 1' : 'downvotes = downvotes + 1'}
                 WHERE review_id = $1`,
                [review_id]
            );
        }

        await client.query('COMMIT');
        console.log('Vote successfully recorded');
        res.json('vote recorded');
    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Vote error:', error);
        res.status(400).json('failed to vote');
    } finally {
        client.release();
    }
};

module.exports = {
    getReviews,
    addReview,
    voteReview
}; 