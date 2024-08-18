const express = require('express');
const cors = require('cors');
const connectToDatabase = require('./config/config');

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors()); // Enable CORS for all requests
app.use(express.json()); // Parse JSON bodies

// Connect to MongoDB
async function startServer() {
  try {
    const db = await connectToDatabase();

    // Sample route
    app.get('/', (req, res) => {
      res.send('Welcome to the natsPortfolio API');
    });

    // Additional routes and operations with the database can go here

    // Start the server
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
  }
}

startServer();
