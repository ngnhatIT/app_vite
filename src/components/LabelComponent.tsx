import { useTranslation } from "react-i18next";
import type { HTMLAttributes, ElementType, MouseEvent } from "react";

interface LabelComponentProps<T extends HTMLElement = HTMLDivElement>
  extends HTMLAttributes<T> {
  label: string;           // i18n key
  required?: boolean;
  isDark?: boolean;
  checkSpecial?: boolean;
  as?: ElementType;
  className?: string;
  disabled?: boolean;      // 👉 thêm disabled
}

const LabelComponent = <T extends HTMLElement = HTMLDivElement>({
  label,
  required = false,
  isDark = false,
  checkSpecial = false,
  disabled = false,
  as: Tag = "span",
  className = "",
  onClick,
  ...rest
}: LabelComponentProps<T>) => {
  const { t } = useTranslation();

  const baseColor = checkSpecial
    ? ""
    : isDark
    ? "text-white"
    : "text-[#2c2c2c]";

  const disabledClass = disabled ? "opacity-50 cursor-not-allowed" : "";

  const handleClick = (e: MouseEvent<T>) => {
    if (disabled) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }
    onClick?.(e);
  };

  return (
    <Tag
      className={`font-['Poppins'] text-[14px] leading-[1.125rem] ${baseColor} ${disabledClass} ${className}`}
      onClick={handleClick}
      {...rest}
    >
      {t(label)}
      {required && <span className="text-red-500 ml-[2px]">*</span>}
    </Tag>
  );
};

export default LabelComponent;
