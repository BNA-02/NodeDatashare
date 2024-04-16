const express = require('express');
const fs = require('fs');
const app = express();
const port = 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// Endpoint to handle GET requests
app.get('/data', (req, res) => {
    // Retrieve data from query parameters
    const data = req.query.data;

    if (!data) {
        return res.status(400).send('Data parameter is required');
    }

    // Save data to a file
    fs.appendFile('data.txt', data + '\n', (err) => {
        if (err) {
            console.error('Error saving data:', err);
            return res.status(500).send('Error saving data');
        }
        console.log('Data saved successfully');
        res.send('Data saved successfully');
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});
