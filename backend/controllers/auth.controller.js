const bcrypt = require('bcrypt');
const db = require('../config/db');

const test = async (req, res) => {
    res.json('test success');
}

const signin = async (req, res) => {
    const {username, password} = req.body;
    try {
        // Check if username exists
        const data = await db.select('username', 'password').from('login')
            .where('username', '=', username);
            
        if (data.length === 0) {
            console.log('Login failed: User not found');
            return res.status(403).json('login failed');
        }

        // Compare passwords
        const match = await bcrypt.compare(password, data[0].password);
        if (match) {
            console.log('Login successful for user:', username);
            res.json('login success');
        } else {
            console.log('Login failed: Incorrect password');
            res.status(403).json('login failed');
        }
    } catch (error) {
        console.error('Login error:', error);
        res.status(403).json('login failed');
    }
};

const register = async (req, res) => {
    const {username, password} = req.body;
    
    if (password.length < 6) {
        return res.status(400).json('Password must be at least 6 characters long');
    }

    bcrypt.hash(password, 10, async function (err, hash) {
        try {
            await db('login').insert({
                username: username,
                password: hash
            });
            res.json("register success");
        } catch (error) {
            res.status(409).json('register failed');
        }
    });
};

module.exports = {
    signin,
    register
}; 