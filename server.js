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
    const rawData = req.body.data;

    if (!rawData) {
        return res.status(400).send('Data parameter is required');
    }

    // Parse raw data into array of JSON objects
    const jsonObjects = parseDataToJson(rawData);

    if (!jsonObjects) {
        return res.status(400).send('Invalid data format');
    }

    // Append JSON objects to file
    fs.appendFile('data.json', jsonObjects.map(obj => JSON.stringify(obj)).join('\n') + '\n', (err) => {
        if (err) {
            console.error('Error saving data:', err);
            return res.status(500).send('Error saving data');
        }
        console.log('Data saved successfully');
        
        // Remove duplicates after appending
        removeDuplicates('data.json')
            .then(() => {
                console.log('Duplicates removed successfully');
                // Send response after both appending and removing duplicates
                res.send('Data saved successfully');
            })
            .catch((error) => {
                console.error('Error removing duplicates:', error);
                res.status(500).send('Error removing duplicates');
            });
    });
});



// Function to parse raw data into JSON objects
function parseDataToJson(rawData) {
    const jsonObjects = [];
    const lines = rawData.split('\n');

    lines.forEach(line => {
        const jsonObject = {};
        const pairs = line.split('\t');
        pairs.forEach(pair => {
            const [key, value] = pair.split(' :');
            if (key && value) {
                jsonObject[key.trim()] = value.trim();
            }
        });
        jsonObjects.push(jsonObject);
    });

    return jsonObjects;
}

app.get('/data', (req, res) => {
    fs.readFile('data.json', 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading data:', err);
            return res.status(500).send('Error reading data');
        }
        
        // Split the data by newline character
        const lines = data.split('\n');
        
        // Parse each line into a JSON object
        const jsonObjects = [];
        lines.forEach(line => {
            try {
                const obj = JSON.parse(line);
                jsonObjects.push(obj);
            } catch (error) {
                console.error('Error parsing JSON:', error);
            }
        });
        
        res.json(jsonObjects);
    });
});


// Endpoint to clear and backup the data file
app.get('/clear', (req, res) => {
    const timestamp = new Date().toISOString().replace(/:/g, '-');
    const backupFilename = `data_backup_${timestamp}.json`;

    fs.copyFile('data.json', backupFilename, (err) => {
        if (err) {
            console.error('Error backing up data:', err);
            return res.status(500).send('Error backing up data');
        }

        fs.truncate('data.json', 0, (err) => {
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
