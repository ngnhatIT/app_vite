import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Form, message } from "antd";
import { useTranslation } from "react-i18next";
import type { AppDispatch, RootState } from "../../../app/store";

import LabelComponent from "../../../components/LabelComponent";
import InputComponent from "../../../components/InputComponent";
import ButtonComponent from "../../../components/ButtonComponent";
import { resetPasswordThunk } from "../authThunk";
import { ResetPasswordSchema } from "../authSchema"; // 👈 schema Zod
import type { ResetPasswordFormType } from "../authSchema";

const ResetPasswordForm = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { state } = useLocation();
  const isDark = useSelector((state: RootState) => state.theme.darkMode);
  const [form] = Form.useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const email = state?.email;
  const otp = state?.otp;

  useEffect(() => {
    if (!email || !otp) {
      navigate("/auth/forgot-password", { replace: true });
    }
  }, [email, otp, navigate]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const parsed = ResetPasswordSchema.safeParse(values);

      if (!parsed.success) {
        const fieldErrors = parsed.error.flatten().fieldErrors;

        form.setFields(
          Object.entries(fieldErrors).map(([name, errors]) => ({
            name: [name as keyof ResetPasswordFormType],
            errors: errors || [],
          }))
        );
        return;
      }

      form.setFields(
        Object.keys(values).map((name) => ({
          name: [name as keyof ResetPasswordFormType],
          errors: [],
        }))
      );

      const payload = {
        newpassword: parsed.data.newPassword,
        email,
        otpCode: otp,
      };

      setIsSubmitting(true);

      await dispatch(resetPasswordThunk({ payload })).unwrap();

      message.info(t("reset.success"));
      navigate("/auth/login");
    } catch (err: any) {
      message.error(
        t("reset.failed", { reason: err?.message ?? t("error.general") })
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="card-2 inline-flex flex-col flex-shrink-0 justify-center items-center gap-2">
      <div className="flex flex-col justify-center items-start self-stretch">
        <LabelComponent
          as="h2"
          label="reset.title"
          isDark={isDark}
          className="text-[48px] capitalize"
        />
        <div className="mt-2 text-[#9e9e9e] font-['Poppins'] text-sm leading-5">
          {t("reset.subTitle", { email })}
        </div>
      </div>

      <div className="flex flex-col items-start w-full gap-6">
        <Form
          layout="vertical"
          className="w-full"
          form={form}
          onFinish={handleSubmit}
          autoComplete="off"
          validateTrigger="onChange"
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
                {t("reset.back")}
              </ButtonComponent>
              <ButtonComponent
                htmlType="submit"
                loading={isSubmitting}
                disabled={isSubmitting}
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
