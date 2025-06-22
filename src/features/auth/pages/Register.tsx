import React, { useEffect } from "react";
import { Form, Input, Button } from "antd";
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
import "../../../css/button.css";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { registerOtpThunk } from "../AuthSlice";

export const Register = () => {
  const isDark = useSelector((state: RootState) => state.theme.darkMode);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [form] = Form.useForm();

  const status = useSelector((state: RootState) => state.auth.status);
  const handleRegister = async (values: {
    email: string;
    username: string;
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

    dispatch(
      registerOtpThunk(t, values.email, () => {
        navigate("/auth/verify-otp", {
          state: {
            user: {
              email: values.email,
              username: values.username,
              password: values.password,
            },
            otpCountdownStart: Date.now(),
            flowType: "register",
          },
        });
      })
    );
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
          Register
        </h2>
        <div className="flex items-center gap-2 mt-2">
          <span className="text-[#9e9e9e] font-['Poppins'] text-sm leading-5">
            Already have an account?
          </span>
          <span
            className="text-[#e476ad] font-['Poppins'] text-sm leading-5 cursor-pointer"
            onClick={() => navigate("/auth/login")}
          >
            Login
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
            label={<Label text="Username" isDark={isDark} />}
            name="username"
            rules={[{ required: true, message: "Please enter your username" }]}
          >
            <Input
              size="large"
              placeholder="Enter your username"
              prefix={<UserOutlined className="text-white" />}
              className="rounded-lg text-white placeholder:text-[#9e9e9e] font-['Poppins'] text-sm leading-[14px]"
              style={{
                background: "rgba(255,255,255,0.1)",
                border: "1px solid #4b3b61",
              }}
              allowClear
            />
          </Form.Item>

          {/* EMAIL */}
          <Form.Item
            label={<Label text="Email" isDark={isDark} />}
            name="email"
            rules={[
              { required: true, message: "Please enter your email" },
              { type: "email", message: "Invalid email format" },
            ]}
          >
            <Input
              size="large"
              placeholder="Enter your email"
              prefix={<MailOutlined className="text-white" />}
              className="rounded-lg text-white placeholder:text-[#9e9e9e] font-['Poppins'] text-sm"
              style={{
                background: "rgba(255,255,255,0.1)",
                border: "1px solid #4b3b61",
              }}
            />
          </Form.Item>

          {/* PASSWORD */}
          <Form.Item
            label={<Label text="Password" isDark={isDark} />}
            name="password"
            rules={[
              { required: true, message: "Please enter your password" },
              {
                pattern: /^(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,12}$/,
                message:
                  "Password must be 8-12 characters, include an uppercase letter and a special character.",
              },
            ]}
          >
            <Input.Password
              size="large"
              placeholder="Enter your password"
              prefix={<LockOutlined className="text-white" />}
              iconRender={(visible) =>
                visible ? (
                  <EyeTwoTone twoToneColor="#fff" />
                ) : (
                  <EyeInvisibleOutlined className="text-white" />
                )
              }
              className="rounded-lg text-white placeholder:text-[#9e9e9e] font-['Poppins'] text-sm"
              style={{
                background: "rgba(255,255,255,0.1)",
                border: "1px solid #4b3b61",
              }}
            />
          </Form.Item>

          {/* CONFIRM PASSWORD */}
          <Form.Item
            label={<Label text="Confirm Password" isDark={isDark} />}
            name="confirmPassword"
            dependencies={["password"]}
            rules={[
              { required: true, message: "Please confirm your password" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject("Passwords do not match!");
                },
              }),
            ]}
          >
            <Input.Password
              size="large"
              placeholder="Enter your confirm password"
              prefix={<LockOutlined className="text-white" />}
              iconRender={(visible) =>
                visible ? (
                  <EyeTwoTone twoToneColor="#fff" />
                ) : (
                  <EyeInvisibleOutlined className="text-white" />
                )
              }
              className="rounded-lg text-white placeholder:text-[#9e9e9e] font-['Poppins'] text-sm"
              style={{
                background: "rgba(255,255,255,0.1)",
                border: "1px solid #4b3b61",
              }}
            />
          </Form.Item>

          {/* BUTTONS */}
          <Form.Item className="mb-0 mt-6">
            <div className="flex justify-between gap-4">
              <Button
                icon={<ArrowLeftOutlined />}
                size="large"
                style={{
                  background: "rgba(255,255,255,0.1)",
                  border: "1px solid #4b3b61",
                }}
                className="flex-1 h-12 text-white font-['Poppins'] text-sm rounded-lg bg-[#292929] border-none hover:opacity-80"
                onClick={() => navigate("/auth/login")}
              >
                Back
              </Button>
              <Button
                htmlType="submit"
                size="large"
                type="primary"
                className="flex-5 text-white font-['Poppins'] text-sm font-medium leading-5 border-none"
                style={{
                  borderRadius: "8px",
                  background: "var(--Foundation-indigo-indigo-500, #6610F2)",
                  boxShadow: "0px 4px 12px 0px rgba(114, 57, 234, 0.35)",
                }}
              >
                Register
              </Button>
            </div>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

// Helper to render label
const Label = ({ text, isDark }: { text: string; isDark: boolean }) => (
  <div className="flex items-start gap-1">
    <span
      className={`font-['Poppins'] text-sm leading-[1.125rem] ${
        isDark ? "text-white" : "text-[#2c2c2c]"
      }`}
    >
      {text}
    </span>
    <span className="text-[#f8285a] font-['Poppins'] text-sm leading-[1.125rem]">
      *
    </span>
  </div>
);

export default Register;
