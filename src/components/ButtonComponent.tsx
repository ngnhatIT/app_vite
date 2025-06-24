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
  variant?: "primary" | "secondary";
  isDark?: boolean; // ✅ Thêm biến này
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
  variant = "primary",
  isDark = false,
}: ButtonComponentProps) => {
  const baseClass =
    "w-full font-['Poppins'] text-[.9375rem] font-medium leading-5 border-none";

  // ✅ Style tùy theo variant và theme
  const styleByVariant = {
    primary: {
      background: "var(--Foundation-indigo-indigo-500, #6610F2)",
      boxShadow: "0px 4px 12px 0px rgba(114, 57, 234, 0.35)",
      color: "#ffffff",
    },
    secondary: isDark
      ? {
          background: "rgba(255, 255, 255, 0.08)",
          boxShadow: "none",
          color: "#F8F9FA",
          border: "1px solid #495057",
        }
      : {
          background: "#F8F9FA",
          boxShadow: "none",
          color: "#343A40",
          border: "1px solid #DEE2E6",
        },
  };

  return (
    <Button
      icon={icon}
      htmlType={htmlType}
      size={size}
      loading={loading}
      onClick={onClick}
      disabled={disabled}
      className={`${baseClass} ${className}`}
      style={{
        borderRadius: "8px",
        height: "52px",
        ...styleByVariant[variant],
      }}
    >
      {children}
    </Button>
  );
};

export default ButtonComponent;
