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

// Endpoint to read the contents of the file
app.get('/data', (req, res) => {
    fs.readFile('data.txt', 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading data:', err);
            return res.status(500).send('Error reading data');
        }
        // Split the data by newline character
        const lines = data.split('\n');
        // Filter out empty lines
        const filteredLines = lines.filter(line => line.trim() !== '');
        res.send(filteredLines);
    });
});

// Endpoint to clear and backup the data file
app.get('/clear', (req, res) => {
    const timestamp = new Date().toISOString().replace(/:/g, '-');
    const backupFilename = `data_backup_${timestamp}.txt`;

    fs.copyFile('data.txt', backupFilename, (err) => {
        if (err) {
            console.error('Error backing up data:', err);
            return res.status(500).send('Error backing up data');
        }

        fs.truncate('data.txt', 0, (err) => {
            if (err) {
                console.error('Error clearing data:', err);
                return res.status(500).send('Error clearing data');
            }
            console.log('Data cleared and backed up successfully');
            res.send('Data cleared and backed up successfully');
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
