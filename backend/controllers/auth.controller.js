const bcrypt = require('bcrypt');
const db = require('../config/db');

const signin = async (req, res) => {
    const {username, password} = req.body;
    try {
        const data = await db.select('username', 'password').from('login')
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