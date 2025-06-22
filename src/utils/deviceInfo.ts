// 📁 src/utils/deviceInfo.ts

// ✅ Lấy IP và MAC — để dùng trong header
export const getIpMac = () => {
  if (window.deviceInfo?.get) {
    const { ip, mac } = window.deviceInfo.get();
    return { ip, mac };
  }
  return { ip: "unknown", mac: "unknown" };
};

// ✅ Lấy ID, OS, Type, Name — để dùng trong body
export const getDeviceMeta = () => {
  if (window.deviceInfo?.get) {
    const { deviceId, deviceName, os, deviceType } = window.deviceInfo.get();
    return { deviceId, deviceName, os, deviceType };
  }
  return {
    deviceId: "unknown",
    deviceName: "unknown",
    os: "unknown",
    deviceType: "unknown",
  };
};
