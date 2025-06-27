import { useTranslation } from "react-i18next";
import { Dropdown, Menu, Button } from "antd";
import { GlobalOutlined } from "@ant-design/icons";
import "../css/language_selector.css";

const LanguageSelector = () => {
  const { i18n } = useTranslation();

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
    <div className="fixed top-4 left-4 z-50">
      <Dropdown overlay={menu} placement="bottomLeft" arrow>
        <Button
          icon={<GlobalOutlined />}
          className="!bg-white/10 !text-white !border-white/30 backdrop-blur-md rounded-full px-4 py-1 shadow-none hover:!bg-white/20"
        >
          {currentLang}
        </Button>
      </Dropdown>
    </div>
  );
};

export default LanguageSelector;
