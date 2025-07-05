import { z } from "zod";
import i18n from "../../i18n/i18n";

const t = i18n.t.bind(i18n);

export const UserBaseSchema = z.object({
  username: z
    .string()
    .min(1, { message: t("user_form.username.required") })
    .regex(/^\S+$/, { message: t("user_form.username.no_space") }),

  email: z
    .string()
    .min(1, { message: t("user_form.email.required") })
    .regex(
      /^[a-zA-Z0-9]+([._+-]?[a-zA-Z0-9]+)*@[a-zA-Z0-9-]+(\.[a-zA-Z]{2,})+$/,
      { message: t("user_form.email.invalid") }
    ),

  fullname: z
    .string()
    .min(2, { message: t("user_form.fullname.min") })
    .max(100, { message: t("user_form.fullname.max") }),

  password: z
    .string()
    .optional()
    .refine(
      (val) =>
        !val ||
        /^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>])(?=.*[a-zA-Z])(?=.*\d).{8,12}$/.test(
          val
        ),
      {
        message: t("user_form.password.invalid"),
      }
    ),

  confirm_password: z.string().optional(),

  role: z.string().min(1, { message: t("user_form.role.required") }),

  workspace: z.string().optional(),

  ip_check: z.boolean().optional(),
});

// CREATE: với refine check confirm_password
export const UserCreateSchema = UserBaseSchema.refine(
  (data) => {
    if (data.password || data.confirm_password) {
      return data.password === data.confirm_password;
    }
    return true;
  },
  {
    message: t("user_form.confirm_password.mismatch"),
    path: ["confirm_password"],
  }
);

// UPDATE: bỏ password & confirm_password
export const UserUpdateSchema = UserBaseSchema.omit({
  password: true,
  confirm_password: true,
});

export type UserFormType = z.infer<typeof UserCreateSchema>;
export type UserUpdateFormType = z.infer<typeof UserUpdateSchema>;
