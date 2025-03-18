const { app, BrowserWindow, ipcMain, desktopCapturer } = require("electron");
const path = require("path");

let mainWindow;

app.whenReady().then(() => {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"), // Ensure preload.js is correctly referenced
      contextIsolation: true, // Keep this enabled for security
      enableRemoteModule: false,
      nodeIntegration: false // Prevent direct access to Node.js APIs
    },
  });

  mainWindow.loadFile("index.html");
});

// Handle screen recording request
ipcMain.handle("get-sources", async () => {
  const sources = await desktopCapturer.getSources({ types: ["screen"] });
  return sources.map((source) => ({
    id: source.id,
    name: source.name,
    thumbnail: source.thumbnail.toDataURL(),
  }));
});
