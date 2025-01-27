const express = require('express');
const { Pool, Client } = require('pg');
const cors = require('cors');

const app = express();

// Environment variables for PostgreSQL connection
const dbConfig = {
  user: process.env.POSTGRES_USER,
  host: process.env.POSTGRES_HOST,
  database: process.env.POSTGRES_DB_VOTE,
  password: process.env.POSTGRES_PASSWORD,
  port: parseInt(process.env.POSTGRES_PORT, 10),
};

const pool = new Pool(dbConfig);

app.use(cors());
app.use(express.json());

// Delay function for retries
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Initialize the database and create the votes table
const initDb = async () => {
  let retries = 5;
  while (retries > 0) {
    try {
      // Create a client to connect to the default 'postgres' database
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

      // Initialize the votes table in the target database
      await pool.query(`
        CREATE TABLE IF NOT EXISTS votes (
          option VARCHAR(10) PRIMARY KEY,
          count INTEGER NOT NULL DEFAULT 0
        )
      `);
      console.log('Votes table initialized.');

      // Ensure both voting options exist in the table
      await pool.query(`
        INSERT INTO votes (option, count)
        VALUES ('optionA', 0), ('optionB', 0)
        ON CONFLICT (option) DO NOTHING
      `);
      console.log('Vote options initialized.');

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

// Endpoint to get vote counts
app.get('/votes', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM votes');
    const votes = {};
    result.rows.forEach((row) => {
      votes[row.option] = row.count;
    });
    res.json(votes);
  } catch (error) {
    console.error('Error fetching votes:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});

// Endpoint to increment vote count
app.post('/votes', async (req, res) => {
  const { option } = req.body;
  if (option === 'optionA' || option === 'optionB') {
    try {
      await pool.query('UPDATE votes SET count = count + 1 WHERE option = $1', [option]);
      res.status(200).json({ success: true });
    } catch (error) {
      console.error('Error updating vote count:', error);
      res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
  } else {
    res.status(400).json({ success: false, error: 'Invalid option' });
  }
});

// Start the server
app.listen(40001, () => console.log('Voting App Backend running on http://localhost:40001'));
