import React, { useEffect } from "react";
import { Form, Input, Button } from "antd";
import {
  UserOutlined,
  LockOutlined,
  EyeTwoTone,
  EyeInvisibleOutlined,
} from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../../app/store";
import "../../../css/button.css"; // button-primary đã có
import { useNavigate } from "react-router-dom";
import { setNavigate } from "../../../api/AxiosIntance";
import { loginThunk } from "../AuthSlice";
import { useTranslation } from "react-i18next";
import type { LoginRequestDTO } from "../dto/LoginRequestDTO";
import { Link } from "react-router-dom";

export const Login = () => {
  const isDark = useSelector((state: RootState) => state.theme.darkMode);
  const [form] = Form.useForm();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const status = useSelector((state: RootState) => state.auth.status);
  useEffect(() => {
    const device = (window as any).deviceInfo?.get?.();
    console.log("📱 Device from preload:", device);
    setNavigate(navigate);
    return () => {
      setNavigate(() => {});
    };
  }, [navigate]);

  const onFinish = async (values: LoginRequestDTO) => {
    if (status === "loading") return;
    dispatch(loginThunk(t, values));
  };

  return (
    <div className="card-2 inline-flex flex-col flex-shrink-0 justify-center items-center gap-10 rounded-[32px] border-[#985ff6]/50 bg-[#bfbfbf]/[.6]">
      {/* TITLE */}
      <div className="flex flex-col justify-center items-start self-stretch">
        <div
          className={`font-['Poppins'] text-5xl font-medium leading-[normal] capitalize ${
            isDark ? "text-neutral-100" : "text-[#2c2c2c]"
          }`}
        >
          login
        </div>
        <div className="flex justify-start items-center gap-2 mt-2">
          <div className="text-[#9e9e9e] font-['Poppins'] text-sm leading-5">
            Don’t have an account?
          </div>
          <Link
            to="/auth/register"
            className="text-[#e476ad] font-['Poppins'] text-sm leading-5 cursor-pointer"
          >
            Sign Up
          </Link>
        </div>
      </div>

      {/* FORM */}
      <div className="flex flex-col items-start w-full gap-6">
        <Form
          form={form}
          layout="vertical"
          className="w-full"
          onFinish={onFinish}
        >
          {/* USERNAME */}
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
            name="username"
            rules={[
              { required: true, message: t("Please enter your username") },
            ]}
          >
            <Input
              size="large"
              placeholder={t("Enter your username")}
              prefix={<UserOutlined className="text-white" />}
              className="rounded-lg text-white placeholder:text-[#9e9e9e] font-['Poppins'] text-sm"
              style={{
                background: "rgba(255,255,255,0.1)",
                border: "1px solid #4b3b61",
              }}
            />
          </Form.Item>

          {/* PASSWORD */}
          <Form.Item
            label={
              <div className="flex items-start gap-1">
                <span
                  className={`${
                    isDark ? "text-white" : "text-[#2c2c2c]"
                  } font-['Poppins'] text-sm leading-[1.125rem]`}
                >
                  {t("Password")}
                </span>
                <span className="text-[#f8285a]">*</span>
              </div>
            }
            name="password"
            rules={[
              { required: true, message: t("Please enter your password") },
            ]}
          >
            <Input.Password
              size="large"
              placeholder={t("Enter your password")}
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

          {/* FORGOT PASSWORD */}
          <div
            className="text-right text-[#e476ad] font-['Poppins'] text-sm leading-5 mb-4 cursor-pointer"
            onClick={() => navigate("/auth/forgot-password")}
          >
            {t("Forgot password?")}
          </div>

          {/* SUBMIT */}
          <Form.Item className="mb-0">
            <Button
              htmlType="submit"
              size="large"
              loading={status === "loading"}
              className="w-full text-white font-['Poppins'] text-[.9375rem] font-medium leading-5 border-none"
              style={{
                borderRadius: "8px",
                background: "var(--Foundation-indigo-indigo-500, #6610F2)",
                boxShadow: "0px 4px 12px 0px rgba(114, 57, 234, 0.35)",
                height: "48px",
              }}
            >
              {t("Login")}
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default Login;
