import { Dropdown } from "antd";
import { DownOutlined } from "@ant-design/icons";

const ThemeDropdown = () => {
  const items = [
    {
      key: "dark",
      label: (
        <div className="flex items-center gap-2 text-white px-2 py-1">
          <img src="/icons/darkmode.svg" className="w-4 h-4" />
          Dark Mode
        </div>
      ),
    },
    {
      key: "light",
      label: (
        <div className="flex items-center gap-2 text-white px-2 py-1">
          <img src="/icons/lightmode.svg" className="w-4 h-4" />
          Light Mode
        </div>
      ),
    },
  ];

  return (
    <Dropdown
      menu={{ items }}
      trigger={["click"]}
      overlayClassName="bg-[#1e1e2f] rounded-lg border border-purple-400"
    >
      <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 transition rounded-lg border border-purple-400 cursor-pointer">
        <img src="/icons/darkmode.svg" className="w-5 h-5" alt="Dark" />
        <span className="text-sm text-white">Dark Mode</span>
        <DownOutlined className="text-white text-xs" />
      </div>
    </Dropdown>
  );
};

export default ThemeDropdown;
