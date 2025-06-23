// ✅ File: sideMenu.tsx
import { useLocation, useNavigate } from "react-router-dom";
import {
  HomeOutlined,
  UserOutlined,
  SettingOutlined,
  LockOutlined,
  LineChartOutlined,
  LogoutOutlined,
  SecurityScanOutlined,
  AppstoreOutlined,
  ToolOutlined,
} from "@ant-design/icons";
import { useSelector } from "react-redux";
import type { RootState } from "../../app/store";
import { useEffect, useState } from "react";

export const menuItems = [
  { key: "/", icon: <HomeOutlined />, label: "Dashboard" },
  { key: "/users/", icon: <UserOutlined />, label: "Users" },
  {
    key: "/workspace",
    icon: <LockOutlined />,
    label: "Workspace",
  },
  {
    key: "/security",
    icon: <SecurityScanOutlined />,
    label: "Security & Monitoring",
    isGroup: true,
    submenus: [
      {
        key: "/security/audit-log",
        icon: <ToolOutlined className="text-2xl" />,
        title: "Security Events",
      },
      {
        key: "/security/security-incidents",
        icon: <AppstoreOutlined className="text-2xl" />,
        title: "Security Incidents",
      },
    ],
  },
  {
    key: "/system",
    icon: <SettingOutlined />,
    label: "System",
    isGroup: true,
    submenus: [
      {
        key: "/system/workspace",
        icon: <AppstoreOutlined className="text-2xl" />,
        title: "Workspace Management",
      },
      {
        key: "/system/system-setting",
        icon: <SettingOutlined className="text-2xl" />,
        title: "System Settings",
      },
      {
        key: "/system/device-ip",
        icon: <ToolOutlined className="text-2xl" />,
        title: "Device & IP Management",
      },
    ],
  },
  {
    key: "/statistical",
    icon: <LineChartOutlined />,
    label: "Statistical",
    isGroup: true,
  },
];

