import { z } from "zod";
import i18n from "../../i18n/i18n";

const t = i18n.t;

export const AuthSchema = z.object({
  userName: z
    .string()
    .min(2, t("validation.usernameMin"))
    .max(50, t("validation.usernameMax"))
    .nonempty(t("validation.usernameRequired")),

  password: z
    .string()
    .min(8, t("validation.passwordMin"))
    .max(12, t("validation.passwordMax"))
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9])/,
      t("validation.passwordInvalid")
    )
    .nonempty(t("validation.passwordRequired")),

  email: z
    .string()
    .email(t("validation.emailInvalid"))
    .nonempty(t("validation.emailRequired")),

  fullName: z
    .string()
    .min(1, t("validation.fullnameMin"))
    .max(50, t("validation.fullnameMax")),
});

export const LoginSchema = AuthSchema.pick({
  userName: true,
  password: true,
});

export const RegisterSchema = AuthSchema.extend({
  confirmPassword: z.string().nonempty(t("validation.confirmPasswordRequired")),
}).refine((data) => data.password === data.confirmPassword, {
  message: t("validation.passwordsMismatch"),
  path: ["confirmPassword"],
});

export const ResetPasswordSchema = z
  .object({
    newPassword: z
      .string()
      .min(8, t("validation.passwordMin"))
      .max(12, t("validation.passwordMax"))
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9])/,
        t("validation.passwordInvalid")
      ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: t("validation.passwordsMismatch"),
    path: ["confirmPassword"],
  });

// ✅ ForgotPasswordSchema
export const ForgotPasswordSchema = z.object({
  email: z
    .string()
    .email(t("validation.emailInvalid"))
    .nonempty(t("validation.emailRequired")),
});

export type AuthFormType = z.infer<typeof AuthSchema>;
export type LoginFormType = z.infer<typeof LoginSchema>;
export type RegisterFormType = z.infer<typeof RegisterSchema>;
export type ResetPasswordFormType = z.infer<typeof ResetPasswordSchema>;
export type ForgotPasswordFormType = z.infer<typeof ForgotPasswordSchema>;
