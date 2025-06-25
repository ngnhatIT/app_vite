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
import { sendOtpThunk } from "../AuthThunk";
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
          t,
          onSuccess: () => {},
        })
      ).unwrap();

      navigate("/auth/check-mail", {
        state: {
          user: {
            email: values.email,
          },
          otpCountdownStart: Date.now(),
          flowType: "forgot-password",
        },
      });
    } catch (err: any) {
      showDialog({
        title: t("common.error"),
        content: err ?? t("error.general"),
        isDark: isDark,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="card-2 inline-flex flex-col flex-shrink-0 justify-center items-center gap-10 rounded-[32px] border-[#4b3b61] px-[5.5rem] py-[4.25rem] w-[600px]">
      {/* TITLE */}
      <div className="flex flex-col justify-center items-start self-stretch">
        <h2
          className={`font-['Poppins'] text-5xl font-medium leading-[normal] capitalize ${
            isDark ? "text-neutral-100" : "text-[#2c2c2c]"
          }`}
        >
          {t("forgot.title")}
        </h2>
        <div className="flex items-center gap-2 mt-2">
          <span className="text-[#9e9e9e] font-['Poppins'] text-sm leading-5">
            {t("forgot.subtitle")}
          </span>
        </div>
      </div>

      <div className="flex flex-col items-start w-full gap-6">
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
            rules={[
              {
                required: true,
                type: "email",
                message: t("forgot.emailError"),
              },
            ]}
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
                {t("common.back")}
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
