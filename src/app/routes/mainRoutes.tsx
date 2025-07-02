import { Outlet } from "react-router-dom";
import SystemSettings from "../../features/setting/SystemSetting";
import UserForm from "../../features/users/pages/UserForm";
import UserList from "../../features/users/pages/UserList";
import { DivideCircle } from "lucide-react";
import WorkspaceManagement from "../../features/workspace_management/pages/WorkspaceList";
import { AddEditWorkspaceModal } from "../../features/workspace_management/pages/ModalWorkspace";
import AddEditWorkspaceScreen from "../../features/workspace_management/pages/WorkspaceForm";

export const securityRoutes = {
  path: "/security",
  children: [
    { path: "audit-log", element: <div /> },
    { path: "security-incidents", element: <DivideCircle /> },
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
    {
      path: "workspace-mng",
      element: <WorkspaceManagement />,
    },
    { path: "workspace-mng/create", element: <AddEditWorkspaceScreen /> },
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
