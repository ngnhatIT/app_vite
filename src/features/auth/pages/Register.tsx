import { Form, Input } from "antd";
import {
  UserOutlined,
  LockOutlined,
  EyeTwoTone,
  EyeInvisibleOutlined,
  MailOutlined,
  ArrowLeftOutlined,
} from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../../../app/store";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import LabelComponent from "../../../components/LabelComponent";
import ButtonComponent from "../../../components/ButtonComponent";
import { sendOtpThunk } from "../AuthThunk";
import InputComponent from "../../../components/InputComponent";

export const Register = () => {
  const isDark = useSelector((state: RootState) => state.theme.darkMode);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [form] = Form.useForm();

  const status = useSelector((state: RootState) => state.auth.status);
  const handleRegister = async (values: {
    email: string;
    userName: string;
    password: string;
    confirmPassword: string;
  }) => {
    const payload = {
      userName: values.userName,
      email: values.email,
      flowType: "register",
    };

    await dispatch(sendOtpThunk({ payload, t })).unwrap();
    navigate("/auth/check-mail", {
      state: {
        user: {
          email: values.email,
          userName: values.userName,
          password: values.password,
        },
        otpCountdownStart: Date.now(),
        flowType: "register",
      },
    });
  };

  return (
    <div className="card-2 inline-flex flex-col flex-shrink-0 justify-center items-center gap-2 rounded-[32px] border-[#4b3b61] bg-[rgba(255,255,255,0.1)] px-[5.5rem] py-[4.25rem] w-[600px]">
      {/* TITLE */}
      <div className="flex flex-col justify-center items-start self-stretch">
        <h2
          className={`font-['Poppins'] text-5xl font-medium leading-[normal] capitalize ${
            isDark ? "text-neutral-100" : "text-[#2c2c2c]"
          }`}
        >
          {t("register.title")}
        </h2>
        <div className="flex gap-2">
          <span className="text-[#9e9e9e] font-['Poppins'] text-sm leading-5">
            {t("login.noAccount")}
          </span>
          <span
            className="text-[#e476ad] font-['Poppins'] text-sm leading-5 cursor-pointer"
            onClick={() => navigate("/auth/login")}
          >
            {t("login.submit")}
          </span>
        </div>
      </div>

      {/* FORM */}
      <div className="flex flex-col items-start w-full gap-4 mt-2">
        <Form
          layout="vertical"
          className="w-full"
          form={form}
          onFinish={handleRegister}
        >
          {/* USERNAME */}
          <Form.Item
            label={
              <LabelComponent label={t("register.username")} isDark={isDark} />
            }
            name="userName"
            rules={[
              { required: true, message: t("register.usernameRequired") },
            ]}
          >
            <InputComponent
              type="text"
              placeholder={t("register.usernamePlaceholder")}
              icon={<UserOutlined />}
              isDark={isDark}
              height={48}
            />
          </Form.Item>

          {/* EMAIL */}
          <Form.Item
            label={
              <LabelComponent label={t("register.email")} isDark={isDark} />
            }
            name="email"
            rules={[
              { required: true, message: t("register.emailRequired") },
              { type: "email", message: t("register.emailInvalid") },
            ]}
          >
            <InputComponent
              type="text"
              placeholder={t("register.emailPlaceholder")}
              icon={<MailOutlined />}
              isDark={isDark}
              height={48}
            />
          </Form.Item>

          {/* PASSWORD */}
          <Form.Item
            label={
              <LabelComponent label={t("register.password")} isDark={isDark} />
            }
            name="password"
            rules={[
              { required: true, message: t("register.passwordRequired") },
              {
                pattern:
                  /^(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,12}$/,
                message: t("register.passwordInvalid"),
              },
            ]}
          >
            <InputComponent
              type="password"
              placeholder={t("register.passwordPlaceholder")}
              icon={<LockOutlined />}
              isDark={isDark}
              height={48}
            />
          </Form.Item>

          {/* CONFIRM PASSWORD */}
          <Form.Item
            label={
              <LabelComponent
                label={t("register.confirmPassword")}
                isDark={isDark}
              />
            }
            name="confirmPassword"
            dependencies={["password"]}
            rules={[
              {
                required: true,
                message: t("register.confirmPasswordRequired"),
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(t("register.passwordsMismatch"));
                },
              }),
            ]}
          >
            <InputComponent
              type="password"
              placeholder={t("register.confirmPasswordPlaceholder")}
              icon={<LockOutlined />}
              isDark={isDark}
              height={48}
            />
          </Form.Item>

          {/* BUTTONS */}
          <Form.Item className="mb-0 mt-6">
            <div className="flex justify-between gap-4">
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
                loading={status === "loading"}
                disabled={status === "loading"}
                className="flex-2"
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
