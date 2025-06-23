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
import { sendOtpThunk } from "../AuthSlice";
import LabelComponent from "../../../components/LabelComponent";
import ButtonComponent from "../../../components/ButtonComponent";


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
    if (values.password !== values.confirmPassword) {
      return form.setFields([
        {
          name: "confirmPassword",
          errors: [t("register.passwordsMismatch")],
        },
      ]);
    }

    const payload = {
      userName: values.userName,
      email: values.email,
    };

    const onSubmit = () => {
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

    dispatch(sendOtpThunk(t, payload, onSubmit));
  };

  return (
    <div className="card-2 inline-flex flex-col flex-shrink-0 justify-center items-center gap-10 rounded-[32px] border border-[#4b3b61] bg-[rgba(255,255,255,0.1)] px-[5.5rem] py-[4.25rem] w-[600px]">
      {/* TITLE */}
      <div className="flex flex-col justify-center items-start self-stretch">
        <h2
          className={`font-['Poppins'] text-5xl font-medium leading-[normal] capitalize ${
            isDark ? "text-neutral-100" : "text-[#2c2c2c]"
          }`}
        >
          {t("Register")}
        </h2>
        <div className="flex items-center gap-2 mt-2">
          <span className="text-[#9e9e9e] font-['Poppins'] text-sm leading-5">
            {t("Already have an account?")}
          </span>
          <span
            className="text-[#e476ad] font-['Poppins'] text-sm leading-5 cursor-pointer"
            onClick={() => navigate("/auth/login")}
          >
            {t("Login")}
          </span>
        </div>
      </div>

      {/* FORM */}
      <div className="flex flex-col items-start w-full gap-6">
        <Form
          layout="vertical"
          className="w-full"
          form={form}
          onFinish={handleRegister}
        >
          {/* USERNAME */}
          <Form.Item
            label={<LabelComponent label="Username" isDark={isDark} />}
            name="userName"
            rules={[{ required: true, message: t("Please enter your username") }]}
          >
            <Input
              size="large"
              placeholder={t("Enter your username")}
              prefix={<UserOutlined className="text-white" />}
              className="rounded-lg text-white placeholder:text-[#9e9e9e] font-['Poppins'] text-sm leading-[14px]"
              style={{ background: "rgba(255,255,255,0.1)", border: "1px solid #4b3b61" }}
              allowClear
            />
          </Form.Item>

          {/* EMAIL */}
          <Form.Item
            label={<LabelComponent label="Email" isDark={isDark} />}
            name="email"
            rules={[
              { required: true, message: t("Please enter your email") },
              { type: "email", message: t("Invalid email format") },
            ]}
          >
            <Input
              size="large"
              placeholder={t("Enter your email")}
              prefix={<MailOutlined className="text-white" />}
              className="rounded-lg text-white placeholder:text-[#9e9e9e] font-['Poppins'] text-sm"
              style={{ background: "rgba(255,255,255,0.1)", border: "1px solid #4b3b61" }}
            />
          </Form.Item>

          {/* PASSWORD */}
          <Form.Item
            label={<LabelComponent label="Password" isDark={isDark} />}
            name="password"
            rules={[
              { required: true, message: t("Please enter your password") },
              {
                pattern: /^(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,12}$/,
                message: t("Password must be 8-12 characters, include an uppercase letter and a special character."),
              },
            ]}
          >
            <Input.Password
              size="large"
              placeholder={t("Enter your password")}
              prefix={<LockOutlined className="text-white" />}
              iconRender={(visible) =>
                visible ? <EyeTwoTone twoToneColor="#fff" /> : <EyeInvisibleOutlined className="text-white" />
              }
              className="rounded-lg text-white placeholder:text-[#9e9e9e] font-['Poppins'] text-sm"
              style={{ background: "rgba(255,255,255,0.1)", border: "1px solid #4b3b61" }}
            />
          </Form.Item>

          {/* CONFIRM PASSWORD */}
          <Form.Item
            label={<LabelComponent label="Confirm Password" isDark={isDark} />}
            name="confirmPassword"
            dependencies={["password"]}
            rules={[
              { required: true, message: t("Please confirm your password") },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(t("Passwords do not match!"));
                },
              }),
            ]}
          >
            <Input.Password
              size="large"
              placeholder={t("Enter your confirm password")}
              prefix={<LockOutlined className="text-white" />}
              iconRender={(visible) =>
                visible ? <EyeTwoTone twoToneColor="#fff" /> : <EyeInvisibleOutlined className="text-white" />
              }
              className="rounded-lg text-white placeholder:text-[#9e9e9e] font-['Poppins'] text-sm"
              style={{ background: "rgba(255,255,255,0.1)", border: "1px solid #4b3b61" }}
            />
          </Form.Item>

          {/* BUTTONS */}
          <Form.Item className="mb-0 mt-6">
            <div className="flex justify-between gap-4">
              <button
                type="button"
                onClick={() => navigate("/auth/login")}
                className="flex-1 h-12 text-white font-['Poppins'] text-sm rounded-lg bg-[#292929] border border-[#4b3b61] hover:opacity-80"
              >
                <ArrowLeftOutlined /> {t("Back")}
              </button>
              <ButtonComponent
                htmlType="submit"
                loading={status === "loading"}
                disabled={status === "loading"}
              >
                {t("Register")}
              </ButtonComponent>
            </div>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default Register;
