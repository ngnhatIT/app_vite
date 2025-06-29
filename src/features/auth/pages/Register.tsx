import { useState } from "react";
import { Form } from "antd";
import {
  UserOutlined,
  LockOutlined,
  MailOutlined,
  ArrowLeftOutlined,
} from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../../../app/store";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import LabelComponent from "../../../components/LabelComponent";
import InputComponent from "../../../components/InputComponent";
import ButtonComponent from "../../../components/ButtonComponent";
import { sendOtpThunk } from "../AuthThunk";
import { showDialog } from "../../../components/DialogService";
import {
  RegisterSchema,
  type RegisterFormType,
} from "../../../utils/registerSchema";

const Register = () => {
  const isDark = useSelector((state: RootState) => state.theme.darkMode);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [form] = Form.useForm<RegisterFormType>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRegister = async () => {
    try {
      const values = await form.validateFields();
      const parsed = RegisterSchema.safeParse(values);

      if (!parsed.success) {
        const fieldErrors = parsed.error.flatten().fieldErrors;
        form.setFields(
          Object.entries(fieldErrors).map(([name, errors]) => ({
            name: name as keyof RegisterFormType,
            errors: errors || [],
          }))
        );
        return;
      }

      setIsSubmitting(true);

      const { email, userName, password } = parsed.data;
      const payload = { email, userName, flowType: "register" };

      await dispatch(sendOtpThunk({ payload })).unwrap();

      navigate("/auth/check-mail", {
        state: {
          user: { email, userName, password },
          otpCountdownStart: Date.now(),
          flowType: "register",
        },
      });
    } catch (err) {
      showDialog({
        title: t("common.error"),
        content: (err as Error)?.message || t("error.general"),
        isDark,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="card-2 inline-flex flex-col justify-center items-center gap-2 rounded-[32px] border-[#4b3b61] bg-[rgba(255,255,255,0.1)] px-[5.5rem] py-[4.25rem] w-[600px]">
      {/* Title */}
      <div className="flex flex-col justify-center items-start self-stretch">
        <LabelComponent
          as="h2"
          label="register.title"
          isDark={isDark}
          className="text-[48px] capitalize"
        />
        <div className="flex items-center gap-2">
          <LabelComponent
            label="login.noAccount"
            as="span"
            checkSpecial
            className="text-[#9e9e9e] text-sm"
          />
          <LabelComponent
            label="login.submit"
            as="span"
            checkSpecial
            className="text-[#e476ad] text-sm cursor-pointer font-['Poppins']"
            onClick={() => navigate("/auth/login")}
          />
        </div>
      </div>

      {/* Form */}
      <div className="flex flex-col items-start w-full mt-[34px]">
        <Form
          form={form}
          layout="vertical"
          onFinish={handleRegister}
          className="w-full"
          autoComplete="off"
        >
          <Form.Item
            name="userName"
            label={
              <LabelComponent
                label="register.username"
                isDark={isDark}
                required
              />
            }
          >
            <InputComponent
              type="text"
              placeholder={t("register.usernamePlaceholder")}
              icon={<UserOutlined />}
              isDark={isDark}
            />
          </Form.Item>

          <Form.Item
            name="email"
            label={
              <LabelComponent label="register.email" isDark={isDark} required />
            }
          >
            <InputComponent
              type="text"
              placeholder={t("register.emailPlaceholder")}
              icon={<MailOutlined />}
              isDark={isDark}
            />
          </Form.Item>

          <Form.Item
            name="password"
            label={
              <LabelComponent
                label="register.password"
                isDark={isDark}
                required
              />
            }
          >
            <InputComponent
              type="password"
              placeholder={t("register.passwordPlaceholder")}
              icon={<LockOutlined />}
              isDark={isDark}
            />
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            label={
              <LabelComponent
                label="register.confirmPassword"
                isDark={isDark}
                required
              />
            }
          >
            <InputComponent
              type="password"
              placeholder={t("register.confirmPasswordPlaceholder")}
              icon={<LockOutlined />}
              isDark={isDark}
            />
          </Form.Item>

          {/* Buttons */}
          <Form.Item className="mt-18">
            <div className="flex justify-between gap-3">
              <ButtonComponent
                variant="secondary"
                isDark={isDark}
                onClick={() => navigate("/auth/login")}
                className="flex-1 h-12 bg-[#292929] border border-[#4b3b61] hover:opacity-80"
              >
                <ArrowLeftOutlined /> {t("register.back")}
              </ButtonComponent>

              <ButtonComponent
                htmlType="submit"
                variant="primary"
                loading={isSubmitting}
                disabled={isSubmitting}
                className="flex-[4] h-12"
              >
                {t("register.submit")}
              </ButtonComponent>
            </div>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default Register;
