import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Form } from "antd";
import { useTranslation } from "react-i18next";
import { useEffect } from "react";
import type { AppDispatch, RootState } from "../../../app/store";
import LabelComponent from "../../../components/LabelComponent";
import InputComponent from "../../../components/InputComponent";
import ButtonComponent from "../../../components/ButtonComponent";

const ResetPasswordForm = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { state } = useLocation();
  const status = useSelector((state: RootState) => state.auth.status);
  const [form] = Form.useForm();
  const isDark = useSelector((state: RootState) => state.theme.darkMode);

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
  }) => {};

  return (
    <div className="card-2 inline-flex flex-col flex-shrink-0 justify-center items-center gap-10 rounded-[32px] border-[#4b3b61] bg-[rgba(255,255,255,0.1)] px-[5.5rem] py-[4.25rem] w-[600px]">
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
              <LabelComponent
                label="reset.newPassword"
                isDark={isDark}
                required
              />
            }
            name="newPassword"
            rules={[{ required: true, message: t("reset.passwordRequired") }]}
          >
            <InputComponent
              type="password"
              placeholder={t("reset.newPasswordPlaceholder")}
              isDark={isDark}
              height={48}
            />
          </Form.Item>

          <Form.Item
            label={
              <LabelComponent
                label="reset.confirmPassword"
                isDark={isDark}
                required
              />
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
            <InputComponent
              type="password"
              placeholder={t("reset.confirmPasswordPlaceholder")}
              isDark={isDark}
              height={48}
            />
          </Form.Item>

          <Form.Item className="mb-0 mt-6">
            <div className="flex justify-between gap-4">
              <ButtonComponent
                onClick={() => navigate("/auth/login")}
                className="flex-1 h-12 bg-[#292929] border border-[#4b3b61] hover:opacity-80"
              >
                {t("reset.cancel")}
              </ButtonComponent>
              <ButtonComponent
                htmlType="submit"
                loading={status === "loading"}
                disabled={status === "loading"}
              >
                {t("reset.submit")}
              </ButtonComponent>
            </div>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default ResetPasswordForm;
