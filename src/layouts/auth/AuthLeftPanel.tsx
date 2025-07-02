import { useDispatch, useSelector } from "react-redux";
import { Select } from "antd";
import type { RootState } from "../../app/store";
import { toggleTheme } from "../../features/setting/themeSlice";
import LabelComponent from "../../components/LabelComponent";
import darkModeIcon from "../../assets/dark_mode.svg";
import ligthModeIcon from "../../assets/light_mode.svg";
import logo from "../../assets/logo.svg";

const { Option } = Select;

const AuthLeftPanel = () => {
  const dispatch = useDispatch();
  const isDark = useSelector((state: RootState) => state.theme.darkMode);

  const currentTheme = isDark ? "dark" : "light";

  const handleThemeChange = (value: string) => {
    if (value !== currentTheme) {
      dispatch(toggleTheme());
    }
  };

  return (
    <div className="card flex flex-col flex-shrink-0 border-[#0000]/0 bg-[#bfbfbf]/[.6]">
      <div className=" flex flex-col justify-center items-start gap-[8px]">
        <img
          src={logo}
          alt="Logo"
          width={206}
          height={222}
          className=" pb-[36px]"
        />
        <div className="flex flex-col items-start self-stretch pt-[20px] pb-[12px]">
          <LabelComponent
            as="h1"
            label="auth.title"
            checkSpecial
            className="text-[#985ff6] text-[48px] leading-[40px] font-medium capitalize"
          />
          <LabelComponent
            as="h2"
            label="auth.subTitle"
            isDark={isDark}
            className="opacity-70 text-[28px] leading-normal capitalize"
          />
        </div>
        <div className="flex flex-col items-start self-stretch gap-[2px]">
          <LabelComponent
            label="auth.description1"
            checkSpecial
            as="p"
            className="text-[#9e9e9e] text-[12px] leading-normal"
          />
          <LabelComponent
            label="auth.description2"
            checkSpecial
            as="p"
            className="text-[#9e9e9e] text-[12px] leading-normal self-stretch"
          />
        </div>

        <div className="flex flex-col items-start gap-4 pt-[22px]">
          <div className="flex items-center gap-4 h-[42px] rounded-lg border border-[#4b3b61] bg-white/[.6] px-4 py-2">
            {isDark ? (
              <img src={darkModeIcon} alt="dark mode" width={18} height={18} />
            ) : (
              <img src={ligthModeIcon} alt="dark mode" width={18} height={18} />
            )}
            <div className="w-px h-3 bg-[#cecaca]" />
            <Select
              value={currentTheme}
              onChange={handleThemeChange}
              variant="borderless"
              styles={{ popup: { root: { fontFamily: "Poppins" } } }}
              className="font-['Poppins'] text-sm text-[#f8f9fa] w-[100px] bg-transparent custom-theme-select"
              classNames={{ popup: { root: "theme-select-dropdown" } }}
            >
              <Option value="light">Light</Option>
              <Option value="dark">Dark</Option>
            </Select>
          </div>

          <LabelComponent
            as="p"
            label="auth.footer"
            checkSpecial
            className="text-[#9e9e9e] text-[12px] leading-normal mt-4"
          />
        </div>
      </div>
    </div>
  );
};

export default AuthLeftPanel;
