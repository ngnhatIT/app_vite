import { useEffect, useState } from "react";
import { Form, Select, message, Checkbox, Spin } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import type { AppDispatch, RootState } from "../../../app/store";

import LabelComponent from "../../../components/LabelComponent";
import InputComponent from "../../../components/InputComponent";
import ButtonComponent from "../../../components/ButtonComponent";

import {
  createUserThunk,
  updateUserThunk,
  getUserDetailThunk,
} from "../userThunk";
import { UserSchema, type UserFormType } from "../userSchema";
import { userService } from "../userService";
import type { RoleDTO } from "../dto/RoleDTO";
import type { WorkSpaceDTO } from "../dto/WorkSpace.DTO";

const UserForm = () => {
  const [form] = Form.useForm();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();

  const isDark = useSelector((state: RootState) => state.theme.darkMode);

  const userId = location.state?.userId;
  const mode = userId ? "edit" : "create";

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(false);

  const [roles, setRoles] = useState<RoleDTO[]>([]);
  const [wsps, setWsps] = useState<WorkSpaceDTO[]>([]);

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

        if (mode === "edit" && userId) {
          const detail = await dispatch(getUserDetailThunk(userId)).unwrap();
          form.setFieldsValue(detail);
        }
      } catch {
        message.error(t("user_list.role.fetchFailed"));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [dispatch, form, mode, userId, t]);

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
      message.error(err?.message ?? t("user_list.form.submitFailed"));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full h-full max-w-[920px] mx-auto pt-8">
      <Spin spinning={loading}>
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          autoComplete="off"
          validateTrigger="onChange"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* LEFT COLUMN */}
            <div className="flex flex-col gap-6 w-full">
              <LabelComponent
                label="user_list.basic_info"
                as="h3"
                isDark={isDark}
                className="text-xl font-semibold mb-4"
              />

              <Form.Item
                name="username"
                label={
                  <LabelComponent
                    label="user_list.form.username"
                    required
                    isDark={isDark}
                  />
                }
              >
                <InputComponent placeholder="Enter username" isDark={isDark} />
              </Form.Item>

              <Form.Item
                name="email"
                label={
                  <LabelComponent
                    label="user_list.form.email"
                    required
                    isDark={isDark}
                  />
                }
              >
                <InputComponent placeholder="Enter email" isDark={isDark} />
              </Form.Item>

              <Form.Item
                name="password"
                label={
                  <LabelComponent
                    label="user_list.form.password"
                    required
                    isDark={isDark}
                  />
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
                    label="user_list.form.confirm_password"
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
              <LabelComponent
                label="user_list.permissions"
                as="h3"
                isDark={isDark}
                className="text-xl font-semibold mb-4"
              />

              <Form.Item
                name="role"
                label={
                  <LabelComponent
                    label="user_list.form.role"
                    required
                    isDark={isDark}
                  />
                }
              >
                <Select
                  placeholder="Select role"
                  size="large"
                  style={{ height: 42 }}
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
                label={
                  <LabelComponent
                    label="user_list.form.workspace"
                    isDark={isDark}
                  />
                }
              >
                <Select
                  placeholder="Select workspace"
                  size="large"
                  loading={!wsps.length}
                  className="rounded-md w-full"
                  style={{ height: 42 }}
                  disabled={mode === "edit"}
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
                  <LabelComponent
                    label="user_list.form.ip_check"
                    isDark={isDark}
                  />
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
              isDark={isDark}
            >
              {t("user_list.button.back")}
            </ButtonComponent>

            <ButtonComponent
              htmlType="submit"
              variant="primary"
              loading={isSubmitting}
              isDark={isDark}
              className="flex-1"
            >
              {mode === "create"
                ? t("user_list.button.create")
                : t("user_list.button.update")}
            </ButtonComponent>
          </div>
        </Form>
      </Spin>
    </div>
  );
};

export default UserForm;
