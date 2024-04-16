const express = require('express');
const fs = require('fs');
const readline = require('readline');
const app = express();
const port = 8888;

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

        // Remove duplicate lines
        removeDuplicates('data.txt')
            .then(() => {
                console.log('Duplicate lines removed successfully');
                res.send('Data saved and duplicate lines removed successfully');
            })
            .catch((error) => {
                console.error('Error removing duplicate lines:', error);
                res.status(500).send('Error removing duplicate lines');
            });
    });
});

// Function to remove duplicate lines from a file
function removeDuplicates(filename) {
    return new Promise((resolve, reject) => {
        const uniqueLines = new Set();
        const rl = readline.createInterface({
            input: fs.createReadStream(filename),
            crlfDelay: Infinity
        });

        rl.on('line', (line) => {
            uniqueLines.add(line);
        });

        rl.on('close', () => {
            fs.writeFile(filename, [...uniqueLines].join('\n') + '\n', (err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });

        rl.on('error', (err) => {
            reject(err);
        });
    });
}

// Start the server
app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});
