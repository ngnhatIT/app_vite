import { useEffect, useState } from "react";
import { Form } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { useNavigate, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../../app/store";

import LabelComponent from "../../../components/LabelComponent";
import InputComponent from "../../../components/InputComponent";
import ButtonComponent from "../../../components/ButtonComponent";
import { showDialog } from "../../../components/DialogService";
import { loginThunk } from "../AuthThunk";
import { setNavigate } from "../../../api/AxiosIntance";

const Login = () => {
  const [form] = Form.useForm();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const isDark = useSelector((state: RootState) => state.theme.darkMode);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setNavigate(navigate);
    return () => {
      setNavigate(() => {});
    };
  }, [navigate]);

  const onFinish = async (values: { userName: string; password: string }) => {
    setIsSubmitting(true);
    try {
      await dispatch(loginThunk({ payload: values })).unwrap();
      navigate("/");
    } catch (err: any) {
      showDialog({
        title: t("common.error"),
        content: err.message ?? t("error.general"),
        isDark,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="card-2 inline-flex flex-col flex-shrink-0 justify-center items-center gap-2 rounded-[32px] border-[#4b3b61] bg-[rgba(255,255,255,0.1)] px-[5.5rem] py-[4.25rem]">
      {/* Title */}
      <div className="flex flex-col justify-center items-start self-stretch">
        <LabelComponent
          as="h2"
          label="login.title"
          isDark={isDark}
          className="text-[48px] capitalize"
        />
        <div className="flex justify-start items-center gap-2 ">
          <LabelComponent
            label="login.noAccount"
            checkSpecial
            as="span"
            className="text-[#9e9e9e] text-sm"
          />
          <Link
            to="/auth/register"
            className="text-[#e476ad]  text-sm leading-5 cursor-pointer"
          >
            {t("login.signUp")}
          </Link>
        </div>
      </div>

      {/* Form */}
      <div className="flex flex-col items-start w-full gap-6 mt-[36px]">
        <Form
          form={form}
          layout="vertical"
          className="w-full" // hoặc mb-0 nếu cần cực sát
          onFinish={onFinish}
          autoComplete="off"
        >
          {/* Username */}
          <Form.Item
            label={
              <LabelComponent label="login.username" isDark={isDark} required />
            }
            name="userName"
          >
            <InputComponent
              type="text"
              placeholder={t("login.usernamePlaceholder")}
              icon={<UserOutlined />}
              isDark={isDark}
              height="48px"
            />
          </Form.Item>

          {/* Password */}
          <Form.Item
            label={
              <LabelComponent label="login.password" isDark={isDark} required />
            }
            name="password"
          >
            <InputComponent
              type="password"
              placeholder={t("login.passwordPlaceholder")}
              icon={<LockOutlined />}
              isDark={isDark}
              height="48px"
            />
          </Form.Item>

          {/* Forgot password */}
          <div className="w-full flex justify-start mb-4">
            <LabelComponent
              label="login.forgotPassword"
              checkSpecial
              as="div"
              onClick={() => navigate("/auth/forgot-password")}
              className={`cursor-pointer text-sm  leading-5 ${
                isDark ? "text-[#e476ad]" : "text-[#c61a65]"
              }`}
            />
          </div>

          {/* Submit */}
          <Form.Item className="mb-0">
            <ButtonComponent
              htmlType="submit"
              loading={isSubmitting}
              disabled={isSubmitting}
            >
              {t("login.submit")}
            </ButtonComponent>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default Login;
