import {
  Modal,
  Upload,
  Avatar,
  Table,
  Spin,
  Select,
  Checkbox,
  message,
} from "antd";
import { UploadOutlined, DeleteOutlined } from "@ant-design/icons";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import type { RootState } from "../../../app/store";

import InputComponent from "../../../components/InputComponent";
import ButtonComponent from "../../../components/ButtonComponent";
import LabelComponent from "../../../components/LabelComponent";
import { handleApiCall } from "../../../api/HandApiCall";
import axiosInstance from "../../../api/AxiosIntance";

const getModalClassName = (isDark: boolean) => `
  [&_.ant-modal-content]:!backdrop-blur-md
  [&_.ant-modal-content]:!border
  [&_.ant-modal-content]:!rounded-xl
  [&_.ant-modal-header]:!border-none
  [&_.ant-modal-footer]:!border-none
  [&_.ant-modal-header]:!bg-transparent
  [&_.ant-modal-footer]:!bg-transparent
  ${
    isDark
      ? `[&_.ant-modal-content]:!bg-gradient-to-br [&_.ant-modal-content]:!from-[#1f1c2c] [&_.ant-modal-content]:!to-[#928dab] [&_.ant-modal-content]:!border-purple-500`
      : `[&_.ant-modal-content]:!bg-white [&_.ant-modal-content]:!text-black [&_.ant-modal-content]:!border-gray-300`
  }
