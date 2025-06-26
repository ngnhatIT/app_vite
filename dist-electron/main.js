"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const path_1 = __importDefault(require("path"));
const systeminformation_1 = __importDefault(require("systeminformation")); // Thêm dòng này
let mainWindow = null;
const createWindow = () => {
    mainWindow = new electron_1.BrowserWindow({
        width: 1200,
        height: 800,
        resizable: true,
        webPreferences: {
            preload: path_1.default.join(__dirname, "preload.js"),
            contextIsolation: true,
            nodeIntegration: false,
        },
    });
    mainWindow.setMenuBarVisibility(false); // Ẩn luôn cả khi nhấn Alt
    // mainWindow.removeMenu(); // Xóa luôn menu nếu không cần Menu API
    // const fsPath = path.resolve(__dirname, "../dist/index.html");
    // const fileUrl = `file://${fsPath}`;
    // console.log("FS Path:", fsPath);
    // console.log("Resolved URL:", fileUrl);
    // if (fs.existsSync(fsPath)) {
    //   mainWindow.loadURL(fileUrl);
    // } else {
    //   console.error("❌ Không tìm thấy dist/index.html:", fsPath);
    // }
    mainWindow.loadFile(path_1.default.join(__dirname, "../dist/index.html"));
    const devURL = process.env.VITE_DEV_SERVER_URL;
    console.log("Loading from dev:", devURL);
    if (devURL) {
        mainWindow.loadURL(devURL);
    }
    else {
        mainWindow.loadFile(path_1.default.join(__dirname, "../dist/index.html"));
    }
    mainWindow.on("closed", () => {
        mainWindow = null;
    });
};
electron_1.app.whenReady().then(() => {
    createWindow();
    // ✅ Xoá toàn bộ menu macOS, bao gồm cả Developer Tools
    electron_1.Menu.setApplicationMenu(electron_1.Menu.buildFromTemplate([]));
    electron_1.app.on("activate", () => {
        if (electron_1.BrowserWindow.getAllWindows().length === 0)
            createWindow();
    });
});
electron_1.app.on("window-all-closed", () => {
    if (process.platform !== "darwin")
        electron_1.app.quit();
});
electron_1.ipcMain.handle("get-network-info", async () => {
    const nets = await systeminformation_1.default.networkInterfaces();
    const active = nets.find((n) => n.default || n.operstate === "up");
    return {
        ip: active?.ip4 || active?.ip6 || "",
        mac: active?.mac || "",
        iface: active?.ifaceName || "",
    };
});
