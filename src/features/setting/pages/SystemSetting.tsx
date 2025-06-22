import {
  Form,
  Input,
  InputNumber,
  Typography,
  Button,
  Row,
  Col,
  message,
} from "antd";
import { useEffect } from "react";

const { Title } = Typography;

interface SystemSettings {
  passwordExpirationDays: number;
  maxFailedLoginAttempts: number;
  autoLogoutMinutes: number;
  smtpServer: string;
  smtpPort: number;
  alertEmail: string;
  mailPassword: string;
}

export default function SystemSettings() {
  const [form] = Form.useForm();

  useEffect(() => {
    const defaults: SystemSettings = {
      passwordExpirationDays: 30,
      maxFailedLoginAttempts: 5,
      autoLogoutMinutes: 60,
      smtpServer: "smtp.example.com",
      smtpPort: 5501,
      alertEmail: "security@example.com",
      mailPassword: "********",
    };
    form.setFieldsValue(defaults);
  }, [form]);

  const onFinish = (values: SystemSettings) => {
    console.log("Submit values:", values);
    message.success("Saved system configuration successfully.");
  };

  const panelStyle = {
    borderRadius: 24,
    background:
      "linear-gradient(238deg, rgba(13, 4, 24, 0.54) 30.62%, rgba(22, 3, 53, 0.54) 100%)",
    backdropFilter: "blur(12px)",
    padding: 24,
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "flex-start" as const,
    gap: 24,
  };

  return (
    <div className="flex flex-wrap w-full gap-6">
      {/* Privacy Policy Panel */}
      <div style={{ ...panelStyle, flex: 1, minWidth: 300, maxWidth: "48%" }}>
        <Title level={4} className="text-white m-0">
          Privacy Policy
        </Title>

        <Form layout="vertical" form={form} onFinish={onFinish} className="w-full">
          <Form.Item
            name="passwordExpirationDays"
            label={<span className="text-white">Password Expiration Date (Day) <span className="text-red-500">*</span></span>}
            rules={[{ required: true, type: "number", min: 1 }]}
          >
            <InputNumber className="w-full" />
          </Form.Item>

          <Form.Item
            name="maxFailedLoginAttempts"
            label={<span className="text-white">Maximum Number Of Failed Login Attempts <span className="text-red-500">*</span></span>}
            rules={[{ required: true, type: "number", min: 1 }]}
          >
            <InputNumber className="w-full" />
          </Form.Item>

          <Form.Item
            name="autoLogoutMinutes"
            label={<span className="text-white">Auto logout (Minute) <span className="text-red-500">*</span></span>}
            rules={[{ required: true, type: "number", min: 1 }]}
          >
            <InputNumber className="w-full" />
          </Form.Item>
        </Form>
      </div>

      {/* Email System Panel */}
      <div style={{ ...panelStyle, flex: 1, minWidth: 300, maxWidth: "48%" }}>
        <Title level={4} className="text-white m-0">
          Setting Email System
        </Title>

        <Form layout="vertical" form={form} onFinish={onFinish} className="w-full">
          <Form.Item
            name="smtpServer"
            label={<span className="text-white">SMTP Server <span className="text-red-500">*</span></span>}
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="alertEmail"
            label={<span className="text-white">Email System <span className="text-red-500">*</span></span>}
            rules={[{ required: true, type: "email" }]}
          >
            <Input />
          </Form.Item>

          <Row gutter={12}>
            <Col span={12}>
              <Form.Item
                name="smtpPort"
                label={<span className="text-white">Port <span className="text-red-500">*</span></span>}
                rules={[{ required: true, type: "number" }]}
              >
                <InputNumber className="w-full" min={1} max={65535} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="mailPassword"
                label={<span className="text-white">Mail Password <span className="text-red-500">*</span></span>}
                rules={[{ required: true }]}
              >
                <Input.Password />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </div>

      {/* Button Actions */}
      <div className="w-full flex justify-end gap-4 mt-4 pr-4">
        <Button size="large">Cancel</Button>
        <Button type="primary" size="large" onClick={() => form.submit()}>
          Save
        </Button>
      </div>
    </div>
  );
}
