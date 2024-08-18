const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

const app = express();
const port = process.env.PORT || 8000;

// Middleware
app.use(cors()); // Enable CORS for all requests
app.use(express.json()); // Parse JSON bodies

// Sample route
app.get('/', (req, res) => {
  res.send('Welcome to the natsPortfolio API');
});

// Additional routes would go here

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
