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
  height = "42px",
  width,
  ...rest
}: CommonInputProps) => {
  const borderColor = "rgba(152,95,246,1)";
  const shadowColor = "rgba(152,95,246,0.6)";

  const baseStyle = isDark
    ? "text-white placeholder:text-[#9e9e9e] border border-transparent bg-[#1c1c1c]"
    : "text-black placeholder:text-gray-500 border border-gray-300 bg-white";

  const focusStyle = "focus:outline-none";
  const hoverStyle = "hover:outline-none";

  const combinedClassName = `
    rounded-[8px]
    font-['Poppins']
    text-sm
    transition-all
    duration-200
    ${baseStyle}
    ${focusStyle}
    ${hoverStyle}
    ${className}
  `;

  const sharedStyle: React.CSSProperties = {
    background: isDark ? "rgba(255,255,255,0.05)" : "white",
    borderColor: isDark ? "rgba(255,255,255,0.1)" : "#d9d9d9",
    borderWidth: 1,
    borderStyle: "solid",
    width: normalizeSize(width),
    height: normalizeSize(height),
    transition: "all 0.2s ease-in-out",
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

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    e.currentTarget.style.borderColor = borderColor;
    e.currentTarget.style.boxShadow = `0 0 4px 1px ${shadowColor}`;
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    e.currentTarget.style.borderColor = isDark
      ? "rgba(255,255,255,0.1)"
      : "#d9d9d9";
    e.currentTarget.style.boxShadow = "none";
  };

  if (type === "password") {
    return (
      <Input.Password
        allowClear={allowClear}
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
        onFocus={handleFocus}
        onBlur={handleBlur}
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
      onFocus={handleFocus}
      onBlur={handleBlur}
      className={combinedClassName}
      style={sharedStyle}
      {...rest}
    />
  );
};

export default InputComponent;
