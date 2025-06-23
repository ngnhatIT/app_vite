import React, { useRef, useState } from "react";
import { Form, Input, Button, notification } from "antd";
import { MailOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { useAuthService } from "../AuthService";
import { sendOtp, setAuthStatus } from "../AuthSlice";
import type { RootState, AppDispatch } from "../../../app/store";
import ReCAPTCHA from "react-google-recaptcha";
import { getErrorMessage } from "../../../utils/errorUtil";

const ForgotPassword = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const status = useSelector((state: RootState) => state.auth.status);
  const recaptchaRef = useRef<ReCAPTCHA>(null);
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);
  const isDark = useSelector((state: RootState) => state.theme.darkMode);

  const handleSubmit = (values: { email: string }) => {
    try {
      dispatch(sendOtp(t, values.email));
      navigate("/auth/check-mail", {
        state: {
          user: { email: values.email },
          otpCountdownStart: Date.now(),
          flowType: "forgot-password",
        },
      });
    } catch (err: any) {
      notification.error({
        message: t("otp.resendFailed"),
        description: getErrorMessage(err, t),
        placement: "topLeft",
      });
      dispatch(setAuthStatus("failed"));
    }
  };

  return (
    <div className="card-2 inline-flex flex-col flex-shrink-0 justify-center items-center gap-10 rounded-[32px] border-[#985ff6]/50 bg-[#bfbfbf]/[.6] px-[5.5rem] py-[4.25rem] w-[600px]">
      {/* TITLE */}
      <div className="flex flex-col justify-center items-start self-stretch">
        <h2
          className={`font-['Poppins'] text-5xl font-medium leading-[normal] capitalize ${
            isDark ? "text-neutral-100" : "text-[#2c2c2c]"
          }`}
        >
          Forgot Password
        </h2>
        <div className="flex items-center gap-2 mt-2">
          <span className="text-[#9e9e9e] font-['Poppins'] text-sm leading-5">
            Please enter your email to receive a password reset link.
          </span>
        </div>
      </div>

      {/* FORM */}
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
              <div className="flex items-start gap-1">
                <span
                  className={`${
                    isDark ? "text-white" : "text-[#2c2c2c]"
                  } font-['Poppins'] text-sm leading-[1.125rem]`}
                >
                  {t("Username")}
                </span>
                <span className="text-[#f8285a]">*</span>
              </div>
            }
            name="email"
            rules={[
              { required: true, type: "email", message: "Invalid email" },
            ]}
          >
            <Input
              size="large"
              placeholder="Enter your email"
              prefix={<MailOutlined className="text-white" />}
              className="rounded-lg text-white placeholder:text-[#9e9e9e] font-['Poppins'] text-sm leading-[14px]"
              style={{
                background: "rgba(255,255,255,0.1)",
                border: "1px solid #4b3b61",
              }}
            />
          </Form.Item>

          <div className="w-full mt-1 mb-4">
            <ReCAPTCHA
              sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}
              onChange={(token) => setRecaptchaToken(token)}
              ref={recaptchaRef}
            />
          </div>

          {/* BUTTONS */}
          <Form.Item className="mb-0 mt-6">
            <div className="flex justify-between gap-4">
              <Button
                icon={<ArrowLeftOutlined />}
                size="large"
                onClick={() => navigate("/auth/login")}
                className="flex-1 h-12 text-white font-['Poppins'] text-sm rounded-lg bg-[#292929] border-none hover:opacity-80"
                style={{
                  background: "rgba(255,255,255,0.1)",
                  border: "1px solid #4b3b61",
                }}
              >
                Back
              </Button>
              <Button
                htmlType="submit"
                size="large"
                type="primary"
                loading={status === "loading"}
                disabled={status === "loading"}
                className="flex-5 text-white font-['Poppins'] text-sm font-medium leading-5 border-none"
                style={{
                  borderRadius: "8px",
                  background: "var(--Foundation-indigo-indigo-500, #6610F2)",
                  boxShadow: "0px 4px 12px 0px rgba(114, 57, 234, 0.35)",
                }}
              >
                Send Request
              </Button>
            </div>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default ForgotPassword;
