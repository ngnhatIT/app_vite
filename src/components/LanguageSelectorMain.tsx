import { useTranslation } from "react-i18next";
import { Dropdown, Menu, Button } from "antd";
import { GlobalOutlined } from "@ant-design/icons";
import { useSelector } from "react-redux";
import type { RootState } from "../app/store"; // Cập nhật đúng path nếu khác
import "../css/language_selector.css";

const LanguageSelectorMain = () => {
  const { i18n } = useTranslation();
  const isDark = useSelector((state: RootState) => state.theme.darkMode);

  const handleChangeLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
    localStorage.setItem("lang", lang);
  };

  const currentLang = i18n.language === "ja" ? "Japanese" : "English";

  const menu = (
    <Menu className="custom-language-menu">
      <Menu.Item key="en" onClick={() => handleChangeLanguage("en")}>
        English
      </Menu.Item>
      <Menu.Item key="ja" onClick={() => handleChangeLanguage("ja")}>
        Japanese
      </Menu.Item>
    </Menu>
  );

  return (
    <Dropdown overlay={menu} placement="bottomLeft" arrow>
      <Button
        icon={<GlobalOutlined />}
        className={`!text-white !border-white/30 backdrop-blur-md rounded-full px-4 py-1 shadow-none hover:!bg-white/20 ${
          isDark ? "bg-transparent" : "!bg-[#9e9e9e]"
        }`}
      >
        {currentLang}
      </Button>
    </Dropdown>
  );
};

export default LanguageSelectorMain;
