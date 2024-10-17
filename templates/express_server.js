const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 3000;
const cors = require('cors');

// Middleware to parse incoming JSON data from POST requests
app.use(express.json());
app.use(express.static(__dirname + "/static"))
app.use(cors())

// Serve a static HTML page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Serve a JSON file
app.get('/api/load', (req, res) => {
    const jsonFilePath = path.join(__dirname, 'data.json');
    res.sendFile(jsonFilePath);
});

// Handle POST request and save data to a text file
// This method writes all data to a single file, which will begin to slow if the file gets too large
// It's recommended instead to check filesize and if it becomes too large, create a new one to write to
// Alternatively, you may wish to store files based on userID, which is simple with express
// Or of course, write data straight to a database
app.post('/api/save', (req, res) => {
    // Define the path to the save date file
    const filePath = path.join(__dirname, 'data.json');
    let myJson;
    try {
        // Open data file and append data to JSON object then rewrite
        let file = fs.readFileSync(filePath);
        // parse json contents
        myJson = JSON.parse(file);
    } catch (error) {
        // If the data file doesn't exist yet, define an empty object
        myJson = [];
    }
    
    // add new contents to json object
    myJson.push(req.body)
    // Write back to JSON
    const jsonifiedData = JSON.stringify(myJson)
    // Write file to local directory
    fs.writeFile(filePath, jsonifiedData, (err) => {
        if (err) {
            console.error('Error writing to file:', err);
            return res.status(500).send('Error saving data');
        }
        res.status(200).send('Data saved successfully.');
    })
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});