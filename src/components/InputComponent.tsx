import { Input } from "antd";
import type { InputProps, PasswordProps } from "antd/es/input";
import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";
import type { ReactNode } from "react";

interface CommonInputProps extends Omit<InputProps, "type"> {
  type?: "text" | "password";
  isDark?: boolean;
  icon?: ReactNode;
  prefix?: ReactNode;
  height?: string | number;
  width?: string | number;
  allowClear?: boolean;
}

const normalizeSize = (value?: string | number): string | undefined => {
  if (typeof value === "number") return `${value}px`;
  if (typeof value === "string") {
    return /^\d+$/.test(value.trim()) ? `${value}px` : value;
  }
  return undefined;
};

const InputComponent = ({
  type = "text",
  isDark = false,
  allowClear = false,
  icon,
  prefix,
  className = "",
  style,
  height = "48px",
  width,
  ...rest
}: CommonInputProps) => {
  const baseStyle = isDark
    ? "text-white placeholder:text-[#9e9e9e] border-[#4b3b61] bg-[#1c1c1c]"
    : "text-black placeholder:text-gray-500 border-gray-300 bg-white";

  const focusStyle =
    "focus:border-[#985FF6] focus:shadow-[0_0_2px_2px_rgba(217,96,255,0.16)] focus:outline-none";

  const combinedClassName = `
    rounded-[8px]
    font-['Poppins']
    text-sm
    transition-all
    duration-200
    ${baseStyle}
    ${focusStyle}
    ${className}
  `;

  const sharedStyle: React.CSSProperties = {
    background: isDark ? "rgba(255,255,255,0.05)" : "white",
    border: "1px solid",
    width: normalizeSize(width),
    height: normalizeSize(height),
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
        allowClear
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
      allowClear={allowClear}
      prefix={effectivePrefix}
      className={combinedClassName}
      style={sharedStyle}
      {...rest}
    />
  );
};

export default InputComponent;
