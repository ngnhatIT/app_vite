import { Breadcrumb, Avatar, Dropdown } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";
import { toggleTheme } from "../../features/setting/ThemeSlice";
import type { RootState } from "../../app/store";
import { MoonIcon, SunIcon } from "lucide-react";
import LanguageSelector from "../../components/LanguageSelector";

// format segment: system-settings -> System Settings
const formatSegment = (segment: string) =>
  segment.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

// generate breadcrumb array
const generateBreadcrumbItems = (pathname: string, isDark: boolean) => {
  const segments = pathname.split("/").filter(Boolean);
  const baseColor = isDark ? "text-white" : "text-black";
  const lastColor = "text-gray-400";

  return [
    { title: <span className={baseColor}>Home</span> },
    ...segments.map((segment, idx) => {
      const isLast = idx === segments.length - 1;
      return {
        title: (
          <span className={isLast ? lastColor : baseColor}>
            {formatSegment(segment)}
          </span>
        ),
      };
    }),
  ];
};

const PageHeader = () => {
  const dispatch = useDispatch();
  const isDark = useSelector((state: RootState) => state.theme.darkMode);
  const user = useSelector((state: RootState) => state.auth.user);
  const location = useLocation();

  const segments = location.pathname.split("/").filter(Boolean);
  const title = formatSegment(segments[segments.length - 1] || "Home");
  const breadcrumbItems = generateBreadcrumbItems(location.pathname, isDark);

  return (
    <header className="w-full px-6 py-4 flex justify-between items-center bg-transparent">
      {/* LEFT: Title + Breadcrumb */}
      <div className="flex flex-col">
        <h1
          className={`text-[24px] font-bold leading-tight ${
            isDark ? "text-white" : "text-black"
          }`}
        >
          {title}
        </h1>
        <Breadcrumb
          separator="–"
          className={`text-sm mt-1 ${isDark ? "text-white" : "text-black"}`}
          items={breadcrumbItems}
        />
      </div>

      {/* RIGHT: Dark mode + Avatar */}
      <div className="flex items-center gap-4">
        <LanguageSelector />
        <div
          className={`flex items-center gap-5 px-4 py-1 rounded-full transition-all hover:shadow-lg h-11
        ${isDark ? "bg-[#1C1C2E] border border-[#343A40]" : "bg-[#F7F8F9]"}`}
        >
          <span
            className={`text-sm ${isDark ? "text-white" : "text-[#343A40]"}`}
          >
            {isDark ? "Dark" : "Light"}
          </span>

          <label className="relative w-[52px] h-[28px] inline-block cursor-pointer">
            <input
              type="checkbox"
              checked={isDark}
              onChange={() => dispatch(toggleTheme())}
              className="sr-only peer"
            />
            {/* Track */}
            <div
              className={`absolute top-0 left-0 w-full h-full rounded-full transition
    ${isDark ? "bg-[#F7F8F91F]" : "bg-[#DEE2E6]"}
  `}
            />

            {/* Moon Icon (Left) */}
            <MoonIcon
              size={16}
              className={`absolute top-1.5 left-1.5 z-10 transition-all
            ${
              isDark
                ? "text-white bg-[#9013FE] rounded-full p-1"
                : "text-gray-400"
            }
          `}
            />

            {/* Sun Icon (Right) */}
            <SunIcon
              size={16}
              className={`absolute top-1.5 right-1.5 z-10 transition-all
            ${
              !isDark
                ? "text-white bg-[#9013FE] rounded-full p-1"
                : "text-gray-500 opacity-30"
            }
          `}
            />
          </label>
        </div>

        <Dropdown overlay={<div className="p-2 text-white">Dropdown here</div>}>
          <Avatar
            className="cursor-pointer"
            size={40}
            style={{
              background: "linear-gradient(135deg, #ec4899, #a855f7)",
              color: "#fff",
              fontWeight: 600,
            }}
          >
            {user?.username?.[0]?.toUpperCase() || "U"}
          </Avatar>
        </Dropdown>
      </div>
    </header>
  );
};

export default PageHeader;
