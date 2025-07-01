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
import { useTranslation } from "react-i18next";
import logo from ".././../assets/logo_main.svg";
import logoLight from "../../assets/logo_main_light.svg";

export const menuItems = [
  { key: "/", icon: <HomeOutlined />, label: "menu.dashboard" },
  { key: "/users/", icon: <UserOutlined />, label: "menu.users" },
  { key: "/workspace", icon: <LockOutlined />, label: "menu.workspace" },
  {
    key: "/security",
    icon: <SecurityScanOutlined />,
    label: "menu.security",
    isGroup: true,
    submenus: [
      {
        key: "/security/audit-log",
        icon: <ToolOutlined className="text-2xl" />,
        title: "menu.securityEvents",
      },
      {
        key: "/security/security-incidents",
        icon: <AppstoreOutlined className="text-2xl" />,
        title: "menu.securityIncidents",
      },
    ],
  },
  {
    key: "/system",
    icon: <SettingOutlined />,
    label: "menu.system",
    isGroup: true,
    submenus: [
      {
        key: "/system/workspace-mng",
        icon: <AppstoreOutlined className="text-2xl" />,
        title: "menu.workspaceMng",
      },
      {
        key: "/system/system-setting",
        icon: <SettingOutlined className="text-2xl" />,
        title: "menu.systemSettings",
      },
      {
        key: "/system/device-ip",
        icon: <ToolOutlined className="text-2xl" />,
        title: "menu.deviceIpMng",
      },
    ],
  },
  {
    key: "/statistical",
    icon: <LineChartOutlined />,
    label: "menu.statistical",
    isGroup: true,
  },
];

const SiderMenu = ({
  onSelectGroup,
}: {
  onSelectGroup: (group: string) => void;
}) => {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const isDark = useSelector((state: RootState) => state.theme.darkMode);
  const [activeGroupKey, setActiveGroupKey] = useState<string | null>(null);
  const [activeItemKey, setActiveItemKey] = useState<string | null>(null);

  useEffect(() => {
    const matchedGroup = menuItems.find(
      (item) => item.isGroup && location.pathname.startsWith(item.key)
    );
    if (matchedGroup) {
      setActiveGroupKey(matchedGroup.key);
      setActiveItemKey(null);
    } else {
      setActiveItemKey(location.pathname);
      setActiveGroupKey(null);
    }
  }, [location.pathname]);

  const handleClick = (item: (typeof menuItems)[number]) => {
    if (item.isGroup) {
      setActiveGroupKey(item.key);
      setActiveItemKey(null);
      onSelectGroup(item.key);
    } else {
      setActiveItemKey(item.key);
      setActiveGroupKey(null);
      navigate(item.key);
    }
  };

  return (
    <div className="h-full w-full flex flex-col items-center py-4">
      {/* Logo SVG giữ nguyên như cũ, đã rút gọn tại đây */}
      <img
        src={isDark ? logo : logoLight}
        alt="Logo"
        width={37.5}
        height={50}
        className=" pb-[36px]"
      />
      {/* Menu List */}
      <div className="flex flex-col gap-3 w-full px-1 flex-grow py-6 px-7">
        {menuItems.map((item) => {
          const isActive =
            item.key === activeItemKey || item.key === activeGroupKey;
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
                    : `${
                        isDark ? "text-white" : "text-gray-700"
                      } hover:text-[#a855f7]`
                }`}
            >
              {isActive && (
                <div className="absolute left-0 top-6 bottom-6 w-1 rounded-r bg-[#a855f7]" />
              )}
              <div className={`text-xl ${isActive ? "text-[#5b21b6]" : ""}`}>
                {item.icon}
              </div>
              <div
                className={`text-xs mt-1 text-center leading-tight ${
                  isActive ? "" : isDark ? "text-white" : "text-gray-700"
                }`}
              >
                {t(item.label)}
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
        <LogoutOutlined className="text-xl" style={{ color: "#6B7280" }} />
        <span className="text-xs mt-1 text-gray-500">{t("menu.logout")}</span>
      </div>
    </div>
  );
};

export default SiderMenu;
