import { useSelector } from "react-redux";
import { Outlet } from "react-router-dom";
import type { RootState } from "../../app/store";
import AuthLeftPanel from "./AuthLeftPanel";
import "../../css/layout.css";
import bgLight from "../../assets/bg-light.png";
import LanguageSelector from "../../components/LanguageSelector";

export const AuthLayout = () => {
  const isDark = useSelector((state: RootState) => state.theme.darkMode);
  const layoutClass = isDark ? "login-dark-mode-EN" : "login-light-mode-EN";

  return (
    <div
      className={layoutClass}
      style={
        !isDark
          ? {
              backgroundImage: `url(${bgLight})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
            }
          : undefined
      }
    >
      <LanguageSelector />
      {isDark && (
        <>
          <div className="ellipse" />
          <div className="ellipse-2" />
        </>
      )}

      <div className="auth-container">
        <div className="flex-[2]">
          <AuthLeftPanel />
        </div>
        <div className="flex-[3]">
          <Outlet />
        </div>
      </div>
    </div>
  );
};
