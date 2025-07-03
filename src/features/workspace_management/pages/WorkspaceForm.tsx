import { useEffect } from "react";
import { Form, Input, Checkbox, Button, message } from "antd";
import { useTranslation } from "react-i18next";
import * as z from "zod";

const WorkspaceSchema = z.object({
  name: z.string().min(1, "workspace.validation.name"),
  owner: z.string().min(1, "workspace.validation.owner"),
  desc: z.string().optional(),
  usePassword: z.boolean().optional(),
  password: z.string().optional(),
  confirm: z.string().optional(),
});

const WorkspaceForm = ({
  initialValues,
  onSubmit,
}: {
  initialValues?: any;
  onSubmit: (data: any) => void;
}) => {
  const [form] = Form.useForm();
  const { t } = useTranslation();

  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue(initialValues);
    } else {
      form.resetFields();
    }
  }, [initialValues]);

  const handleFinish = async (values: any) => {
    const result = WorkspaceSchema.safeParse(values);

    if (!result.success) {
      const errorMsg = Object.values(
        result.error.flatten().fieldErrors
      )[0]?.[0];
      message.error(t(errorMsg) || t("common.error"));
      return;
    }

    if (values.usePassword && values.password !== values.confirm) {
      message.error(t("workspace.validation.passwordNotMatch"));
      return;
    }

    onSubmit({
      name: values.name,
      owner: values.owner,
      desc: values.desc,
      password: values.usePassword ? values.password : undefined,
    });
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleFinish}
      autoComplete="off"
      className="w-full max-w-lg bg-[#1e1e2f] p-6 rounded-xl shadow-lg"
    >
      <Form.Item
        name="name"
        label={t("workspace.name")}
        rules={[{ required: true, message: t("workspace.validation.name") }]}
      >
        <Input placeholder={t("workspace.name")} />
      </Form.Item>

      <Form.Item
        name="owner"
        label={t("workspace.owner")}
        rules={[{ required: true, message: t("workspace.validation.owner") }]}
      >
        <Input placeholder={t("workspace.owner")} />
      </Form.Item>

      <Form.Item name="desc" label={t("workspace.desc")}>
        <Input.TextArea placeholder={t("workspace.desc")} />
      </Form.Item>

      <Form.Item name="usePassword" valuePropName="checked">
        <Checkbox>{t("workspace.usePassword")}</Checkbox>
      </Form.Item>

      <Form.Item noStyle shouldUpdate>
        {() =>
          form.getFieldValue("usePassword") && (
            <>
              <Form.Item
                name="password"
                label={t("workspace.password")}
                rules={[
                  {
                    required: true,
                    message: t("workspace.validation.password"),
                  },
                ]}
              >
                <Input.Password placeholder={t("workspace.password")} />
              </Form.Item>

              <Form.Item
                name="confirm"
                label={t("workspace.confirmPassword")}
                rules={[
                  {
                    required: true,
                    message: t("workspace.validation.confirmPassword"),
                  },
                ]}
              >
                <Input.Password placeholder={t("workspace.confirmPassword")} />
              </Form.Item>
            </>
          )
        }
      </Form.Item>

      <div className="flex justify-end mt-4">
        <Button type="primary" htmlType="submit">
          {t("common.submit")}
        </Button>
      </div>
    </Form>
  );
};

export default WorkspaceForm;
