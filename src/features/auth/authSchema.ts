// File: utils/authSchema.ts

import { z } from "zod";

export const LoginSchema = z.object({
  userName: z
    .string()
    .min(1, "login.usernameRequired")
    .max(50, "login.usernameTooLong")
    .regex(/^\S+$/, "login.usernameNoSpaces"),

  password: z
    .string()
    .min(1, "login.passwordRequired")
    .max(100, "login.passwordTooLong")
    .refine((val) => !val.includes(" "), {
      message: "login.passwordNoSpaces",
    }),
});

export type LoginFormType = z.infer<typeof LoginSchema>;

// Schema đăng ký vẫn giữ nguyên
export const RegisterSchema = z
  .object({
    userName: z
      .string()
      .min(1, "register.usernameRequired")
      .max(50, "register.usernameTooLong")
      .regex(/^\S+$/, "register.usernameNoSpaces"),

    email: z
      .string()
      .min(1, { message: "register.emailRequired" })
      .max(50, { message: "register.emailTooLong" })
      .email({ message: "register.emailInvalid" })
      .refine((val) => !/\s/.test(val), {
        message: "register.emailNoSpaces",
      })
      .refine((val) => /^[\x00-\x7F]+$/.test(val), {
        message: "register.emailAsciiOnly",
      }),

    password: z
      .string()
      .min(1, "register.passwordRequired")
      .regex(
        /^(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,12}$/,
        "register.passwordInvalid"
      )
      .refine((val) => !val.includes(" "), {
        message: "register.passwordNoSpaces",
      }),

    confirmPassword: z.string().min(1, "register.confirmPasswordRequired"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "register.passwordsMismatch",
    path: ["confirmPassword"],
  });

export type RegisterFormType = z.infer<typeof RegisterSchema>;

export const ForgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, { message: "forgot.emailRequired" })
    .max(50, { message: "forgot.emailTooLong" })
    .email({ message: "forgot.emailInvalid" })
    .refine((val) => !/\s/.test(val), {
      message: "forgot.emailNoSpaces",
    })
    .refine((val) => /^[\x00-\x7F]+$/.test(val), {
      message: "forgot.emailAsciiOnly",
    }),
});

export type ForgotPasswordFormType = z.infer<typeof ForgotPasswordSchema>;
