import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Button, Form, Input } from "antd";
import { useTranslation } from "react-i18next";
import { useEffect } from "react";
import type { AppDispatch, RootState } from "../../../app/store";
import { resetPasswordThunk } from "../AuthSlice";

const ResetPasswordForm = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { state } = useLocation();
  const status = useSelector((state: RootState) => state.auth.status);
  const [form] = Form.useForm();

  const email = state?.email;
  const otp = state?.otp;

  useEffect(() => {
    if (!email || !otp) {
      navigate("/auth/forgot-password", { replace: true });
    }
  }, [email, otp, navigate]);

  const handleSubmit = (values: {
    newPassword: string;
    confirmPassword: string;
  }) => {
    if (values.newPassword !== values.confirmPassword) {
      form.setFields([
        {
          name: "confirmPassword",
          errors: [t("reset.passwordsMismatch")],
        },
      ]);
      return;
    }

    dispatch(
      resetPasswordThunk(
        t,
        {
          otp,
          newPassword: values.newPassword,
          email,
        },
        () => navigate("/auth/login", { replace: true })
      )
    );
  };

  return (
    <div className="card-2 inline-flex flex-col flex-shrink-0 justify-center items-center gap-10 rounded-[32px] border-[#985ff6]/50 bg-[#bfbfbf]/[.6] px-[5.5rem] py-[4.25rem] w-[600px]">
      <div className="flex flex-col justify-center items-start self-stretch">
        <h2 className="text-[#f8f9fa] font-['Poppins'] text-5xl font-medium leading-[normal] capitalize">
          {t("reset.title")}
        </h2>
        <div className="mt-2 text-[#9e9e9e] font-['Poppins'] text-sm leading-5">
          {t("reset.description", { email })}
        </div>
      </div>

      <div className="flex flex-col items-start w-full gap-6">
        <Form
          layout="vertical"
          className="w-full"
          form={form}
          onFinish={handleSubmit}
        >
          <Form.Item
            label={
              <Label text={t("reset.newPassword")} isDark={true} />
            }
            name="newPassword"
            rules={[{ required: true, message: t("reset.passwordRequired") }]}
          >
            <Input.Password
              size="large"
              placeholder="••••••••"
              className="rounded-lg text-white placeholder:text-[#9e9e9e] font-['Poppins'] text-sm"
              style={{
                background: "rgba(255,255,255,0.1)",
                border: "1px solid #4b3b61",
              }}
            />
          </Form.Item>

          <Form.Item
            label={
              <Label text={t("reset.confirmPassword")} isDark={true} />
            }
            name="confirmPassword"
            dependencies={["newPassword"]}
            rules={[
              {
                required: true,
                message: t("reset.confirmPasswordRequired"),
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("newPassword") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error(t("reset.passwordsMismatch"))
                  );
                },
              }),
            ]}
          >
            <Input.Password
              size="large"
              placeholder="••••••••"
              className="rounded-lg text-white placeholder:text-[#9e9e9e] font-['Poppins'] text-sm"
              style={{
                background: "rgba(255,255,255,0.1)",
                border: "1px solid #4b3b61",
              }}
            />
          </Form.Item>

          <Form.Item className="mb-0 mt-6">
            <div className="flex justify-between gap-4">
              <Button
                size="large"
                onClick={() => navigate("/auth/login")}
                style={{
                  background: "rgba(255,255,255,0.1)",
                  border: "1px solid #4b3b61",
                }}
                className="flex-1 h-12 text-white font-['Poppins'] text-sm rounded-lg bg-[#292929] border-none hover:opacity-80"
              >
                {t("reset.cancel")}
              </Button>
              <Button
                htmlType="submit"
                size="large"
                type="primary"
                className="flex-5 text-white font-['Poppins'] text-sm font-medium leading-5 border-none"
                style={{
                  borderRadius: "8px",
                  background: "#6610F2",
                  boxShadow: "0px 4px 12px 0px rgba(114, 57, 234, 0.35)",
                }}
                loading={status === "loading"}
              >
                {t("reset.submit")}
              </Button>
            </div>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

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

export default ResetPasswordForm;
