import { z } from "zod";
import i18n from "../../i18n/i18n";

// 👇 gọi t 1 lần duy nhất
const t = i18n.t.bind(i18n);

const googleEmailRegex =
  /^[a-zA-Z0-9]+([._+-]?[a-zA-Z0-9]+)*@[a-zA-Z0-9-]+(\.[a-zA-Z]{2,})+$/;

const passwordRegex =
  /^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>])(?=.*[a-zA-Z])(?=.*\d).{8,12}$/;

export const AuthSchema = z.object({
  userName: z
    .string()
    .min(2, { message: t("authValidation.usernameMin") })
    .max(50, { message: t("authValidation.usernameMax") })
    .regex(/^\S+$/, { message: t("authValidation.usernameNoSpace") }),

  email: z
    .string()
    .min(1, { message: t("authValidation.emailRequired") })
    .regex(googleEmailRegex, { message: t("authValidation.emailInvalid") }),

  fullName: z
    .string()
    .min(2, { message: t("authValidation.fullnameMin") })
    .max(100, { message: t("authValidation.fullnameMax") }),

  password: z
    .string()
    .min(8, { message: t("authValidation.passwordMin") })
    .max(12, { message: t("authValidation.passwordMax") })
    .regex(passwordRegex, { message: t("authValidation.passwordInvalid") }),

  confirmPassword: z.string().optional(),
});

export const LoginSchema = AuthSchema.pick({
  userName: true,
  password: true,
});

export const RegisterSchema = AuthSchema.extend({
  confirmPassword: z.string({ required_error: t("authValidation.confirmPasswordRequired") }),
}).refine((data) => data.password === data.confirmPassword, {
  message: t("authValidation.passwordsMismatch"),
  path: ["confirmPassword"],
});

export const ResetPasswordSchema = z
  .object({
    newPassword: z
      .string()
      .min(8, { message: t("authValidation.passwordMin") })
      .max(12, { message: t("authValidation.passwordMax") })
      .regex(passwordRegex, { message: t("authValidation.passwordInvalid") }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: t("authValidation.passwordsMismatch"),
    path: ["confirmPassword"],
  });

export const ForgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, { message: t("authValidation.emailRequired") })
    .regex(googleEmailRegex, { message: t("authValidation.emailInvalid") }),
});

export type AuthFormType = z.infer<typeof AuthSchema>;
export type LoginFormType = z.infer<typeof LoginSchema>;
export type RegisterFormType = z.infer<typeof RegisterSchema>;
export type ResetPasswordFormType = z.infer<typeof ResetPasswordSchema>;
export type ForgotPasswordFormType = z.infer<typeof ForgotPasswordSchema>;
