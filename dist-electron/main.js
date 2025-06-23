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
        width: 800,
        height: 600,
        webPreferences: {
            preload: path_1.default.join(__dirname, 'preload.js'),
            contextIsolation: true,
            nodeIntegration: false,
        },
    });
    const devURL = process.env.VITE_DEV_SERVER_URL || 'http://localhost:5173';
    console.log('Loading from dev:', devURL);
    if (devURL) {
        mainWindow.loadURL(devURL);
    }
    else {
        mainWindow.loadFile(path_1.default.join(__dirname, '../dist/index.html'));
    }
    mainWindow.on('closed', () => {
        mainWindow = null;
    });
};
electron_1.app.whenReady().then(() => {
    createWindow();
    electron_1.app.on('activate', () => {
        if (electron_1.BrowserWindow.getAllWindows().length === 0)
            createWindow();
    });
});
electron_1.app.on('window-all-closed', () => {
    if (process.platform !== 'darwin')
        electron_1.app.quit();
});
electron_1.ipcMain.handle('get-network-info', async () => {
    const nets = await systeminformation_1.default.networkInterfaces();
    const active = nets.find((n) => n.default || n.operstate === 'up');
    return {
        ip: active?.ip4 || active?.ip6 || '',
        mac: active?.mac || '',
        iface: active?.ifaceName || '',
    };
});
