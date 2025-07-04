import { Button, Tooltip } from "antd";
import { useTranslation } from "react-i18next";
import type { ReactNode, CSSProperties } from "react";

interface ButtonComponentProps {
  children?: ReactNode;
  label?: string; // 👈 i18n key
  htmlType?: "button" | "submit" | "reset";
  loading?: boolean;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
  size?: "small" | "middle" | "large";
  icon?: ReactNode;
  variant?: "primary" | "secondary";
  isDark?: boolean;
  height?: number | string;
  tooltip?: string;
}

const ButtonComponent = ({
  children,
  label,
  htmlType = "button",
  loading = false,
  onClick,
  className = "",
  disabled = false,
  size = "large",
  icon,
  variant = "primary",
  isDark = false,
  height = "46px",
  tooltip,
}: ButtonComponentProps) => {
  const { t } = useTranslation();

  const baseClass =
    "w-full font-['Poppins'] text-[.9375rem] font-medium leading-5 border-none";

  const styleByVariant: Record<string, CSSProperties> = {
    primary: {
      background: "#6610F2",
      boxShadow: "0px 4px 12px rgba(114, 57, 234, 0.35)",
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

  const disabledStyle: CSSProperties = {
    opacity: 0.6,
    cursor: "not-allowed",
    background: isDark ? "#444" : "#e9ecef",
    color: isDark ? "#ccc" : "#6c757d",
    border: isDark ? "1px solid #555" : "1px solid #dee2e6",
  };

  const finalStyle: CSSProperties = {
    borderRadius: "8px",
    height,
    ...(disabled ? disabledStyle : styleByVariant[variant]),
  };

  const content =
    children ??
    (label ? t(label) : null); // 👈 Ưu tiên children > label (đã dịch) > null

  const buttonElement = (
    <Button
      icon={icon}
      htmlType={htmlType}
      size={size}
      loading={loading}
      onClick={onClick}
      disabled={disabled}
      className={`${baseClass} ${className}`}
      style={finalStyle}
    >
      {content}
    </Button>
  );

  return disabled && tooltip ? (
    <Tooltip title={tooltip} placement="top">
      <span className="w-full inline-block">{buttonElement}</span>
    </Tooltip>
  ) : (
    buttonElement
  );
};

export default ButtonComponent;
