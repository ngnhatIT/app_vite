import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { notification } from "antd";
import type { RootState, AppDispatch } from "../../../app/store";
import CustomOtpInput from "../../../components/otp";
import ButtonComponent from "../../../components/ButtonComponent";
import type { SignUpRequestDTO } from "../dto/SignUpDTO";
import { registerThunk, sendOtpThunk, verifyOtpThunk } from "../AuthThunk";
import type { VerifyOtpRequestDTO } from "../dto/VerifyOtpDTO";
import { showDialog } from "../../../components/DialogService";

const OTP_COUNTDOWN_SECONDS = 600;

const OtpForm = () => {
  const { t } = useTranslation();
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
    if (otp.length !== 6 || !user) {
      notification.warning({
        message: t("otp.invalidTitle"),
        description: t("otp.invalidDescription"),
      });
      return;
    }

    try {
      if (flowType === "register") {
        const verifyPayload: VerifyOtpRequestDTO = {
          email: user.email,
          otpCode: otp,
          flowType: "register",
        };

        const registerPayload: SignUpRequestDTO = {
          userName: user.userName,
          email: user.email,
          password: user.password,
        };

        const result = await dispatch(
          verifyOtpThunk({ payload: verifyPayload, t })
        ).unwrap();

        await dispatch(registerThunk({ payload: registerPayload, t })).unwrap();
        navigate("/auth/login");
      }

      if (flowType === "forgotPassword") {
        const verifyPayload: VerifyOtpRequestDTO = {
          email: user.email,
          otpCode: otp,
          flowType: "forgotPassword",
        };

        await dispatch(verifyOtpThunk({ payload: verifyPayload, t })).unwrap();

        navigate("/auth/reset-password", {
          state: { email: user.email, otp },
        });
      }
    } catch (error) {
      showDialog({ title: t("otp.failed"), content: error as string });
    }
  };

  const handleResendOtp = async () => {
    if (status === "loading" || countdown > 0 || !email) return;
    const payload = {
      userName: user?.userName ?? "",
      email: email,
      flowType: "register",
    };
    setCountdown(OTP_COUNTDOWN_SECONDS);
    await dispatch(sendOtpThunk({ payload, t })).unwrap();
  };

  return (
    <div className="card inline-flex flex-col justify-center items-start gap-2 px-[5.5rem] py-[4.25rem] w-[600px] rounded-[32px] border border-[#4b3b61] bg-[rgba(255,255,255,0.1)]">
      <div className="mt-6">
        <svg
          width={100}
          height={100}
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
      </div>

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

        <CustomOtpInput value={otp} onChange={setOtp} />

        <div className="flex justify-end w-full gap-4 pt-4">
          <ButtonComponent
            onClick={async () => {
              navigate("/auth/login");
            }}
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
