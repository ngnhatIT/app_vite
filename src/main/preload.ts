import { contextBridge, ipcRenderer } from 'electron';

console.log('✅ [Preload] Loaded'); // debug

contextBridge.exposeInMainWorld('deviceInfo', {
  get: async () => {
    console.log('✅ [Preload] deviceInfo.get() called');
    const info = await ipcRenderer.invoke('get-network-info');

    return {
      ip: info?.ip || '',
      mac: info?.mac || '',
      deviceId: info?.mac || '',
      deviceName: info?.iface || '',
      os: navigator.userAgent,
      deviceType: 'desktop',
    };
  }
});

// test flag
(window as any).debugPreload = '✅ from preload';
