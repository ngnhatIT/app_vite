import { useEffect, useState } from "react";
import { Modal, message, Checkbox, Input } from "antd";
import { useTranslation } from "react-i18next";
import * as z from "zod";

const ModalWorkspace = ({
  visible,
  onClose,
  onSubmit,
  initialValues,
}: {
  visible: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  initialValues?: any;
}) => {
  const { t } = useTranslation();

  const [name, setName] = useState("");
  const [owner, setOwner] = useState("");
  const [desc, setDesc] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [usePassword, setUsePassword] = useState(false);

  useEffect(() => {
    if (initialValues) {
      setName(initialValues.name || "");
      setOwner(initialValues.owner || "");
      setDesc(initialValues.desc || "");
      setUsePassword(!!initialValues.password);
      setPassword(initialValues.password || "");
      setConfirm(initialValues.password || "");
    } else {
      setName("");
      setOwner("");
      setDesc("");
      setUsePassword(false);
      setPassword("");
      setConfirm("");
    }
  }, [initialValues, visible]);

  const WorkspaceSchema = z.object({
    name: z.string().min(1, t("workspace.validation.name")),
    owner: z.string().min(1, t("workspace.validation.owner")),
    desc: z.string().optional(),
    password: z.string().optional(),
    confirm: z.string().optional(),
    usePassword: z.boolean(),
  });

  const handleOk = () => {
    const data = {
      name,
      owner,
      desc,
      password: usePassword ? password : undefined,
      confirm: usePassword ? confirm : undefined,
      usePassword,
    };

    const result = WorkspaceSchema.safeParse(data);
    if (!result.success) {
      const errorMsg = Object.values(
        result.error.flatten().fieldErrors
      )[0]?.[0];
      return message.error(errorMsg || t("common.error"));
    }

    if (usePassword && password !== confirm) {
      return message.error(t("workspace.validation.passwordNotMatch"));
    }

    onSubmit({
      name,
      owner,
      desc,
      password: usePassword ? password : undefined,
    });
  };

  return (
    <Modal
      open={visible}
      onCancel={onClose}
      onOk={handleOk}
      title={
        initialValues ? t("workspace.editTitle") : t("workspace.createTitle")
      }
      okText={initialValues ? t("common.update") : t("common.create")}
      cancelText={t("common.cancel")}
    >
      <div className="flex flex-col gap-4">
        <Input
          placeholder={t("workspace.name")}
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <Input
          placeholder={t("workspace.owner")}
          value={owner}
          onChange={(e) => setOwner(e.target.value)}
        />
        <Input.TextArea
          placeholder={t("workspace.desc")}
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
        />
        <Checkbox
          checked={usePassword}
          onChange={(e) => setUsePassword(e.target.checked)}
        >
          {t("workspace.usePassword")}
        </Checkbox>
        {usePassword && (
          <>
            <Input.Password
              placeholder={t("workspace.password")}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Input.Password
              placeholder={t("workspace.confirmPassword")}
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
            />
          </>
        )}
      </div>
    </Modal>
  );
};

export default ModalWorkspace;
