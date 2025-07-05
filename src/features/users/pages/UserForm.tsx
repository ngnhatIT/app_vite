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
import { UserCreateSchema, UserUpdateSchema } from "../userSchema";
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
          await dispatch(getUserDetailThunk(userId))
            .unwrap()
            .then((detail) => form.setFieldsValue(detail))
            .catch((err) =>
              message.error(err?.message || t("user_list.form.fetchFailed"))
            );
        }
      } catch (err: any) {
        message.error(err?.message || t("user_list.role.fetchFailed"));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [dispatch, form, mode, userId, t]);

  const onFinish = async () => {
    const values = await form.validateFields();
    const schemaToUse = mode === "edit" ? UserUpdateSchema : UserCreateSchema;

    const parsed = schemaToUse.safeParse(values);

    if (!parsed.success) {
      const errorMap = parsed.error.format();

      form.setFields(
        Object.entries(errorMap)
          .filter(([key]) => key !== "_errors")
          .map(([key, val]) => ({
            name: key,
            errors: Array.isArray(val) ? val : val?._errors ?? [],
          }))
      );

      if (errorMap._errors?.length) {
        message.error(errorMap._errors.join(", "));
      }

      return;
    }

    form.setFields(
      Object.keys(values).map((name) => ({ name: [name], errors: [] }))
    );

    setIsSubmitting(true);
    try {
      if (mode === "edit" && userId) {
        await dispatch(updateUserThunk({ ...values, user_id: userId }))
          .unwrap()
          .then(() => message.success(t("user_list.user.updated")));
      } else {
        await dispatch(createUserThunk(values))
          .unwrap()
          .then(() => message.success(t("user_list.user.created")));
      }

      navigate("/users");
    } catch (err: any) {
      console.error(err);
      message.error(err?.message || t("user_list.form.submitFailed"));
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
                    label="user_form.username_label"
                    required
                    isDark={isDark}
                  />
                }
              >
                <InputComponent
                  placeholder={t("user_form.username_placeholder")}
                  isDark={isDark}
                />
              </Form.Item>

              <Form.Item
                name="email"
                label={
                  <LabelComponent
                    label="user_form.email_label"
                    required
                    isDark={isDark}
                  />
                }
              >
                <InputComponent
                  placeholder={t("user_form.email_placeholder")}
                  isDark={isDark}
                />
              </Form.Item>

              <Form.Item
                name="fullname"
                label={
                  <LabelComponent
                    label="user_form.fullname_label"
                    required
                    isDark={isDark}
                  />
                }
              >
                <InputComponent
                  placeholder={t("user_form.fullname_placeholder")}
                  isDark={isDark}
                />
              </Form.Item>

              <Form.Item
                name="password"
                label={
                  <LabelComponent
                    label="user_form.password_label"
                    required={mode === "create"}
                    isDark={isDark}
                  />
                }
              >
                <InputComponent
                  type="password"
                  placeholder={t("user_form.password_placeholder")}
                  isDark={isDark}
                />
              </Form.Item>

              <Form.Item
                name="confirm_password"
                label={
                  <LabelComponent
                    label="user_form.confirm_password_label"
                    required={mode === "create"}
                    isDark={isDark}
                  />
                }
              >
                <InputComponent
                  type="password"
                  placeholder={t("user_form.confirm_password_placeholder")}
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
                    label="user_form.role_label"
                    required
                    isDark={isDark}
                  />
                }
              >
                <Select
                  placeholder={t("user_form.role_placeholder")}
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
                    label="user_form.workspace_label"
                    isDark={isDark}
                  />
                }
              >
                <Select
                  placeholder={t("user_form.workspace_placeholder")}
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
                  <LabelComponent label="user_form.ip_check" isDark={isDark} />
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
