import React, { useState } from "react";
import OtpInput, { type InputProps } from "react-otp-input";

type CustomOtpInputProps = {
  value: string;
  onChange: (val: string) => void;
  numInputs?: number;
  autoFocus?: boolean;
  isDark: boolean;
};

const CustomOtpInput: React.FC<CustomOtpInputProps> = ({
  value,
  onChange,
  numInputs = 6,
  autoFocus = true,
  isDark,
}) => {
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);

  const baseStyle = {
    flex: 1,
    aspectRatio: "1",
    fontSize: "24px",
    fontWeight: "bold",
    color: isDark ? "#fff" : "#1a1a1a",
    backgroundColor: isDark ? "rgba(255,255,255,0.08)" : "#f1f3f5",
    border: isDark ? "1px solid #4b3b61" : "1px solid #dee2e6",
    borderRadius: "8px",
    textAlign: "center" as const,
    minWidth: "48px",
    maxWidth: "80px",
    outline: "none",
    transition: "all 0.3s",
  };

  const focusStyle = {
    borderColor: "#e476ad",
    boxShadow: "0 0 0 2px rgba(228, 118, 173, 0.3)",
  };

  return (
    <OtpInput
      value={value}
      onChange={(val) => onChange(val.toUpperCase())}
      numInputs={numInputs}
      shouldAutoFocus={autoFocus}
      containerStyle={{
        display: "flex",
        gap: "1rem",
        width: "100%",
      }}
      renderInput={(inputProps: InputProps, index: number) => (
        <input
          {...inputProps}
          key={index}
          onFocus={(e) => {
            setFocusedIndex(index);
            inputProps.onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocusedIndex(null);
            inputProps.onBlur?.(e);
          }}
          style={{
            ...baseStyle,
            ...(focusedIndex === index ? focusStyle : {}),
          }}
        />
      )}
    />
  );
};

export default CustomOtpInput;
