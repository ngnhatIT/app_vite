import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import ButtonComponent from "../../../components/ButtonComponent";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../../app/store";
import { sendOtpThunk } from "../authThunk";
import { showDialog } from "../../../components/DialogService";
import sms from "../../../assets/sms.svg";
import LabelComponent from "../../../components/LabelComponent";

const CheckMail = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { t } = useTranslation();
  const user = state?.user;
  const email = user?.email;
  const flowType = state?.flowType;
  const isDark = useSelector((state: RootState) => state.theme.darkMode);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if (!email || !flowType) {
      navigate("/auth/login", { replace: true });
      return;
    }
    if (flowType === "register" && !user?.userName) {
      navigate("/auth/register", { replace: true });
    }
    if (flowType === "forgot-password" && !user?.email) {
      navigate("/auth/forgot-password", { replace: true });
    }
  }, [email, flowType, navigate, user]);

  const handleResendOtp = async () => {
    const payload = {
      email: email,
      flowType: flowType,
    };
    try {
      await dispatch(sendOtpThunk({ payload })).unwrap();
    } catch (err: any) {
      showDialog({
        title: t("common.error"),
        content: err.message ?? t("error.general"),
        isDark: isDark,
      });
    }
  };

  return (
    <div className="card-2 inline-flex flex-col justify-center items-start gap-2">
      {/* ICON */}
      <img
        src={sms}
        alt="Logo"
        width={150}
        height={222}
        className="pb-[36px]"
      />

      {/* TITLE */}
      <div className="flex flex-col justify-center items-start self-stretch mb-[36px]">
        <LabelComponent
          as="h2"
          label="checkMail.title"
          isDark={isDark}
          className="text-[48px] capitalize leading-[40px]"
        />
        <div className="flex justify-start items-center gap-2 ">
          <LabelComponent
            label="checkMail.subTitle"
            checkSpecial
            as="span"
            className="text-[#9e9e9e] text-sm"
          />
        </div>
      </div>

      {/* ACTION */}
      <ButtonComponent
        htmlType="submit"
        onClick={() =>
          navigate("/auth/verify-otp", {
            state: {
              ...state,
            },
          })
        }
        className="px-10 w-full"
      >
        {t("checkMail.skipNow")}
      </ButtonComponent>

      <div className="flex justify-center items-center gap-2">
        <div className="flex justify-center items-center gap-2 pt-4">
          <LabelComponent
            label="checkMail.resendTitle"
            className="text-[#9e9e9e]"
            checkSpecial={true}
          />
          <LabelComponent
            label="checkMail.resendLink"
            className="text-[#e476ad] text-sm cursor-pointer hover:underline"
            checkSpecial={true}
            onSubmit={handleResendOtp}
          />
        </div>
      </div>
    </div>
  );
};

export default CheckMail;
