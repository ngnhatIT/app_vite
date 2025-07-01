import { Outlet } from "react-router-dom";
import AuditLog from "../../features/security/AuditLog";
import SecurityIncidents from "../../features/security/SecurityIncidents";
import SystemSettings from "../../features/setting/pages/SystemSetting";
import UserForm from "../../features/users/pages/UserForm";
import UserList from "../../features/users/pages/UserList";

export const securityRoutes = {
  path: "/security",
  children: [
    { path: "audit-log", element: <AuditLog /> },
    { path: "security-incidents", element: <SecurityIncidents /> },
  ],
};

export const userRoutes = {
  path: "/users",
  element: (
    <div className="p-5">
      <Outlet />
    </div>
  ),
  children: [
    { index: true, element: <UserList /> },
    { path: "profile", element: <div>User Profile</div> },
    { path: "create", element: <UserForm /> },
    { path: "update", element: <UserForm /> },
  ],
};

export const systemRoutes = {
  path: "/system",
  children: [
    { path: "workspace-mng", element: <div>Workspace management</div> },
    { path: "device-ip", element: <div>Device & IP</div> },
    { path: "system-setting", element: <SystemSettings /> },
  ],
};

export const workspaceRoutes = {
  path: "/workspace",
  element: <div>workspace</div>,
};

export const statisticalRoutes = {
  path: "/statistical",
  element: <div>statistical</div>,
};
