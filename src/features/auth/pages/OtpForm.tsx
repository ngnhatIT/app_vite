import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import type { RootState, AppDispatch } from "../../../app/store";
import CustomOtpInput from "../../../components/OTPComponent";
import ButtonComponent from "../../../components/ButtonComponent";
import LabelComponent from "../../../components/LabelComponent";
import type { SignUpRequestDTO } from "../dto/SignUpDTO";
import { registerThunk, sendOtpThunk, verifyOtpThunk } from "../authThunk";
import type { VerifyOtpRequestDTO } from "../dto/VerifyOtpDTO";
import { showDialog } from "../../../components/DialogService";
import sms from "../../../assets/sms.svg";

const OTP_COUNTDOWN_SECONDS = 60;

const OtpForm = () => {
  const { t } = useTranslation();
  const isDark = useSelector((state: RootState) => state.theme.darkMode);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { state } = useLocation();
  const status = useSelector((s: RootState) => s.auth.status);

  const [countdown, setCountdown] = useState(OTP_COUNTDOWN_SECONDS);
  const [otp, setOtp] = useState("");

  const user: SignUpRequestDTO | undefined = state?.user;
  const email: string = user?.email ?? "";
  const flowType = state?.flowType ?? "register";
  const otpCountdownStart = state?.otpCountdownStart ?? Date.now();

  useEffect(() => {
    if (!email || !flowType) {
      navigate("/auth/login", { replace: true });
    }
  }, [email, flowType, navigate]);

  useEffect(() => {
    const interval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - otpCountdownStart) / 1000);
      const remaining = OTP_COUNTDOWN_SECONDS - elapsed;
      setCountdown(remaining > 0 ? remaining : 0);
    }, 1000);
    return () => clearInterval(interval);
  }, [otpCountdownStart]);

  const handleSubmit = async () => {
    if (otp.length !== 6) {
      return;
    }
    try {
      if (flowType === "register") {
        const verifyPayload: VerifyOtpRequestDTO = {
          email: user!.email,
          otpCode: otp,
          flowType: "register",
        };

        const registerPayload: SignUpRequestDTO = {
          userName: user!.userName,
          email: user!.email,
          password: user!.password,
        };

        await dispatch(verifyOtpThunk({ payload: verifyPayload })).unwrap();
        await dispatch(registerThunk({ payload: registerPayload })).unwrap();
        navigate("/auth/login");
      }

      if (flowType === "forgot-password") {
        const verifyPayload: VerifyOtpRequestDTO = {
          email: user!.email,
          otpCode: otp,
          flowType: "forgot-password",
        };

        await dispatch(verifyOtpThunk({ payload: verifyPayload })).unwrap();

        navigate("/auth/reset-password", {
          state: { email: user!.email, otp },
        });
      }
    } catch (error: any) {
      showDialog({
        title: t("common.error"),
        content: error ?? t("error.general"),
        isDark,
      });
    }
  };

  const handleResendOtp = async () => {
    showDialog({
      title: t("common.error"),
      content: t("otp.alreadySent"),
      isDark,
    });

    const payload = {
      userName: user?.userName ?? "",
      email,
      flowType: "register",
    };
    setCountdown(OTP_COUNTDOWN_SECONDS);
    await dispatch(sendOtpThunk({ payload })).unwrap();
  };

  return (
    <div className="card inline-flex flex-col justify-center items-start gap-2">
      <img
        src={sms}
        alt="Logo"
        width={206}
        height={222}
        className="pb-[36px]"
      />

      <LabelComponent
        as="h1"
        label="otp.title"
        isDark={isDark}
        className="capitalize"
      />

      <div className="flex flex-col items-start self-stretch gap-4">
        <div className="flex items-center gap-2 text-sm text-[#9e9e9e]">
          <LabelComponent label={"otp.expirePrefix"} as="span" />
          <LabelComponent label={"otp.expirePrefix"} as="span" />
          <LabelComponent
            label={`00:${String(countdown).padStart(2, "0")}`}
            checkSpecial
            as="span"
            className="text-[#f44335] font-medium"
          />
          <LabelComponent label={"otp.expireSuffix"} as="span" />
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
          <LabelComponent
            label="otp.resend"
            checkSpecial
            className="text-[#e476ad] text-sm cursor-pointer hover:underline"
            onClick={handleResendOtp}
          />
        </div>
      </div>
    </div>
  );
};

export default OtpForm;
