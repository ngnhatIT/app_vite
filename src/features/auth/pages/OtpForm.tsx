import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import type { RootState, AppDispatch } from "../../../app/store";

import CustomOtpInput from "../../../components/OTPComponent";
import ButtonComponent from "../../../components/ButtonComponent";
import LabelComponent from "../../../components/LabelComponent";
import { registerThunk, sendOtpThunk, verifyOtpThunk } from "../authThunk";
import { message } from "antd";
import sms from "../../../assets/sms.svg";

const OtpForm = () => {
  const { t } = useTranslation();
  const isDark = useSelector((state: RootState) => state.theme.darkMode);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { state } = useLocation();

  const status = useSelector((s: RootState) => s.auth.status);
  const user = state?.user;
  const email: string = user?.email ?? "";
  const flowType: string = state?.flowType ?? "register";

  const initialCountdown = state?.otplimit ?? 60;
  const [countdown, setCountdown] = useState(initialCountdown);
  const [otpStartTime, setOtpStartTime] = useState(Date.now());
  const [otp, setOtp] = useState("");

  useEffect(() => {
    if (!email || !flowType) {
      navigate("/auth/login", { replace: true });
    }
  }, [email, flowType, navigate]);

  useEffect(() => {
    const interval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - otpStartTime) / 1000);
      const remaining = initialCountdown - elapsed;
      setCountdown(remaining > 0 ? remaining : 0);
    }, 1000);
    return () => clearInterval(interval);
  }, [otpStartTime, initialCountdown]);

  const handleSubmit = async () => {
    if (otp.length !== 6) {
      message.error(t("otp.invalidLength"));
      return;
    }
    try {
      const verifyPayload = {
        email: user!.email,
        otpCode: otp,
        flowType,
      };

      await dispatch(verifyOtpThunk({ payload: verifyPayload })).unwrap();

      if (flowType === "register") {
        const registerPayload = {
          userName: user!.userName,
          email: user!.email,
          password: user!.password,
          fullName: user!.fullName,
        };
        await dispatch(registerThunk({ payload: registerPayload })).unwrap();
        message.info(t("otp.registerSuccess"));
        navigate("/auth/login");
      }

      if (flowType === "forgot-password") {
        message.info(t("otp.verified"));
        navigate("/auth/reset-password", {
          state: { email: user!.email, otp },
        });
      }
    } catch (error: any) {
      message.error(
        t("otp.failed", { reason: error?.message ?? t("error.general") })
      );
    }
  };

  const handleResendOtp = async () => {
    try {
      const payload = {
        userName: user?.userName ?? "",
        email,
        flowType,
      };

      const { otplimit } = await dispatch(sendOtpThunk({ payload })).unwrap();

      setOtp("");
      setCountdown(otplimit);
      setOtpStartTime(Date.now());
      message.info(t("otp.resent"));
    } catch (error: any) {
      message.error(
        t("otp.resendFailed", { reason: error?.message ?? t("error.general") })
      );
    }
  };

  return (
    <div className="card inline-flex flex-col justify-center items-start gap-2">
      <img
        src={sms}
        alt="Logo"
        width={150}
        height={222}
        className="pb-[36px]"
      />

      <LabelComponent
        as="h1"
        label="otp.title"
        isDark={isDark}
        className="text-[48px] capitalize leading-[40px]"
      />

      <div className="flex flex-col items-start self-stretch gap-4">
        <div className="flex items-center gap-2 text-sm">
          <LabelComponent label="otp.expirePrefix" as="span" isDark={isDark} />
          <LabelComponent
            label={`00:${String(countdown).padStart(2, "0")}`}
            checkSpecial
            as="span"
            className="text-[#f44335] font-medium"
          />
          <LabelComponent label="otp.expireSuffix" as="span" isDark={isDark} />
        </div>

        <LabelComponent
          label={t("otp.description", { email })}
          checkSpecial
          as="p"
          className="text-[#9e9e9e] text-sm"
        />

        <LabelComponent
          label="otp.enterPrompt"
          isDark={isDark}
          as="p"
          className="text-white text-sm"
        />

        <CustomOtpInput value={otp} onChange={setOtp} isDark={isDark} />

        <div className="flex justify-end w-full gap-4 pt-4">
          <ButtonComponent
            onClick={() => navigate("/auth/login")}
            className="flex-1 h-12 bg-[#292929] border border-[#4b3b61] hover:opacity-80"
          >
            {t("otp.cancel")}
          </ButtonComponent>
          <ButtonComponent
            htmlType="submit"
            onClick={handleSubmit}
            disabled={otp.length !== 6 || status === "loading"}
            loading={status === "loading"}
            className="flex-1"
          >
            {t("otp.submit")}
          </ButtonComponent>
        </div>

        <div className="flex justify-center items-center gap-2 pt-4">
          <LabelComponent
            label="otp.notReceived"
            checkSpecial
            as="span"
            className="text-[#9e9e9e] text-sm"
          />
          <ButtonComponent
            onClick={handleResendOtp}
            disabled={countdown > 0}
            tooltip={
              countdown > 0
                ? t("otp.cooldownMessage", { seconds: countdown })
                : ""
            }
            className="text-[#e476ad] text-sm cursor-pointer hover:underline border-none bg-transparent p-0 h-auto"
          >
            {t("otp.resend")}
          </ButtonComponent>
        </div>
      </div>
    </div>
  );
};

export default OtpForm;
