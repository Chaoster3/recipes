const bcrypt = require('bcrypt');
const db = require('../config/db');

const test = async (req, res) => {
    res.json('test success');
}

const signin = async (req, res) => {
    const { username, password } = req.body;
    try {
        const result = await db.query(
            'SELECT * FROM login WHERE username = $1',
            [username]
        );
        
        const user = result.rows[0];
        if (!user) {
            console.log('Login failed: User not found');
            return res.status(403).json('login failed');
        }

        const match = await bcrypt.compare(password, user.password);
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
    const { username, password } = req.body;
    
    if (password.length < 6) {
        return res.status(400).json('Password must be at least 6 characters long');
    }

    try {
        // Check if username exists
        const existingUser = await db.query(
            'SELECT username FROM login WHERE username = $1',
            [username]
        );

        if (existingUser.rows.length > 0) {
            return res.status(400).json('Username already exists');
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        await db.query(
            'INSERT INTO login (username, password) VALUES ($1, $2)',
            [username, hashedPassword]
        );
        
        res.json('register success');
    } catch (error) {
        console.error(error);
        res.status(400).json('register failed');
    }
};

const handleGoogleSignin = async (req, res) => {
    const { googleId } = req.body;
    
    try {
        const result = await db.query(
            'SELECT * FROM login WHERE google_id = $1',
            [googleId]
        );
        
        const user = result.rows[0];
        if (!user) {
            return res.status(404).json({ 
                success: false, 
                error: 'user_not_found',
                message: 'No account found with this Google account' 
            });
        }
        
        return res.json({ 
            success: true, 
            message: 'login success',
            username: user.username 
        });
    } catch (error) {
        console.error('Google signin error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Authentication failed' 
        });
    }
};

const handleGoogleRegister = async (req, res) => {
    const { username, googleId } = req.body;
    
    try {
        // Check if username or Google ID already exists
        const existingUser = await db.query(
            'SELECT * FROM login WHERE username = $1 OR google_id = $2',
            [username, googleId]
        );
        
        if (existingUser.rows.length > 0) {
            const user = existingUser.rows[0];
            // Determine specific error message
            const errorMessage = user.google_id === googleId
                ? 'Google account already registered'
                : 'Username already in use';

            return res.status(409).json({ 
                success: false, 
                error: 'user_exists',
                message: errorMessage 
            });
        }
        
        // User doesn't exist, create new account
        await db.query(
            'INSERT INTO login (username, google_id) VALUES ($1, $2)',
            [username, googleId]
        );
        
        res.json({ success: true, message: 'register success' });
    } catch (error) {
        console.error('Google register error:', error);
        res.status(500).json({ success: false, message: 'Authentication failed' });
    }
};

module.exports = {
    signin,
    register,
    test,
    handleGoogleSignin,
    handleGoogleRegister
}; 