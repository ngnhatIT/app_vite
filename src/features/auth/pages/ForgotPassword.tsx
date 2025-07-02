import { useState } from "react";
import { Form } from "antd";
import { MailOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import type { RootState, AppDispatch } from "../../../app/store";

import LabelComponent from "../../../components/LabelComponent";
import InputComponent from "../../../components/InputComponent";
import ButtonComponent from "../../../components/ButtonComponent";
import SliderCaptcha from "../../../components/SliderCaptcha";
import { sendOtpThunk } from "../authThunk";
import { showDialog } from "../../../components/DialogService";

const ForgotPassword = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const isDark = useSelector((state: RootState) => state.theme.darkMode);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [captchaVerified, setCaptchaVerified] = useState(false);

  const handleSubmit = async (values: { email: string }) => {
    setIsSubmitting(true);
    try {
      await dispatch(
        sendOtpThunk({
          payload: { email: values.email, flowType: "forgot-password" },
          onSuccess: () => {},
        })
      ).unwrap();

      navigate("/auth/check-mail", {
        state: {
          user: { email: values.email },
          otpCountdownStart: Date.now(),
          flowType: "forgot-password",
        },
      });
    } catch (err: any) {
      showDialog({
        title: t("common.error"),
        content: err.message ?? t("error.general"),
        isDark: isDark,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="card-2 inline-flex flex-col justify-center items-center gap-2">
      {/* Title */}
      <div className="flex flex-col justify-center items-start self-stretch">
        <LabelComponent
          as="h2"
          label="forgot.title"
          isDark={isDark}
          className="text-[48px] capitalize leading-[40px]"
        />
        <div className="flex justify-start items-center gap-2 ">
          <LabelComponent
            label="forgot.subTitle"
            checkSpecial
            as="span"
            className="text-[#9e9e9e] text-sm"
          />
        </div>
      </div>

      <div className="flex flex-col items-start w-full gap-6 mt-[36px]">
        <Form
          layout="vertical"
          className="w-full"
          form={form}
          onFinish={handleSubmit}
        >
          {/* EMAIL */}
          <Form.Item
            label={
              <LabelComponent label="forgot.email" isDark={isDark} required />
            }
            name="email"
          >
            <InputComponent
              type="text"
              placeholder={t("forgot.emailPlaceholder")}
              icon={<MailOutlined />}
              isDark={isDark}
              height={48}
            />
          </Form.Item>

          {/* SLIDER CAPTCHA */}
          <Form.Item className="mt-9 mb-4 px-4">
            <div className="w-full rounded-xl">
              <SliderCaptcha
                onSuccess={(status) => setCaptchaVerified(status)}
                isDark={isDark}
              />
            </div>
          </Form.Item>

          {/* BUTTONS */}
          <Form.Item>
            <div className="flex justify-between gap-4 mt-4">
              <ButtonComponent
                onClick={() => navigate("/auth/login")}
                icon={<ArrowLeftOutlined />}
                variant="secondary"
                isDark={isDark}
                className="flex-1 h-12 bg-[#292929] border border-[#4b3b61] hover:opacity-80"
              >
                {t("forgot.back")}
              </ButtonComponent>
              <ButtonComponent
                htmlType="submit"
                loading={isSubmitting}
                disabled={isSubmitting || !captchaVerified}
                className="flex-2"
                tooltip={!captchaVerified ? t("captcha.tooltip") : ""}
              >
                {t("forgot.submit")}
              </ButtonComponent>
            </div>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default ForgotPassword;
