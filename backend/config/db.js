const knex = require('knex');
require('dotenv').config();

const db = knex({
    client: 'pg',
    connection: {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        ssl: { rejectUnauthorized: false }
        // // Only use SSL in production
        // ...(process.env.NODE_ENV === 'production' ? {
        //     ssl: { rejectUnauthorized: false }
        // } : {})
    }
});

module.exports = db; 