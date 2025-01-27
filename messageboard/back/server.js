const express = require('express');
const { Pool, Client } = require('pg');
const cors = require('cors');

const app = express();

// Environment variables for PostgreSQL connection
const dbConfig = {
  user: process.env.POSTGRES_USER,
  host: process.env.POSTGRES_HOST,
  database: process.env.POSTGRES_DB_MESSAGE,
  password: process.env.POSTGRES_PASSWORD,
  port: parseInt(process.env.POSTGRES_PORT, 10),
};

const pool = new Pool(dbConfig);

app.use(cors());
app.use(express.json());

// Delay function for retries
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Initialize the database
const initDb = async () => {
  let retries = 5;
  while (retries > 0) {
    try {
      const client = new Client({
        ...dbConfig,
        database: 'postgres', // Connect to the default database to manage the target database
      });

      await client.connect();
      console.log('Connected to the default database.');

      // Check if the target database exists
      const dbCheckQuery = `SELECT 1 FROM pg_database WHERE datname = '${dbConfig.database}'`;
      const dbCheckResult = await client.query(dbCheckQuery);

      if (dbCheckResult.rowCount === 0) {
        console.log(`Database "${dbConfig.database}" does not exist. Creating it...`);
        await client.query(`CREATE DATABASE "${dbConfig.database}"`);
        console.log(`Database "${dbConfig.database}" created successfully.`);
      }

      // Close the connection to the default database
      await client.end();

      // Initialize the "messages" table in the target database
      await pool.query(`
        CREATE TABLE IF NOT EXISTS messages (
          id SERIAL PRIMARY KEY,
          content TEXT NOT NULL
        )
      `);
      console.log('Table "messages" initialized.');

      return; // Exit the retry loop if initialization is successful
    } catch (error) {
      console.error('Database initialization failed. Retrying...', error);
      retries -= 1;
      await delay(5000); // Wait 5 seconds before retrying
    }
  }
  console.error('Failed to initialize the database after multiple retries.');
  process.exit(1); // Exit if the retries are exhausted
};

initDb(); // Call to initialize the database

// Get all messages
app.get('/messages', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM messages ORDER BY id');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching messages:', error.message);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});

// Add a new message
app.post('/messages', async (req, res) => {
  const { message } = req.body;
  if (message) {
    try {
      await pool.query('INSERT INTO messages (content) VALUES ($1)', [message]);
      res.status(200).json({ success: true });
    } catch (error) {
      console.error('Error adding message:', error.message);
      res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
  } else {
    res.status(400).json({ success: false, error: 'Message is required' });
  }
});

const PORT = 30001;
app.listen(PORT, () => console.log(`Message Board Backend running on http://localhost:${PORT}`));
