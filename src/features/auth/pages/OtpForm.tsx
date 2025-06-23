import React, { useEffect, useState } from "react";
import { Button, Form, notification } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import OtpInput from "react-otp-input";

import { resend, sendOtp, setAuthStatus, verifyOtpThunk } from "../AuthSlice";
import type { RootState, AppDispatch } from "../../../app/store";
import type { UserRegisterDTO } from "../dto/VerifyOtpRequestDTO";

import "../../../css/common.css";
import CustomOtpInput from "../../../components/otp";

const OTP_COUNTDOWN_SECONDS = 600;

const OtpForm = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { state } = useLocation();
  const status = useSelector((s: RootState) => s.auth.status);

  const [countdown, setCountdown] = useState(OTP_COUNTDOWN_SECONDS);
  const [otp, setOtp] = useState("");

  const user: UserRegisterDTO | undefined = state?.user;
  const email: string = user?.email ?? "";
  const flowType = state?.flowType ?? "register";
  const otpCountdownStart = state?.otpCountdownStart ?? Date.now();

  useEffect(() => {
    if (!email || !flowType) {
      navigate("/auth/login", { replace: true });
    }
  }, [email, flowType, navigate]);

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     const elapsed = Math.floor((Date.now() - otpCountdownStart) / 1000);
  //     const remaining = OTP_COUNTDOWN_SECONDS - elapsed;
  //     setCountdown(remaining > 0 ? remaining : 0);
  //   }, 1000);

  //   return () => clearInterval(interval);
  // }, [otpCountdownStart]);

  const handleSubmit = () => {
    console.log("Submitting OTP:", otp, "for user:", user);
    if ( otp.length !== 6 || !user){
      notification.warning({
    message: "OTP không hợp lệ",
    description: "Vui lòng nhập đủ 6 chữ số OTP.",
  });
  return;
    }
    user.otpCode = otp;
    console.log("Submitting OTP:", otp, "for user:", user);
    dispatch(
      
      verifyOtpThunk({ user, otp }, t, flowType, () => {
        if (flowType === "register") {
          navigate("/", { replace: true });
        } else {
          navigate("/auth/reset-password", {
            replace: true,
            state: { email, otp },
          });
        }
      })
    );
  };

  const handleResendOtp = () => {
    if (status === "loading" || countdown > 0 || !email) return;

    try {
      const otpTokenId = user?.otpCode ?? otp;
      dispatch(resend(t, email, otpTokenId));
      notification.success({
        message: t("otp.resendSuccessTitle"),
        description: t("otp.resendSuccess"),
      });
      setCountdown(OTP_COUNTDOWN_SECONDS);
    } catch {
      dispatch(setAuthStatus("failed"));
      notification.error({
        message: t("otp.resendFailedTitle"),
        description: t("otp.resendFailed"),
      });
    }
  };

  return (
    <div className="card inline-flex flex-col justify-center items-start gap-11 pt-[4.25rem] pb-[4.25rem] px-[5.5rem] w-[600px] rounded-[32px] border border-[#a7a8a4] bg-[#bfbfbf]/[.6]">
      <svg
        width={200}
        height={200}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g opacity="0.4">
          <path
            opacity="0.3"
            d="M75.7106 9.70834H24.2897C13.7515 9.70834 5.2085 18.7538 5.2085 29.912V70.1297C5.2085 81.2878 13.7515 90.3333 24.2897 90.3333H75.7106C86.2489 90.3333 94.7918 81.2878 94.7918 70.1297V29.912C94.7918 18.7538 86.2489 9.70834 75.7106 9.70834Z"
            fill="#9e9e9e"
          />
          <path
            d="M50.0007 52.2603C46.4345 52.2464 42.9834 50.9958 40.2362 48.7218L25.007 36.1353C24.3239 35.5413 23.9048 34.7004 23.8418 33.7973C23.7788 32.8943 24.0771 32.0033 24.6711 31.3202C25.265 30.6371 26.106 30.218 27.009 30.155C27.912 30.092 28.8031 30.3903 29.4862 30.9843L44.6257 43.5707C46.168 44.869 48.1192 45.5808 50.1351 45.5808C52.151 45.5808 54.1022 44.869 55.6445 43.5707L70.3809 31.0739C71.0361 30.5601 71.8606 30.3118 72.6905 30.3782C73.5204 30.4446 74.295 30.8208 74.8601 31.4322C75.4329 32.1134 75.7161 32.9918 75.6491 33.8792C75.5822 34.7667 75.1703 35.5926 74.5018 36.1801L59.7653 48.677C57.0338 50.9837 53.576 52.2527 50.0007 52.2603Z"
            fill="#9e9e9e"
          />
        </g>
      </svg>

      <h1 className="text-[#f8f9fa] font-['Poppins'] text-5xl font-medium capitalize">
        {t("otp.titleRegister")}
      </h1>

      <div className="flex flex-col items-start self-stretch gap-4">
        <div className="flex items-center gap-2 text-sm text-[#9e9e9e]">
          <span>{t("otp.expirePrefix")}</span>
          <span className="text-[#f44335] font-medium">
            00:{String(countdown).padStart(2, "0")}
          </span>
          <span>{t("otp.expireSuffix")}</span>
        </div>

        <div className="text-[#9e9e9e] text-sm">
          {t("otp.description", { email })}
        </div>

        <div className="text-white text-sm">{t("otp.enterPrompt")}</div>

        {/* OTP Input */}
        <CustomOtpInput value={otp} onChange={setOtp} />

        {/* Buttons */}
        <div className="flex justify-end w-full gap-4 pt-4">
          <Button
            size="large"
            onClick={() => {
              dispatch(setAuthStatus("idle"));
              navigate("/auth/login");
            }}
            className="flex-1 h-12 text-white font-['Poppins'] text-sm rounded-lg bg-[#292929] border-none hover:opacity-80"
            style={{
              background: "rgba(255,255,255,0.1)",
              border: "1px solid #4b3b61",
            }}
          >
            {t("otp.cancel")}
          </Button>
          <Button
            size="large"
            type="primary"
            className="flex-1 text-white font-['Poppins'] text-sm font-medium leading-5 border-none"
            style={{
              borderRadius: "8px",
              background: "var(--Foundation-indigo-indigo-500, #6610F2)",
              boxShadow: "0px 4px 12px 0px rgba(114, 57, 234, 0.35)",
            }}
            onClick={handleSubmit}
            //disabled={otp.length !== 6 || status === "loading"}
            //loading={status === "loading"}
          >
            {t("otp.submit")}
          </Button>
        </div>

        {/* Resend */}
        <div className="flex justify-center items-center gap-2 pt-4">
          <span className="text-[#9e9e9e] text-sm">{t("otp.notReceived")}</span>
          <span
            onClick={handleResendOtp}
            className="text-[#e476ad] text-sm cursor-pointer hover:underline"
          >
            {t("otp.resend")}
          </span>
        </div>
      </div>
    </div>
  );
};

export default OtpForm;
