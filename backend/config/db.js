const { Pool } = require('pg');

// Debug: Check if DB_URL is set
console.log('DB_URL environment variable:', process.env.DB_URL ? 'Set' : 'Not set');
console.log('DB_URL preview:', process.env.DB_URL ? process.env.DB_URL.substring(0, 20) + '...' : 'undefined');

const pool = new Pool({
    connectionString: process.env.DB_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

// Test the connection
pool.connect((err, client, release) => {
    if (err) {
        return console.error('Error acquiring client:', err.stack);
    }
    client.query('SELECT NOW()', (err, result) => {
        release();
        if (err) {
            return console.error('Error executing query:', err.stack);
        }
        console.log('Connected to PostgreSQL database');
    });
});

// Export a query function to use in controllers
module.exports = {
    query: (text, params) => pool.query(text, params),
    pool
};