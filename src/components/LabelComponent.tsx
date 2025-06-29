import { useTranslation } from "react-i18next";
import type { HTMLAttributes, ElementType } from "react";

interface LabelComponentProps<T extends HTMLElement = HTMLDivElement>
  extends HTMLAttributes<T> {
  label: string; // i18n key
  required?: boolean;
  isDark?: boolean;
  checkSpecial?: boolean;
  as?: ElementType;
  className?: string;
}

const LabelComponent = <T extends HTMLElement = HTMLDivElement>({
  label,
  required = false,
  isDark = false,
  checkSpecial = false,
  as: Tag = "span",
  className = "",
  ...rest
}: LabelComponentProps<T>) => {
  const { t } = useTranslation();

  const baseColor = checkSpecial
    ? ""
    : isDark
    ? "text-white"
    : "text-[#2c2c2c]";

  return (
    <Tag
      className={`font-['Poppins'] text-[14px] leading-[1.125rem] ${baseColor} ${className}`}
      {...rest}
    >
      {t(label)}
      {required && <span className="text-red-500 ml-[2px]">*</span>}
    </Tag>
  );
};

export default LabelComponent;
