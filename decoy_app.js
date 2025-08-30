const express = require('express');
const path = require('path');
const open = require('open');

const app = express();
const PORT = 3000; // You can choose any available port

// Serve static files from the current directory
app.use(express.static(path.join(__dirname)));

// Route to serve the decoy.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'decoy.html'));
});

const server = app.listen(PORT, () => {
    const url = `http://localhost:${PORT}`;
    console.log(`Decoy server running at ${url}`);
    console.log('Opening browser...');
    open(url).then(() => {
        console.log('Browser opened. Exiting server in 5 seconds...');
        // Give the browser some time to load and initiate download
        setTimeout(() => {
            server.close(() => {
                console.log('Server closed.');
                process.exit(0); // Exit the process
            });
        }, 5000);
    }).catch(err => {
        console.error('Failed to open browser:', err);
        server.close(() => {
            process.exit(1); // Exit with error
        });
    });
});

// Handle server errors
server.on('error', (err) => {
    console.error('Server error:', err);
    process.exit(1);
});
