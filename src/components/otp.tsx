import React from "react";
import OtpInput, { type InputProps } from "react-otp-input";

type CustomOtpInputProps = {
  value: string;
  onChange: (val: string) => void;
  numInputs?: number;
  autoFocus?: boolean;
};

const CustomOtpInput: React.FC<CustomOtpInputProps> = ({
  value,
  onChange,
  numInputs = 6,
  autoFocus = true,
}) => {
  return (
    <OtpInput
      value={value}
      onChange={(val) => onChange(val.toUpperCase())}
      numInputs={numInputs}
      shouldAutoFocus={autoFocus}
      containerStyle={{ display: "flex", gap: "1rem", width: "100%" }}
      inputStyle={{
        flex: 1, // chia đều theo container
        aspectRatio: "1", // luôn giữ hình vuông
        fontSize: "24px",
        fontWeight: "bold",
        color: "white",
        backgroundColor: "rgba(255,255,255,0.1)",
        border: "1px solid #4b3b61",
        borderRadius: "8px",
        textAlign: "center",
        minWidth: "48px", // ngăn quá bé trên màn nhỏ
        maxWidth: "80px", // không quá to
      }}
      renderInput={(inputProps: InputProps, index: number) => (
        <input {...inputProps} key={index} />
      )}
    />
  );
};

export default CustomOtpInput;
