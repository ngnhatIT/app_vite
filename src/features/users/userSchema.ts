import { z } from "zod";

export const UserSchema = z
  .object({
    username: z.string().min(1, "Username is required"),
    email: z.string().email("Invalid email").nonempty("Email is required"),
    fullname: z.string().min(1, "Full name is required"),
    password: z.string().optional(),
    confirm_password: z.string().optional(),
    role: z.string().min(1, "Role is required"),
    workspace: z.string().optional(),
    ip_check: z.boolean().optional(),
  })
  .refine(
    (data) => {
      if (data.password || data.confirm_password) {
        return data.password === data.confirm_password;
      }
      return true;
    },
    {
      message: "Passwords do not match",
      path: ["confirm_password"],
    }
  );

export type UserFormType = z.infer<typeof UserSchema>;
