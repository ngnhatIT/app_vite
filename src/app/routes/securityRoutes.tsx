import AuditLog from "../../features/security/AuditLog";
import SecurityIncidents from "../../features/security/SecurityIncidents";
import DeviceIpManagement from "../../features/setting/pages/DeviceIP";
import IPWhitelistSetting from "../../features/setting/pages/SettupIp";
import SystemSettings from "../../features/setting/pages/SystemSetting";

export const securityRoutes = {
  path: "/security",
  children: [
    { path: "audit-log", element: <AuditLog /> },
    { path: "device-ip", element: <DeviceIpManagement /> },
    { path: "ip-whitelist", element: <IPWhitelistSetting /> },
    { path: "security-incidents", element: <SecurityIncidents /> },
    { path: "setting-system", element: <SystemSettings /> },
  ],
};
