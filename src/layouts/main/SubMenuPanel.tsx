import { useNavigate, useLocation } from "react-router-dom";
import type { ReactNode } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../../app/store";
import { Divider } from "antd";

interface SubMenuItem {
  key: string;
  icon: ReactNode;
  title: string;
  link: string;
}

interface SubMenuPanelProps {
  group: string;
  submenus?: Record<string, SubMenuItem[]>;
  onClosePanel?: () => void;
}

const SubMenuPanel = ({
  group,
  submenus = {},
  onClosePanel,
}: SubMenuPanelProps) => {
  const navigate = useNavigate();
  const location = useLocation(); // ✅ để biết current path
  const items = submenus[group] || [];
  const groupTitle = group.replace("/", "").replace(/-/g, " ");
  const isDark = useSelector((state: RootState) => state.theme.darkMode);
  const handleNavigate = (link: string) => {
    navigate(link);
    onClosePanel?.();
  };

  return (
    <div
      className="w-full h-full py-4 flex flex-col gap-4"
      style={{
        borderRadius: 24,
        background: isDark
          ? "linear-gradient(238deg, rgba(13, 4, 24, 0.54) 30.62%, rgba(22, 3, 53, 0.54) 100%)"
          : "#FFFFFFA3",
        boxShadow: "2px 2px 8px 0px rgba(72, 11, 172, 0.12)",
        backdropFilter: "blur(12px)",
      }}
    >
      <h2
        className={`text-lg font-semibold px-5 capitalize ${
          isDark ? "text-white" : "text-black"
        }`}
      >
        {groupTitle}
      </h2>
      <div className="mt-2 border-b border-gray-200" />
      <div className="grid grid-cols-2 gap-5 w-full p-4">
        {items.map((item) => {
          const isActive = location.pathname === item.key; // ✅ check active
          return (
            <div
              key={item.key}
              onClick={() => handleNavigate(item.key)}
              className={`flex flex-col items-center justify-center text-center px-2 py-3 rounded-xl transition cursor-pointer
                ${
                  isActive
                    ? `${
                        isDark ? "bg-[#5b21b6]/30" : "#FFFFFF"
                      } text-[#a855f7] font-medium shadow-[0_4px_12px_rgba(100,35,216,0.08)]`
                    : `${
                        isDark ? "text-white" : "text-gray-700"
                      } hover:text-[#a855f7]`
                }
              `}
            >
              <div
                className={`text-xl ${
                  isActive ? "" : isDark ? "text-white" : "text-#FFFFFFA3"
                }`}
              >
                {item.icon}
              </div>

              {/* Label (text stays styled separately) */}
              <div
                className={`text-xs mt-1 text-center leading-tight ${
                  isActive ? "" : isDark ? "text-white" : "text-#FFFFFFA3"
                }`}
              >
                {item.title}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SubMenuPanel;
