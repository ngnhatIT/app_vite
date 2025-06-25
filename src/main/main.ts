import { app, BrowserWindow, ipcMain } from "electron";
import path from "path";
import si from "systeminformation"; // Thêm dòng này
import fs from "fs";

let mainWindow: BrowserWindow | null = null;

const createWindow = () => {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });
  // const fsPath = path.resolve(__dirname, "../dist/index.html");
  // const fileUrl = `file://${fsPath}`;

  // console.log("FS Path:", fsPath);
  // console.log("Resolved URL:", fileUrl);

  // if (fs.existsSync(fsPath)) {
  //   mainWindow.loadURL(fileUrl);
  // } else {
  //   console.error("❌ Không tìm thấy dist/index.html:", fsPath);
  // }

  mainWindow.loadFile(path.join(__dirname, '../dist/index.html'))

  const devURL = process.env.VITE_DEV_SERVER_URL || 'http://localhost:5173';
  console.log('Loading from dev:', devURL);
  if (devURL) {
    mainWindow.loadURL(devURL)
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'))
  }

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
};

app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

ipcMain.handle("get-network-info", async () => {
  const nets = await si.networkInterfaces();
  const active = nets.find((n) => n.default || n.operstate === "up");

  return {
    ip: active?.ip4 || active?.ip6 || "",
    mac: active?.mac || "",
    iface: active?.ifaceName || "",
  };
});
