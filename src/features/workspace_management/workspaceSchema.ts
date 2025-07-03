import * as z from "zod";

export const workspaceSchema = z
  .object({
    name: z.string().min(1, { message: "workspace.validation.name" }),
    owner: z.string().min(1, { message: "workspace.validation.owner" }),
    desc: z.string().optional(),
    usePassword: z.boolean().optional(),
    password: z.string().optional(),
    confirm: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.usePassword) {
        return data.password === data.confirm;
      }
      return true;
    },
    {
      message: "workspace.validation.passwordNotMatch",
      path: ["confirm"],
    }
  );
