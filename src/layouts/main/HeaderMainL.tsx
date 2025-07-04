import { Breadcrumb, Avatar, Dropdown } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";
import { toggleTheme } from "../../features/setting/ThemeSlice";
import type { RootState } from "../../app/store";
import { MoonIcon, SunIcon } from "lucide-react";
import LanguageSelectorMain from "../../components/LanguageSelectorMain";
import { useTranslation } from "react-i18next";

// Ánh xạ URL segment → i18n key
const segmentToI18nKey: Record<string, string> = {
  home: "breadcrumb.home",
  system: "breadcrumb.system",
  workspace: "breadcrumb.workspace",
  users: "breadcrumb.users",
  dashboard: "breadcrumb.dashboard",
  "workspace-mng": "breadcrumb.workspaceManagement",
  "system-setting": "breadcrumb.systemSettings",
  "device-ip": "breadcrumb.deviceIpManagement",
  security: "breadcrumb.security",
  "audit-log": "breadcrumb.securityEvents",
  "security-incidents": "breadcrumb.securityIncidents",
  statistical: "breadcrumb.statistical",
};

// Sinh breadcrumb từ URL + theme
const generateBreadcrumbItems = (
  pathname: string,
  isDark: boolean,
  t: (key: string) => string
) => {
  const segments = pathname.split("/").filter(Boolean);
  const baseColor = isDark ? "text-white" : "text-black";
  const lastColor = "text-gray-400";

  return [
    { title: <span className={baseColor}>{t("breadcrumb.home")}</span> },
    ...segments.map((segment, idx) => {
      const isLast = idx === segments.length - 1;
      const labelKey = segmentToI18nKey[segment] || segment;
      return {
        title: (
          <span className={isLast ? lastColor : baseColor}>{t(labelKey)}</span>
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
  const { t } = useTranslation();

  const segments = location.pathname.split("/").filter(Boolean);
  const lastSegment = segments[segments.length - 1] || "home";
  const pageTitle = t(segmentToI18nKey[lastSegment] || lastSegment);
  const breadcrumbItems = generateBreadcrumbItems(location.pathname, isDark, t);

  return (
    <header className="w-full px-6 py-4 flex justify-between items-center bg-transparent">
      {/* LEFT: Title + Breadcrumb */}
      <div className="flex flex-col">
        <h1
          className={`text-[24px] font-bold leading-tight ${
            isDark ? "text-white" : "text-black"
          }`}
        >
          {pageTitle}
        </h1>
        <Breadcrumb
          separator="–"
          className={`text-sm mt-1 ${isDark ? "text-white" : "text-black"}`}
          items={breadcrumbItems}
        />
      </div>

      {/* RIGHT: Language + Theme + Avatar */}
      <div className="flex items-center gap-4">
        {/* Language selector (left riêng) */}
        <LanguageSelectorMain />

        {/* Theme toggle + Avatar group */}
        <div
          className={`flex items-center gap-3 px-4 py-1 rounded-full transition-all hover:shadow-lg h-11
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
            <div
              className={`absolute top-0 left-0 w-full h-full rounded-full transition ${
                isDark ? "bg-[#F7F8F91F]" : "bg-[#DEE2E6]"
              }`}
            />
            <MoonIcon
              size={16}
              className={`absolute top-1.5 left-1.5 z-10 transition-all ${
                isDark
                  ? "text-white bg-[#9013FE] rounded-full p-1"
                  : "text-gray-400"
              }`}
            />
            <SunIcon
              size={16}
              className={`absolute top-1.5 right-1.5 z-10 transition-all ${
                !isDark
                  ? "text-white bg-[#9013FE] rounded-full p-1"
                  : "text-gray-500 opacity-30"
              }`}
            />
          </label>

          <Dropdown
            overlay={<div className="p-2 text-white">Dropdown here</div>}
          >
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
      </div>
    </header>
  );
};

export default PageHeader;
