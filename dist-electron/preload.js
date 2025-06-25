"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
electron_1.contextBridge.exposeInMainWorld("deviceInfo", {
    get: async () => {
        const info = await electron_1.ipcRenderer.invoke("get-network-info");
        return {
            ip: info?.ip || "",
            mac: info?.mac || "",
            deviceId: info?.mac || "",
            deviceName: info?.iface || "",
            os: navigator.userAgent,
            deviceType: "desktop",
        };
    },
});
// test flag
window.debugPreload = "✅ from preload";
