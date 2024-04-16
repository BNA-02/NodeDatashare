const express = require('express');
const fs = require('fs');
const app = express();
const port = 8888;
const { exec } = require('child_process'); // Import exec from child_process

// Middleware to parse JSON bodies
app.use(express.json());

// Endpoint to handle POST requests
app.post('/data', (req, res) => {
    // Retrieve data from request body
    const data = req.body.data;

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
	// Execute uniq command
        exec('uniq data.txt > data_unique.txt', (error, stdout, stderr) => {
            if (error) {
                console.error('Error executing uniq:', error);
                return res.status(500).send('Error executing uniq');
            }
            console.log('Duplicate lines removed successfully');
            res.send('Data saved and duplicate lines removed successfully');
        });
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});
