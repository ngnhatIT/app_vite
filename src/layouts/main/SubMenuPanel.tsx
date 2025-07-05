import { useNavigate, useLocation } from "react-router-dom";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import { useSelector } from "react-redux";
import type { RootState } from "../../app/store";
import type { ReactNode } from "react";
import LabelComponent from "../../components/LabelComponent";

interface SubMenuItem {
  key: string;
  icon: ReactNode;
  title: string;
  link: string;
  workspaceId?: string;
  workspaceName?: string;
}

interface SubMenuPanelProps {
  group: string;
  submenus?: Record<string, SubMenuItem[]>;
  onClosePanel?: () => void;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
}

const SubMenuPanel = ({
  group,
  submenus = {},
  onClosePanel,
  collapsed = false,
  onToggleCollapse,
}: SubMenuPanelProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const isDark = useSelector((state: RootState) => state.theme.darkMode);

  const items = submenus[group] || [];
  const currentWorkspaceId = location.state?.workspaceId;

  const handleNavigate = (item: SubMenuItem) => {
    if (group === "/workspace") {
      navigate(item.link, {
        state: {
          workspaceId: item.workspaceId,
          workspaceName: item.workspaceName,
        },
      });
    } else {
      navigate(item.key);
    }
    onClosePanel?.();
  };

  return (
    <div
      className="h-full py-4 flex flex-col gap-4 relative"
      style={{
        borderRadius: 24,
        background: isDark
          ? "linear-gradient(238deg, rgba(13, 4, 24, 0.54) 30.62%, rgba(22, 3, 53, 0.54) 100%)"
          : "#FFFFFFA3",
        boxShadow: "2px 2px 8px 0px rgba(72, 11, 172, 0.12)",
        backdropFilter: "blur(12px)",
      }}
    >
      <button
        onClick={onToggleCollapse}
        className={`absolute -right-3 top-1/2 transform -translate-y-1/2 z-10 w-6 h-6 border rounded-full flex items-center justify-center shadow transition
    ${
      isDark
        ? "bg-black text-white border-gray-700"
        : "bg-white text-black border-gray-300 hover:bg-gray-100"
    }
  `}
      >
        {collapsed ? <RightOutlined /> : <LeftOutlined />}
      </button>

      <div
        className={`w-full p-2 grid ${
          collapsed ? "grid-cols-1" : "grid-cols-2"
        } gap-3`}
      >
        {items.map((item) => {
          let isActive =
            group === "/workspace"
              ? location.pathname === item.link &&
                currentWorkspaceId === item.workspaceId
              : location.pathname === item.key;

          return (
            <div
              key={item.key}
              onClick={() => handleNavigate(item)}
              className={`flex flex-col items-center justify-center text-center p-2 rounded-xl cursor-pointer transition
                ${
                  isActive
                    ? `${
                        isDark ? "bg-[#5b21b6]/30" : "#FFFFFF"
                      } text-[#a855f7] font-medium shadow-md`
                    : `${
                        isDark ? "text-white" : "text-gray-700"
                      } hover:text-[#a855f7]`
                }
              `}
            >
              <div className="text-xl">{item.icon}</div>
              {!collapsed && (
                <LabelComponent label={item.title} isDark={isDark} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SubMenuPanel;
