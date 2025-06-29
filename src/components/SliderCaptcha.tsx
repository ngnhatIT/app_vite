import { useState } from "react";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import {
  CheckCircleFilled,
  LockFilled,
  ReloadOutlined,
} from "@ant-design/icons";
import { useTranslation } from "react-i18next";

type Props = {
  onSuccess: (status: boolean) => void;
  isDark?: boolean;
};

const SliderCaptcha = ({ onSuccess, isDark = false }: Props) => {
  const { t } = useTranslation();
  const [value, setValue] = useState(0);
  const [verified, setVerified] = useState(false);
  const [showFlash, setShowFlash] = useState(false);

  const handleSliderChange = (val: number | number[]) => {
    const numVal = Array.isArray(val) ? val[0] : val;
    setValue(numVal);
    if (numVal >= 98 && !verified) {
      setVerified(true);
      setShowFlash(true);
      onSuccess(true);
      setTimeout(() => setShowFlash(false), 800);
    }
  };

  const reset = () => {
    setValue(0);
    setVerified(false);
    onSuccess(false);
  };

  return (
    <div className="w-full select-none relative">
      {showFlash && (
        <div className="absolute inset-0 z-10 bg-white/20 rounded-full animate-ping pointer-events-none" />
      )}

      <label
        className={`text-sm font-semibold mb-2 block ${
          isDark ? "text-neutral-200" : "text-gray-800"
        }`}
      >
        {t("captcha.label")}
      </label>

      <div className="relative mb-8">
        <Slider
          min={0}
          max={100}
          value={value}
          onChange={(val) => {
            if (!verified) handleSliderChange(val);
          }}
          disabled={false}
          trackStyle={{
            background: verified
              ? "#4b0082"
              : "linear-gradient(90deg, rgba(255,255,255,0); , rgba(168,85,247,0.4), #ab47ff)",
            height: 50,
            borderRadius: 9999,
          }}
          handleStyle={{
            height: 50,
            width: 50,
            marginTop: -1,
            backgroundColor: verified ? "#4b0082" : "#9333ea",
            border: "3px solid white",
            boxShadow: verified
              ? "0 0 8px rgba(75, 0, 130, 0.5)"
              : "0 0 10px rgba(168,85,247,0.4)",
            transition: "all 0.3s ease",
            animation: verified ? "none" : "pulseHandle 1.2s infinite",
          }}
          railStyle={{
            height: 50,
            background: isDark ? "#2a2a2a" : "#e5e7eb",
            borderRadius: 9999,
          }}
        />

        {/* Text inside the slider track */}
        <div
          className={`absolute top-0 left-0 w-full h-[50px] flex items-center justify-center pointer-events-none`}
        >
          <span
            className={`flex items-center gap-2  font-poppins drop-shadow-md ${
              verified
                ? "text-white"
                : isDark
                ? "text-white/80"
                : "text-gray-800"
            }`}
          >
            {verified ? (
              <>
                <CheckCircleFilled className="text-white font-poppins" />{" "}
                {t("captcha.verified")}
              </>
            ) : (
              <>
                <LockFilled className="text-sm font-poppins" />{" "}
                {t("captcha.slideToVerify")}
              </>
            )}
          </span>
        </div>

        {verified && (
          <div
            className="absolute right-1 top-1/2 -translate-y-1/2 text-white/70 hover:text-red-500 transition cursor-pointer z-30"
            onClick={reset}
            title={t("captcha.reset")}
          >
            <ReloadOutlined className="text-xl" />
          </div>
        )}
      </div>

      <style>
        {`
          @keyframes pulseHandle {
            0% { box-shadow: 0 0 0 rgba(255,255,255,0); }
            50% { box-shadow: 0 0 12px rgba(168,85,247,0.7); }
            100% { box-shadow: 0 0 0 rgba(255,255,255,0); }
          }
        `}
      </style>
    </div>
  );
};

export default SliderCaptcha;