const SiderMenu = ({
  onSelectGroup,
}: {
  onSelectGroup: (group: string) => void;
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const isDark = useSelector((state: RootState) => state.theme.darkMode);
  const [activeGroupKey, setActiveGroupKey] = useState<string | null>(null);
  const currentRoot = `/${location.pathname.split("/")[1]}`;

  useEffect(() => {
    setActiveGroupKey(currentRoot); // reset active group based on route
  }, [location.pathname]);

  const handleClick = (item: (typeof menuItems)[number]) => {
    if (item.isGroup) {
      setActiveGroupKey(item.key); // activate only this group
      onSelectGroup(item.key);
    } else {
      setActiveGroupKey(null); // clear group selection
      navigate(item.key);
    }
  };

  return (
    <div className="h-full w-full flex flex-col items-center py-4">
      {/* Logo */}
      <svg
        width={50}
        height={50}
        viewBox="0 0 150 151"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M62.1625 19.7H87.85C99.35 19.7 108.413 19.7 115.538 20.6375C122.85 21.6375 128.788 23.7 133.475 28.3875C138.163 33.075 140.225 39.0125 141.225 46.325C141.788 50.5125 142.038 55.45 142.1 61.075C142.1 61.325 142.163 61.575 142.163 61.8875V83.7625C142.163 86.325 140.038 88.45 137.475 88.45C134.913 88.45 132.788 86.325 132.788 83.7625V66.575H54.6625V94.7H74.975C77.5375 94.7 79.6625 96.825 79.6625 99.3875C79.6625 101.95 77.5375 104.075 74.975 104.075H54.6625V132.2H74.975C77.5375 132.2 79.6625 134.325 79.6625 136.888C79.6625 139.45 77.5375 141.575 74.975 141.575H49.975C49.725 141.575 49.4125 141.575 49.1625 141.513C43.475 141.388 38.6 141.2 34.4125 140.638C27.1 139.638 21.1625 137.575 16.475 132.888C11.7875 128.2 9.72501 122.263 8.72501 114.95C8.16251 110.763 7.91251 105.825 7.85001 100.2C7.85001 99.95 7.78751 99.7 7.78751 99.3875V61.95C7.78751 61.7 7.78751 61.3875 7.85001 61.1375C7.97501 55.45 8.16251 50.575 8.72501 46.3875C9.72501 39.075 11.7875 33.1375 16.475 28.45C21.1625 23.7625 27.1 21.7 34.4125 20.7C38.6 20.1375 43.5375 19.8875 49.1625 19.825C49.4125 19.825 49.6625 19.7625 49.975 19.7625H62.1L62.1625 19.7ZM45.35 29.2625C41.6625 29.3875 38.5375 29.575 35.725 29.95C29.4125 30.825 25.7875 32.3875 23.1625 35.0125C20.5375 37.6375 18.9125 41.2625 18.1 47.575C17.725 50.3875 17.5375 53.5125 17.4125 57.2H45.35V29.2625ZM54.725 57.2V29.075H87.5375C99.475 29.075 107.912 29.075 114.35 29.95C120.662 30.825 124.288 32.3875 126.913 35.0125C129.538 37.6375 131.162 41.2625 131.975 47.575C132.35 50.3875 132.538 53.5125 132.663 57.2H54.725ZM45.35 66.575H17.225V94.7H45.35V66.575ZM45.35 104.075H17.4125C17.5375 107.763 17.725 110.888 18.1 113.7C18.975 120.013 20.5375 123.638 23.1625 126.263C25.7875 128.888 29.4125 130.513 35.725 131.325C38.5375 131.7 41.6625 131.888 45.35 132.013V104.075ZM105.663 86.575C108.35 80.7625 116.663 80.7625 119.413 86.575L123.35 94.95C124.6 97.6375 126.787 99.825 129.475 101.075L137.85 105.013C143.663 107.7 143.663 116.013 137.85 118.763L129.475 122.7C126.787 123.95 124.6 126.138 123.35 128.825L119.413 137.2C116.725 143.013 108.413 143.013 105.663 137.2L101.725 128.825C100.475 126.138 98.2875 123.95 95.6 122.7L87.225 118.763C81.4125 116.075 81.4125 107.763 87.225 105.013L95.6 101.075C98.2875 99.825 100.475 97.6375 101.725 94.95L105.663 86.575ZM112.538 94.0125L110.225 98.95C108.045 103.669 104.257 107.458 99.5375 109.638L94.6 111.95L99.5375 114.263C104.225 116.45 108.038 120.2 110.225 124.95L112.538 129.888L114.85 124.95C117.037 120.263 120.788 116.45 125.538 114.263L130.475 111.95L125.538 109.638C120.818 107.458 117.03 103.669 114.85 98.95L112.538 94.0125Z"
          fill="url(#paint0_linear_32_33)"
        />
        <defs>
          <linearGradient
            id="paint0_linear_32_33"
            x1={8}
            y1={20}
            x2={142}
            y2={142}
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="white" />
            <stop offset="0.5" stopColor="#E476AD" />
            <stop offset={1} stopColor="#6610F2" />
          </linearGradient>
        </defs>
      </svg>

      {/* Menu List */}
      <div className="flex flex-col gap-3 w-full px-1 flex-grow py-6 px-7">
        {menuItems.map((item) => {
          const isActive = item.key === activeGroupKey;
          return (
            <div
              key={item.key}
              onClick={() => handleClick(item)}
              className={`relative flex flex-col items-center justify-center py-2 rounded-xl cursor-pointer transition
    ${
      isActive
        ? `${
            isDark ? "bg-[#5b21b6]/30" : "#FFFFFF"
          } text-[#a855f7] font-medium shadow-[0_4px_12px_rgba(100,35,216,0.08)]`
        : `${isDark ? "text-white" : "text-gray-700"} hover:text-[#a855f7]`
    }`}
            >
              {/* Left border line when active */}
              {isActive && (
                <div className="absolute left-0 top-6 bottom-6 w-1 rounded-r bg-[#a855f7]" />
              )}

              {/* Icon (only icon has indigo color when active) */}
              <div className={`text-xl ${isActive ? "text-#5b21b6" : ""}`}>
                {item.icon}
              </div>

              {/* Label (text stays styled separately) */}
              <div
                className={`text-xs mt-1 text-center leading-tight ${
                  isActive ? "" : isDark ? "text-white" : "text-gray-700"
                }`}
              >
                {item.label}
              </div>
            </div>
          );
        })}
      </div>

      {/* Logout */}
      <div
        onClick={() => navigate("/auth/login")}
        className="mb-4 flex flex-col items-center justify-center cursor-pointer text-white hover:text-red-400"
      >
        <LogoutOutlined className="text-xl" style={{ color: "#6B7280" }} />{" "}
        {/* Tailwind: gray-500 */}
        <span className="text-xs mt-1 text-gray-500">Logout</span>
      </div>
    </div>
  );
};

export default SiderMenu;
