const express = require('express');
const routes = require('./routes'); // Import routes
const app = express();
const port = 3000;

app.use(express.json());

// You can initialize the database here or in a separate db.js file
// const db = require('./db'); // If you have a separate db.js

app.use('/', routes); // Use the routes

// --- Start the server ---
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});