// 📁 src/types/global.d.ts

export {};

declare global {
  interface Window {
    deviceInfo?: {
      get: () => {
        ip: string;
        mac: string;
        deviceId: string;
        deviceName: string;
        os: string;
        deviceType: string;
      };
    };
    electron?: {
      ipcRenderer: {
        send: (channel: string, data?: any) => void;
        on: (channel: string, callback: (...args: any[]) => void) => void;
      };
    };
  }
}
