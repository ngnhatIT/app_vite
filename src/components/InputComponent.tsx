import { Input } from "antd";
import type { InputProps, PasswordProps } from "antd/es/input";
import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";
import type { ReactNode } from "react";

interface CommonInputProps extends Omit<InputProps, "type"> {
  type?: "text" | "password";
  isDark?: boolean;
  icon?: ReactNode;
  prefix?: ReactNode;
  height?: string | number; // ✅ thêm vào đây
}

const InputComponent = ({
  type = "text",
  isDark = false,
  icon,
  prefix,
  className = "",
  style,
  height,
  width,
  ...rest
}: CommonInputProps) => {
  const baseStyle = isDark
    ? "text-white placeholder:text-[#9e9e9e] border-[#4b3b61] bg-[#1c1c1c]"
    : "text-black placeholder:text-gray-500 border-gray-300 bg-white";

  const combinedClassName = `rounded-md font-['Poppins'] text-sm ${baseStyle} ${className}`;

  const sharedStyle: React.CSSProperties = {
    background: isDark ? "rgba(255,255,255,0.05)" : "white",
    border: "1px solid",
    height,
    width,
    ...style,
  };

  const effectivePrefix =
    prefix ??
    (icon ? (
      <span
        className={`${isDark ? "text-gray-400" : "text-gray-500"} mr-1 text-sm`}
      >
        {icon}
      </span>
    ) : null);

  if (type === "password") {
    return (
      <Input.Password
        prefix={effectivePrefix}
        iconRender={(visible) =>
          visible ? (
            <EyeTwoTone twoToneColor={isDark ? "#fff" : "#000"} />
          ) : (
            <EyeInvisibleOutlined
              className={isDark ? "text-white" : "text-black"}
            />
          )
        }
        className={combinedClassName}
        style={sharedStyle}
        {...(rest as PasswordProps)}
      />
    );
  }

  return (
    <Input
      prefix={effectivePrefix}
      className={combinedClassName}
      style={sharedStyle}
      {...rest}
    />
  );
};

export default InputComponent;
