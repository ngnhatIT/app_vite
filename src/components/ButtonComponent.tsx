import { Button } from "antd";
import type { ReactNode } from "react";

interface ButtonComponentProps {
  children?: ReactNode;
  htmlType?: "button" | "submit" | "reset";
  loading?: boolean;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
  size?: "small" | "middle" | "large";
  icon?: ReactNode;
}

const ButtonComponent = ({
  children,
  htmlType = "button",
  loading = false,
  onClick,
  className = "",
  disabled = false,
  size = "large",
  icon,
}: ButtonComponentProps) => {
  return (
    <Button
      icon={icon}
      htmlType={htmlType}
      size={size}
      loading={loading}
      onClick={onClick}
      disabled={disabled}
      className={`w-full text-white font-['Poppins'] text-[.9375rem] font-medium leading-5 border-none ${className}`}
      style={{
        borderRadius: "8px",
        background: "var(--Foundation-indigo-indigo-500, #6610F2)",
        boxShadow: "0px 4px 12px 0px rgba(114, 57, 234, 0.35)",
        height: "48px",
      }}
    >
      {children}
    </Button>
  );
};

export default ButtonComponent;
