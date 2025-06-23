import { useState, useEffect } from "react";
import { Form, Select, Breadcrumb, message, Button } from "antd";
import { useNavigate, useParams, Link } from "react-router-dom";
import { HomeOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import { theme as antdTheme } from "antd";

import { useTranslation } from "react-i18next";
import LabelComponent from "../../../components/LabelComponent";
import InputComponent from "../../../components/InputComponent";
import PrimaryButton from "../../../components/ButtonPrimary";
import { useSelector } from "react-redux";
import type { RootState } from "../../../app/store";

const roles = ["Admin", "Manager", "User"];

interface User {
  id?: number;
  firstname: string;
  lastname: string;
  username: string;
  email: string;
  role: string;
  password?: string;
  confirmPassword?: string;
}

const UserForm: React.FC = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { userId } = useParams<{ userId?: string }>();
  const [isEditing, setIsEditing] = useState(false);
  const [isNewUser, setIsNewUser] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    if (userId) {
      setIsEditing(true);
      const user = {
        id: Number(userId),
        firstname: "Nguyễn",
        lastname: "Khánh Nhật",
        username: "nhat123",
        email: "nhat@gmail.com",
        role: "Admin",
      };
      form.setFieldsValue(user);
    } else {
      setIsNewUser(true);
      form.setFieldsValue({
        firstname: "",
        lastname: "",
        username: "",
        email: "",
        role: "",
      });
    }
  }, [userId, form]);

  const onFinish = (values: User) => {
    if (isNewUser && values.password !== values.confirmPassword) {
      message.error(t("password.notMatch"));
      return;
    }
    const currentDate = new Date().toLocaleString("vi-VN", {
      timeZone: "Asia/Ho_Chi_Minh",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
    console.log("Submit user:", {
      ...values,
      createdAt: isNewUser ? currentDate : undefined,
      updatedAt: isEditing ? currentDate : undefined,
    });
    message.success(isEditing ? t("user.updated") : t("user.created"));
    navigate("/users");
  };

  const onFinishFailed = () => {
    message.error(t("form.invalid"));
  };

  const isDark = useSelector((state: RootState) => state.theme.darkMode);

  return (
    <div className=" flex items-center justify-center px-4 py-10 ">
      <div className="w-full max-w-[1180px]  rounded-[32px] px-6 md:px-10 py-10 md:py-14 shadow-lg">
        <Form
          layout="vertical"
          form={form}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="flex flex-col gap-6">
              <Form.Item
                label={
                  <LabelComponent
                    isDark={isDark}
                    label={t("Username")}
                    required
                  />
                }
                name="username"
                rules={[{ required: true, message: t("username.required") }]}
              >
                <InputComponent
                  placeholder={t("Enter username")}
                  height={48}
                  isDark={isDark}
                />
              </Form.Item>

              <Form.Item
                label={
                  <LabelComponent isDark={isDark} label={t("Email")} required />
                }
                name="email"
                rules={[
                  {
                    required: true,
                    type: "email",
                    message: t("email.invalid"),
                  },
                ]}
              >
                <InputComponent
                  placeholder={t("Enter your email")}
                  height={48}
                  isDark={isDark}
                />
              </Form.Item>

              <Form.Item
                label={
                  <LabelComponent
                    isDark={isDark}
                    label={t("Password")}
                    required
                  />
                }
                name="password"
                rules={[{ required: true, message: t("password.required") }]}
              >
                <InputComponent
                  type="password"
                  placeholder={t("Enter your password")}
                  height={48}
                  isDark={isDark}
                />
              </Form.Item>

              <Form.Item
                label={
                  <LabelComponent
                    isDark={isDark}
                    label={t("Confirm Password")}
                    required
                  />
                }
                name="confirmPassword"
                dependencies={["password"]}
                rules={[
                  { required: true, message: t("confirmPassword.required") },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue("password") === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error(t("password.notMatch")));
                    },
                  }),
                ]}
              >
                <InputComponent
                  type="password"
                  placeholder={t("Re-enter your password")}
                  height={48}
                  isDark={isDark}
                />
              </Form.Item>
            </div>

            <div className="flex flex-col gap-6">
              <Form.Item
                label={
                  <LabelComponent isDark={isDark} label={t("Role")} required />
                }
                name="role"
                rules={[{ required: true, message: t("role.required") }]}
              >
                <Select
                  placeholder={t("Select role")}
                  size="large"
                  className="rounded-md bg-[#1A132D] text-white border border-[#2f2542]"
                >
                  {roles.map((role) => (
                    <Select.Option key={role} value={role}>
                      {role}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item
                label={
                  <LabelComponent isDark={isDark} label={t("Workspace")} />
                }
                name="workspace"
              >
                <Select
                  placeholder={t("Select workspace")}
                  size="large"
                  className="rounded-md bg-[#1A132D] text-white border border-[#2f2542]"
                >
                  <Select.Option value="ws1">Workspace 1</Select.Option>
                  <Select.Option value="ws2">Workspace 2</Select.Option>
                </Select>
              </Form.Item>
            </div>
          </div>

          <div className="w-full flex justify-between gap-40 mt-10">
            <Button
              icon={<ArrowLeftOutlined />}
              size="large"
              onClick={() => navigate("/auth/login")}
              className="flex-1 h-12 text-white font-['Poppins'] text-sm rounded-lg bg-[#292929] border-none hover:opacity-80 max-w-[160px]"
              style={{
                background: "rgba(255,255,255,0.1)",
                border: "1px solid #4b3b61",
                height: "48px",
              }}
            >
              Back
            </Button>

            <PrimaryButton htmlType="submit" className="px-10 max-w-[160px]">
              {t("Create User")}
            </PrimaryButton>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default UserForm;
