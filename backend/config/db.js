const knex = require('knex');
require('dotenv').config();

const db = knex({
    client: 'pg',
    connection: {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        // Only use SSL in production
        ...(process.env.NODE_ENV === 'production' ? {
            ssl: { rejectUnauthorized: false }
        } : {})
    },
    pool: {
        min: 2, // Minimum number of connections in the pool
        max: 10, // Maximum number of connections in the pool
        idleTimeoutMillis: 30000, // Time in milliseconds before an idle connection is closed
        acquireTimeoutMillis: 10000 // Time in milliseconds to wait for a connection to become available
    }
});

module.exports = db; 