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
    { index: true, element: <UserList /> }, // tương ứng path: '' khi /users
    { path: "profile", element: <div>User Profile</div> },
    { path: "create", element: <div>Create User</div> },
    { path: "update", element: <div>Update User</div> },
  ],
};

export const systemRoutes = {
  path: "/system",
  children: [
    { path: "workspace", element: <div>User Profile</div> },
    { path: "device-ip", element: <div>Create User</div> },
    { path: "system-setting", element: <SystemSettings /> },
  ],
};
