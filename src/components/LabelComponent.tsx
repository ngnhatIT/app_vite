import { useTranslation } from "react-i18next";

interface FormLabelProps {
  label: string; // key trong i18n
  required?: boolean; // có hiển thị dấu * không
  isDark?: boolean; // dark mode
  className?: string; // bổ sung CSS nếu cần
}

const FormLabel = ({
  label,
  required = false,
  isDark = false,
  className = "",
}: FormLabelProps) => {
  const { t } = useTranslation();

  return (
    <span
      className={`${
        isDark ? "text-white" : "text-[#2c2c2c]"
      } font-['Poppins'] text-sm leading-[1.125rem] ${className}`}
    >
      {t(label)}
      {required && <span className="text-red-500 ml-[2px]">*</span>}
    </span>
  );
};

export default FormLabel;
