import React, { useEffect } from "react";
import { Form } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../../app/store";
import { useNavigate, Link } from "react-router-dom";
import { setNavigate } from "../../../api/AxiosIntance";
import { loginThunk } from "../AuthSlice";
import { useTranslation } from "react-i18next";
import type { LoginRequestDTO } from "../dto/LoginRequestDTO";

// 🔽 Component bạn tạo
import LabelComponent from "../../../components/LabelComponent";
import InputComponent from "../../../components/InputComponent";
import PrimaryButton from "../../../components/ButtonPrimary";

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
      {/* Title */}
      <div className="flex flex-col justify-center items-start self-stretch">
        <div
          className={`font-['Poppins'] text-5xl font-medium capitalize leading-normal ${
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

      {/* Form */}
      <div className="flex flex-col items-start w-full gap-6">
        <Form
          form={form}
          layout="vertical"
          className="w-full"
          onFinish={onFinish}
        >
          {/* Username */}
          <Form.Item
            label={<LabelComponent label="Username" isDark={isDark} required />}
            name="username"
            rules={[
              { required: true, message: t("Please enter your username") },
            ]}
          >
            <InputComponent
              type="text"
              placeholder={t("Enter your username")}
              icon={<UserOutlined />}
              isDark={isDark}
              height={48}
            />
          </Form.Item>

          {/* Password */}
          <Form.Item
            label={<LabelComponent label="Password" isDark={isDark} required />}
            name="password"
            rules={[
              { required: true, message: t("Please enter your password") },
            ]}
          >
            <InputComponent
              type="password"
              placeholder={t("Enter your password")}
              icon={<LockOutlined />}
              isDark={isDark}
              height={48}
            />
          </Form.Item>

          {/* Forgot password */}
          <div className="w-full flex justify-end mb-4">
            <div
              className={`cursor-pointer font-['Poppins'] text-sm leading-5 ${
                isDark ? "text-[#e476ad]" : "text-[#c61a65]"
              }`}
              onClick={() => navigate("/auth/forgot-password")}
            >
              {t("Forgot password?")}
            </div>
          </div>

          {/* Submit */}
          <Form.Item className="mb-0">
            <PrimaryButton htmlType="submit" loading={status === "loading"}>
              {t("Login")}
            </PrimaryButton>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default Login;