`;

type User = {
  user_id: string;
  username: string;
  fullname?: string;
  email?: string;
  avatar?: string;
};

// Add/Edit Workspace
export const AddEditWorkspaceModal = ({ open, onClose, onSubmit, initialData }: {
  open: boolean; onClose: () => void; onSubmit: (data: any) => void; initialData?: any;
}) => {
  const { t } = useTranslation();
  const isDark = useSelector((s: RootState) => s.theme.darkMode);

  const [name, setName] = useState(initialData?.name || "");
  const [owner, setOwner] = useState(initialData?.owner || "");
  const [desc, setDesc] = useState(initialData?.desc || "");
  const [file, setFile] = useState<File | null>(null);
  const [usePassword, setUsePassword] = useState(false);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const handleOk = () => {
    if (!name || !owner) return message.warning(t("workspace.requiredFields"));
    if (usePassword && password !== confirm) return message.error(t("workspace.passwordMismatch"));
    onSubmit({ name, owner, desc, file, password: usePassword ? password : undefined });
  };

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      className={getModalClassName(isDark)}
      centered
      title={<LabelComponent label={initialData ? "workspace.editTitle" : "workspace.createTitle"} isDark />}
    >
      <div className="flex flex-col gap-3">
        <LabelComponent label="workspace.name" isDark />
        <InputComponent value={name} onChange={(e) => setName(e.target.value)} isDark />

        <LabelComponent label="workspace.owner" isDark />
        <Select value={owner} onChange={setOwner} className="w-full">
          {/* Owner options */}
        </Select>

        <LabelComponent label="workspace.description" isDark />
        <InputComponent value={desc} onChange={(e) => setDesc(e.target.value)} isDark />

        <LabelComponent label="workspace.googleService" isDark />
        <Upload beforeUpload={(f) => { setFile(f); return false; }} showUploadList={false}>
          <ButtonComponent icon={<UploadOutlined />} isDark>
            {t("workspace.uploadGoogleService")}
          </ButtonComponent>
        </Upload>

        <Checkbox checked={usePassword} onChange={(e) => setUsePassword(e.target.checked)}>
          {t("workspace.enablePassword")}
        </Checkbox>

        {usePassword && (
          <>
            <LabelComponent label="workspace.password" isDark />
            <InputComponent type="password" value={password} onChange={(e) => setPassword(e.target.value)} isDark />
            <LabelComponent label="workspace.confirmPassword" isDark />
            <InputComponent type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} isDark />
          </>
        )}

        <div className="flex justify-end mt-4 gap-2">
          <ButtonComponent onClick={onClose} isDark>{t("common.cancel")}</ButtonComponent>
          <ButtonComponent onClick={handleOk} isDark>{t("common.save")}</ButtonComponent>
        </div>
      </div>
    </Modal>
  );
};

// Manage Members
export const ManageMembersModal = ({
  open,
  onClose,
  workspaceId,
  onDeleteMembers,
}: {
  open: boolean;
  onClose: () => void;
  workspaceId: string;
  onDeleteMembers: (ids: string[]) => Promise<"ok" | "error">;
}) => {
  const { t } = useTranslation();
  const isDark = useSelector((s: RootState) => s.theme.darkMode);
  const [loading, setLoading] = useState(false);
  const [members, setMembers] = useState<User[]>([]);
  const [selected, setSelected] = useState<string[]>([]);

  useEffect(() => {
    if (open) {
      setLoading(true);
      handleApiCall<User[]>(async () => {
        const res = await axiosInstance.get<{ data: User[] }>(
          `system/workspaces/${workspaceId}/members`
        );
        return res.data.data;
      }).then((result) => {
        setMembers(result || []);
        if (!result) message.error(t("workspace.fetchMembersFailed"));
        setLoading(false);
        setSelected([]);
      });
    }
  }, [open, workspaceId, t]);

  const handleDelete = async (ids: string[]) => {
    const result = await onDeleteMembers(ids);
    if (result === "ok") {
      setMembers(prev => prev.filter(m => !ids.includes(m.user_id)));
      setSelected([]);
    } else {
      message.error(t("common.error"));
    }
  };

  const columns = [
    {
      title: "#",
      render: (_: any, __: any, idx: number) => (
        <span className="text-white">{idx + 1}</span>
      ),
      width: 50,
    },
    {
      title: t("workspace.username"),
      dataIndex: "username",
      render: (_: any, record: User) => (
        <div className="flex gap-2 items-center">
          <Avatar src={record.avatar} />
          <div>
            <div className="text-white">{record.username || "-"}</div>
            <div className="text-gray-400 text-xs">{record.fullname || "-"}</div>
          </div>
        </div>
      ),
    },
    {
      title: t("common.action"),
      render: (_: any, record: User) => (
        <DeleteOutlined
          className="text-red-500 cursor-pointer"
          onClick={() => handleDelete([record.user_id])}
        />
      ),
    },
  ];

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      centered
      className={getModalClassName(isDark)}
      title={<LabelComponent label="workspace.memberListing" isDark />}
    >
      <Spin spinning={loading}>
        <Table
          rowKey="user_id"
          rowSelection={{
            selectedRowKeys: selected,
            onChange: (keys) => setSelected(keys as string[]),
          }}
          columns={columns}
          dataSource={members}
          pagination={false}
          className={`
            custom-table
            [&_.ant-table]:!bg-transparent
            [&_.ant-table-container]:!bg-transparent
            [&_.ant-table-content]:!bg-transparent
            [&_.ant-table-thead>tr>th]:!bg-transparent
            [&_.ant-table-thead>tr>th]:!text-white
            [&_.ant-table-tbody>tr>td]:!bg-transparent
            [&_.ant-table-tbody>tr>td]:!text-white
            [&_.ant-table-placeholder]:!bg-transparent
          `}
        />
        <div className="flex justify-end mt-4 gap-2">
          <ButtonComponent onClick={onClose} isDark>
            {t("common.cancel")}
          </ButtonComponent>
          <ButtonComponent
            onClick={() => handleDelete(selected)}
            disabled={!selected.length}
            isDark
          >
            {t("common.delete")}
          </ButtonComponent>
        </div>
      </Spin>
    </Modal>
  );
};


// Add Member
export const AddMemberModal = ({
  open,
  onClose,
  onSubmit,
}: {
  open: boolean;
  onClose: () => void;
  onSubmit: (userId: string) => void;
}) => {
  const { t } = useTranslation();
  const isDark = useSelector((s: RootState) => s.theme.darkMode);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState("");

  useEffect(() => {
    if (open) {
      setLoading(true);
      handleApiCall<User[]>(async () => {
        const res = await axiosInstance.get<{ data: User[] }>("/user");
        return res.data.data;
      }).then((result) => {
        setUsers(result || []);
        if (!result) message.error(t("workspace.fetchUsersFailed"));
        setLoading(false);
        setSelectedUserId("");
      });
    }
  }, [open, t]);

  const handleOk = () => {
    if (!selectedUserId) {
      message.warning(t("workspace.selectUser"));
      return;
    }
    onSubmit(selectedUserId);
  };

  return (
    <Modal
      open={open}
      onCancel={onClose}
      onOk={handleOk}
      centered
      className={getModalClassName(isDark)}
      title={<LabelComponent label="workspace.addMember" isDark />}
      okText={t("common.add")}
      cancelText={t("common.cancel")}
    >
      <Spin spinning={loading}>
        <Select
          showSearch
          placeholder={t("workspace.selectUser")}
          value={selectedUserId || undefined}
          onChange={setSelectedUserId}
          className="w-full"
          filterOption={(input, option) => {
            const text = option?.children?.toString().toLowerCase() || "";
            return text.includes(input.toLowerCase());
          }}
        >
          {users.map((u) => (
            <Select.Option key={u.user_id} value={u.user_id}>
              {u.username} ({u.email})
            </Select.Option>
          ))}
        </Select>
      </Spin>
    </Modal>
  );
};
// Change Password
export const ChangePasswordModal = ({ open, onClose, onSubmit }: {
  open: boolean; onClose: () => void; onSubmit: (data: { current: string; next: string; confirm: string }) => void;
}) => {

  const isDark = useSelector((s: RootState) => s.theme.darkMode);
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");

  const handleOk = () => onSubmit({ current, next, confirm });

  return (
    <Modal
      open={open}
      onCancel={onClose}
      onOk={handleOk}
      centered
      className={getModalClassName(isDark)}
      title={<LabelComponent label="workspace.changePassword" isDark />}
    >
      <LabelComponent label="workspace.currentPassword" isDark />
      <InputComponent type="password" value={current} onChange={(e) => setCurrent(e.target.value)} isDark />
      <LabelComponent label="workspace.newPassword" isDark />
      <InputComponent type="password" value={next} onChange={(e) => setNext(e.target.value)} isDark />
      <LabelComponent label="workspace.confirmPassword" isDark />
      <InputComponent type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} isDark />
    </Modal>
  );
};
