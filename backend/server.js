const express = require('express');
const bcrypt = require('bcrypt');
const cors = require('cors');
const pg = require('knex')({
    client: 'pg',
    connection: {
        host: '127.0.0.1',
        user: 'samuelngiam',
        password: '',
        database: 'recipes'
    }
});

const app = express();

app.use(express.json());
app.use(cors());

app.post('/signin', async (req, res) => {
    const {username, password} = req.body;
    try {
        const data = await pg.select('username', 'password').from('login')
            .where('username', '=', username);
        bcrypt.compare(password, data[0].password, function (err, result) {
            if (result) {
                res.json('login success');
            } else {
                res.status(403).json('login failed');
            }
        });
    } catch (error) {
        res.status(403).json('login failed');
    }
})

app.post('/register', (req, res) => {
    const {username, password} = req.body;
    bcrypt.hash(password, 10, async function (err, hash) {
        try {
        await pg('login').insert({
            username: username,
            password: hash
        });
        res.json("register success");
        } catch (error) {
            res.status(409).json('register failed');
        }
    })
})

app.get('/favorites/:username', async (req, res) => {
    const {username} = req.params;
    try {
        const favorites = await pg.select('*').from('favorites')
            .where('username', '=', username);
        res.json(favorites);
    } catch (error) {
        res.status(400).json('failed to retrieve favorites');
    }
})

app.post('/favorites', async (req, res) => {
    const {username, recipe_id, title, image, servings, minutes, ingredients, instructions, summary, saved} = req.body;
    try {
        await pg('favorites').insert({
                username: username,
                recipe_id: recipe_id,
                title: title,
                image: image,
                servings: servings,
                minutes: minutes,
                ingredients: ingredients,
                instructions: instructions,
                summary: summary,
                saved: saved
        });
        res.json("saved to favorites");
    } catch (error) {
        console.log(error)
        res.status(400).json('failed to save to favorites')
    }
})

app.delete('/favorites', async (req, res) => {
    const {username, recipe_id} = req.body;
    try {
        await pg('favorites')
            .where({'username' : username, 'recipe_id' : recipe_id})
            .del()
        res.json("removed from favorites");
    } catch (error) {
        console.log(error)
        res.status(400).json('failed to remove from favorites')
    }
})

app.post('/posts', async (req, res) => {
    const { username, recipe_id, title, image, servings, minutes, ingredients, instructions, summary, description } = req.body;
    try {
        const result = await pg('posts').count('username');
        const count = parseInt (result[0].count);
        if (count < 9) {
            await pg('posts').insert({
                username: username,
                recipe_id: recipe_id,
                title: title,
                image: image,
                servings: servings,
                minutes: minutes,
                ingredients: ingredients,
                instructions: instructions,
                summary: summary,
                description: description,
                positioning: count + 1
            });
        } else {
            await pg('posts')
                .where('positioning', 1)
                .del()
            await pg('posts')
                .decrement('positioning', 1)
            await pg('posts').insert({
                username: username,
                recipe_id: recipe_id,
                title: title,
                image: image,
                servings: servings,
                minutes: minutes,
                ingredients: ingredients,
                instructions: instructions,
                summary: summary,
                description: description,
                positioning: 9
            });
        }
        res.json("successfully posted");
    } catch (error) {
        console.log(error)
        res.status(400).json('failed to post')
    }
})

app.get('/posts', async (req, res) => {
    try {
        const posts = await pg.select('*').from('posts')
            .orderBy('positioning', 'desc')
        res.json(posts);
    } catch (error) {
        res.status(400).json('failed to retrieve posts');
    }
})

app.listen(3001, () => {
    console.log('Server running on port 3001');
})