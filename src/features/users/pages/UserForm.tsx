import { useEffect, useState } from "react";
import { Form, Select, message, Button, Spin } from "antd";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";

import LabelComponent from "../../../components/LabelComponent";
import InputComponent from "../../../components/InputComponent";
import PrimaryButton from "../../../components/ButtonComponent";

import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../../app/store";
import {
  createUserThunk,
  updateUserThunk,
  getUserDetailThunk,
} from "../userThunk";
import { userService } from "../userService";
import type { RoleDTO } from "../dto/RoleDTO";

const workspaces = ["ws1", "ws2"];

const UserForm: React.FC = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { state } = useLocation();
  const dispatch = useDispatch<AppDispatch>();
  const userId = state?.user_id;
  const isEdit = !!userId;

  const { t } = useTranslation();
  const isDark = useSelector((state: RootState) => state.theme.darkMode);
  const currentUser = useSelector((state: RootState) => state.user.selectedUser);

  const [roles, setRoles] = useState<RoleDTO[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isEdit && userId) {
      setLoading(true);
      dispatch(getUserDetailThunk(userId)).finally(() => setLoading(false));
    }
  }, [isEdit, userId]);

  useEffect(() => {
    console.log("Current user:", currentUser);
    if (isEdit && currentUser) {
      form.setFieldsValue(currentUser);
    }
  }, [currentUser]);

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const res = await userService.getRoles();
        setRoles(res);
      } catch {
        message.error(t("role.fetchFailed") || "Failed to load roles");
      }
    };
    fetchRoles();
  }, []);

  const onFinish = async (values: any) => {
    setSubmitting(true);
    try {
      if (isEdit && userId) {
        await dispatch(
          updateUserThunk({ ...values, user_id: userId })
        ).unwrap();
        message.success(t("user.updated"));
      } else {
        await dispatch(createUserThunk(values)).unwrap();
        message.success(t("user.created"));
      }
      navigate("/users");
    } catch {
      message.error(t("form.submitFailed"));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full px-6 py-4">
      <div className="w-full h-full max-w-[1180px] mx-auto">
        <Spin spinning={loading} size="large">
          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            autoComplete="off"
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
                    <LabelComponent
                      isDark={isDark}
                      label={t("Email")}
                      required
                    />
                  }
                  name="email"
                  rules={[
                    { required: true, message: t("email.required") },
                    { type: "email", message: t("email.invalid") },
                  ]}
                >
                  <InputComponent
                    placeholder={t("Enter email")}
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
                  rules={[
                    { required: !isEdit, message: t("password.required") },
                  ]}
                >
                  <InputComponent
                    type="password"
                    placeholder={t("Enter password")}
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
                  name="confirm_password"
                  dependencies={["password"]}
                  rules={[
                    {
                      required: !isEdit,
                      message: t("confirmPassword.required"),
                    },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (!value || getFieldValue("password") === value) {
                          return Promise.resolve();
                        }
                        return Promise.reject(
                          new Error(t("password.notMatch"))
                        );
                      },
                    }),
                  ]}
                >
                  <InputComponent
                    type="password"
                    placeholder={t("Re-enter password")}
                    height={48}
                    isDark={isDark}
                  />
                </Form.Item>
              </div>

              <div className="flex flex-col gap-6">
                <Form.Item
                  label={
                    <LabelComponent
                      isDark={isDark}
                      label={t("Role")}
                      required
                    />
                  }
                  name="role"
                  rules={[{ required: true, message: t("role.required") }]}
                >
                  <Select
                    placeholder={t("Select role")}
                    size="large"
                    loading={!roles.length}
                    className="rounded-md bg-[#1A132D] text-white border border-[#2f2542]"
                  >
                    {roles.map((role) => (
                      <Select.Option key={role.role_id} value={role.role_id}>
                        {role.role_name}
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
                    {workspaces.map((ws) => (
                      <Select.Option key={ws} value={ws}>
                        {ws}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </div>
            </div>

            <div className="w-full flex flex-col md:flex-row justify-between gap-4 mt-10">
              <Button
                icon={<ArrowLeftOutlined />}
                size="large"
                onClick={() => navigate("/users")}
                className="flex-1 h-12 text-white text-sm rounded-lg bg-[#292929] border-none hover:opacity-80 max-w-[160px]"
                style={{
                  background: "rgba(255,255,255,0.1)",
                  border: "1px solid #4b3b61",
                }}
              >
                {t("Back")}
              </Button>

              <PrimaryButton
                htmlType="submit"
                className="px-10 max-w-[160px]"
                loading={submitting}
              >
                {isEdit ? t("Update User") : t("Create User")}
              </PrimaryButton>
            </div>
          </Form>
        </Spin>
      </div>
    </div>
  );
};

export default UserForm;
