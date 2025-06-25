import { app, BrowserWindow, ipcMain, Menu } from "electron";
import path from "path";
import si from "systeminformation"; // Thêm dòng này
import fs from "fs";

let mainWindow: BrowserWindow | null = null;

const createWindow = () => {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  mainWindow.setMenuBarVisibility(false); // Ẩn luôn cả khi nhấn Alt
  mainWindow.removeMenu(); // Xóa luôn menu nếu không cần Menu API
  // const fsPath = path.resolve(__dirname, "../dist/index.html");
  // const fileUrl = `file://${fsPath}`;

  // console.log("FS Path:", fsPath);
  // console.log("Resolved URL:", fileUrl);

  // if (fs.existsSync(fsPath)) {
  //   mainWindow.loadURL(fileUrl);
  // } else {
  //   console.error("❌ Không tìm thấy dist/index.html:", fsPath);
  // }

  mainWindow.loadFile(path.join(__dirname, "../dist/index.html"));

  const devURL = process.env.VITE_DEV_SERVER_URL;
  console.log("Loading from dev:", devURL);
  if (devURL) {
    mainWindow.loadURL(devURL);
  } else {
    mainWindow.loadFile(path.join(__dirname, "../dist/index.html"));
  }

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
};

app.whenReady().then(() => {
  createWindow();

  // ✅ Xoá toàn bộ menu macOS, bao gồm cả Developer Tools
  Menu.setApplicationMenu(Menu.buildFromTemplate([]));

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
