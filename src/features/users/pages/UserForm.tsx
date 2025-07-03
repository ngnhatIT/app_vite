import { useEffect, useState } from "react";
import { Form, Select, message, Checkbox, Spin } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import type { RootState, AppDispatch } from "../../../app/store";

import LabelComponent from "../../../components/LabelComponent";
import InputComponent from "../../../components/InputComponent";
import ButtonComponent from "../../../components/ButtonComponent";

import { createUserThunk, updateUserThunk } from "../userThunk";
import { UserSchema, type UserFormType } from "../userSchema";
import { userService } from "../userService";
import type { RoleDTO } from "../dto/RoleDTO";
import type { WorkSpaceDTO } from "../dto/WorkSpace.DTO";

const UserForm = ({
  mode = "create",
  userId,
  initialValues,
}: {
  mode?: "create" | "edit";
  userId?: string;
  initialValues?: Partial<UserFormType>;
}) => {
  const [form] = Form.useForm();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const isDark = useSelector((state: RootState) => state.theme.darkMode);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [roles, setRoles] = useState<RoleDTO[]>([]);
  const [wsps, setWsps] = useState<WorkSpaceDTO[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue(initialValues);
    }
  }, [initialValues, form]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [rolesRes, wspsRes] = await Promise.all([
          userService.getRoles(),
          userService.getWorkSpaces(),
        ]);
        setRoles(rolesRes);
        setWsps(wspsRes);
      } catch {
        message.error(t("user_list.role.fetchFailed"));
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const onFinish = async () => {
    const values = await form.validateFields();
    const parsed = UserSchema.safeParse(values);

    if (!parsed.success) {
      const fieldErrors = parsed.error.flatten().fieldErrors;

      form.setFields(
        Object.entries(fieldErrors).map(([name, errors]) => ({
          name: [name],
          errors: errors || [],
        }))
      );
      return;
    }

    form.setFields(
      Object.keys(values).map((name) => ({ name: [name], errors: [] }))
    );

    setIsSubmitting(true);
    try {
      if (mode === "edit" && userId) {
        await dispatch(
          updateUserThunk({ ...values, user_id: userId })
        ).unwrap();
        message.success(t("user_list.user.updated"));
      } else {
        await dispatch(createUserThunk(values)).unwrap();
        message.success(t("user_list.user.created"));
      }

      navigate("/users");
    } catch (err: any) {
      message.error(err?.message || t("user_list.form.submitFailed"));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full h-full max-w-[920px] mx-auto pt-8 ">
      <Spin spinning={loading}>
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          autoComplete="off"
          validateTrigger="onChange"
          className=""
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* LEFT COLUMN */}
            <div className="flex flex-col gap-6 w-full">
              <h3 className="text-xl font-semibold text-white mb-4">
                {t("user_list.basic_info") || "Basic Information"}
              </h3>

              <Form.Item
                name="username"
                label={
                  <LabelComponent label="Username" required isDark={isDark} />
                }
              >
                <InputComponent placeholder="Enter username" isDark={isDark} />
              </Form.Item>

              <Form.Item
                name="email"
                label={
                  <LabelComponent label="Email" required isDark={isDark} />
                }
              >
                <InputComponent placeholder="Enter email" isDark={isDark} />
              </Form.Item>

              <Form.Item
                name="password"
                label={
                  <LabelComponent label="Password" required isDark={isDark} />
                }
              >
                <InputComponent
                  type="password"
                  placeholder="Enter password"
                  isDark={isDark}
                />
              </Form.Item>

              <Form.Item
                name="confirm_password"
                label={
                  <LabelComponent
                    label="Confirm Password"
                    required
                    isDark={isDark}
                  />
                }
              >
                <InputComponent
                  type="password"
                  placeholder="Confirm password"
                  isDark={isDark}
                />
              </Form.Item>
            </div>

            {/* RIGHT COLUMN */}
            <div className="flex flex-col gap-6 w-full">
              <h3 className="text-xl font-semibold text-white mb-4">
                {t("user_list.permissions") || "User Permissions"}
              </h3>

              <Form.Item
                name="role"
                label={<LabelComponent label="Role" required isDark={isDark} />}
              >
                <Select
                  placeholder="Select role"
                  size="large"
                  loading={!roles.length}
                  className="rounded-md w-full"
                >
                  {roles.map((role) => (
                    <Select.Option key={role.role_id} value={role.role_id}>
                      {role.role_name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item
                name="workspace"
                label={<LabelComponent label="Workspace" isDark={isDark} />}
              >
                <Select
                  placeholder="Select workspace"
                  size="large"
                  loading={!wsps.length}
                  className="rounded-md w-full"
                >
                  {wsps.map((ws) => (
                    <Select.Option key={ws.workspaceId} value={ws.workspaceId}>
                      {ws.workspaceName}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item
                name="ip_check"
                valuePropName="checked"
                label={
                  <LabelComponent label="Enable IP Check" isDark={isDark} />
                }
              >
                <Checkbox />
              </Form.Item>
            </div>
          </div>

          {/* ACTION BUTTONS */}
          <div className="w-full flex flex-col md:flex-row justify-between gap-4 mt-10">
            <ButtonComponent
              onClick={() => navigate("/users")}
              className="flex-1"
              variant="secondary"
            >
              Back
            </ButtonComponent>

            <ButtonComponent
              htmlType="submit"
              variant="primary"
              loading={isSubmitting}
              className="flex-4"
            >
              {mode === "create" ? "Create User" : "Update User"}
            </ButtonComponent>
          </div>
        </Form>
      </Spin>
    </div>
  );
};

export default UserForm;
