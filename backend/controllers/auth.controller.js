const bcrypt = require('bcrypt');
const supabase = require('../config/db');

const test = async (req, res) => {
    res.json('test success');
}

const signin = async (req, res) => {
    const { username, password } = req.body;
    try {
        // Query the login table using Supabase
        const { data, error } = await supabase
            .from('login')
            .select('username, password')
            .eq('username', username)
            .single();

        if (error) {
            console.log('Login failed:', error.message);
            return res.status(403).json('login failed');
        }

        if (!data) {
            console.log('Login failed: User not found');
            return res.status(403).json('login failed');
        }

        // Compare passwords
        const match = await bcrypt.compare(password, data.password);
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
            await supabase('login').insert({
                username: username,
                password: hash
            });
            res.json("register success");
        } catch (error) {
            res.status(409).json('register failed');
        }
    });
};

const handleGoogleSignin = async (req, res) => {
    const { googleId } = req.body;
    
    try {
        // Check if user exists with this Google ID
        const user = await supabase.from('login').select('*').eq('google_id', googleId).single();
        
        if (!user) {
            return res.status(404).json({ 
                success: false, 
                error: 'user_not_found',
                message: 'No account found with this Google account' 
            });
        }
        
        // User exists, log them in
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
        const existingUser = await supabase.from('login').select('*').eq('username', username).or('google_id', '=', googleId).single();
        
        if (existingUser) {
            // Determine specific error message
            const errorMessage = existingUser.google_id === googleId
                ? 'Google account already registered'
                : 'Username already in use';

            return res.status(409).json({ 
                success: false, 
                error: 'user_exists',
                message: errorMessage 
            });
        }
        
        // User doesn't exist, create new account
        await supabase('login').insert({
            username: username,
            google_id: googleId
        });
        
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