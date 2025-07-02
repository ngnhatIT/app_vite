import { z } from "zod";

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
      .email({ message: "register.emailInvalid" }) // ví dụ: thiếu @, thiếu domain, v.v.
      .refine((val) => !/\s/.test(val), {
        message: "register.emailNoSpaces", // Email không được chứa khoảng trắng
      })
      .refine((val) => /^[\x00-\x7F]+$/.test(val), {
        message: "register.emailAsciiOnly", // Email không được có dấu (chỉ cho phép ký tự không dấu, chuẩn ASCII)
      }),

    fullName:z
      .string()
      .min(4,"")
      .max(50,"")
      .regex(/^\S+$/, "register.usernameNoSpaces"),

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
