import React, { useEffect, useState } from "react";
import { Button, Form, notification } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import OtpInput from "react-otp-input";

import { sendOtp, setAuthStatus, verifyOtpThunk } from "../AuthSlice";
import type { RootState, AppDispatch } from "../../../app/store";
import type { UserRegisterDTO } from "../dto/VerifyOtpRequestDTO";


import "../../../css/common.css";
import CustomOtpInput from "../../../components/otp";

const OTP_COUNTDOWN_SECONDS = 60;

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
    const interval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - otpCountdownStart) / 1000);
      const remaining = OTP_COUNTDOWN_SECONDS - elapsed;
      setCountdown(remaining > 0 ? remaining : 0);
    }, 1000);

    return () => clearInterval(interval);
  }, [otpCountdownStart]);

  const handleSubmit = () => {
    if (status === "loading" || otp.length !== 6 || !user) return;

    dispatch(
      verifyOtpThunk(
        { user, otp },
        t,
        flowType,
        () => {
          if (flowType === "register") {
            navigate("/", { replace: true });
          } else {
            navigate("/auth/reset-password", {
              replace: true,
              state: { email, otp },
            });
          }
        }
      )
    );
  };

  const handleResendOtp = () => {
    if (status === "loading" || countdown > 0 || !email) return;

    try {
      dispatch(setAuthStatus("loading"));
      dispatch(sendOtp(t, email));
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
      <svg width={100} height={100} viewBox="0 0 100 100" fill="none">
        <g opacity="0.4">
          <path
            opacity="0.3"
            d="M75.7101 9.70834H24.2893C13.751 9.70834 5.20801 18.7538 5.20801 29.912V70.1297C5.20801 81.2878 13.751 90.3333 24.2893 90.3333H75.7101C86.2484 90.3333 94.7913 81.2878 94.7913 70.1297V29.912C94.7913 18.7538 86.2484 9.70834 75.7101 9.70834Z"
            fill="#EFE6FD"
          />
          <path
            d="M50.0012 52.2603C46.4349 52.2464 42.9839 50.9958 40.2366 48.7218L25.0075 36.1353C24.3244 35.5413 23.9053 34.7004 23.8423 33.7973C23.7793 32.8943 24.0776 32.0033 24.6715 31.3202C25.2655 30.6371 26.1065 30.218 27.0095 30.155C27.9125 30.092 28.8036 30.3903 29.4866 30.9843L44.6262 43.5707C46.1685 44.869 48.1197 45.5808 50.1356 45.5808C52.1515 45.5808 54.1027 44.869 55.645 43.5707L70.3814 31.0739C71.0366 30.5601 71.8611 30.3118 72.691 30.3782C73.5209 30.4446 74.2954 30.8208 74.8606 31.4322C75.4334 32.1134 75.7166 32.9918 75.6496 33.8792C75.5826 34.7667 75.1708 35.5926 74.5023 36.1801L59.7658 48.677C57.0343 50.9837 53.5764 52.2527 50.0012 52.2603Z"
            fill="#EFE6FD"
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
            onClick={() => navigate("/auth/login")}
            className="flex-1 h-12 text-white font-['Poppins'] text-sm rounded-lg bg-[#292929] border-none hover:opacity-80"
            style={{ background: "rgba(255,255,255,0.1)", border: "1px solid #4b3b61" }}
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
            disabled={otp.length !== 6 || status === "loading"}
            loading={status === "loading"}
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
