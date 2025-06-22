import { app, BrowserWindow } from 'electron'
import path from 'path'

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, '../preload.js'),
      contextIsolation: true,
    },
  });

  win.setMenuBarVisibility(false);
  win.removeMenu();

  const devURL = process.env.VITE_DEV_SERVER_URL || 'http://localhost:5173';
  console.log('Loading from dev:', devURL);
  if (devURL) {
    win.loadURL(devURL)
  } else {
    win.loadFile(path.join(__dirname, '../dist/index.html'))
  }
}

app.whenReady().then(createWindow)
