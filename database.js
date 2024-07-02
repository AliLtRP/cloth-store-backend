const { Client } = require('pg');
const dotenv = require('dotenv');

dotenv.config();

const client = new Client({
    connectionString: process.env.DATABASE_CONNECTION,
    ssl: {
        rejectUnauthorized: false,
    },
});

const dbConnection = async () => {
    await client.connect()
        .then(() => console.log('Database connected'))
        .catch(err => console.error('Connection error', err));

}


module.exports = { dbConnection, client };
