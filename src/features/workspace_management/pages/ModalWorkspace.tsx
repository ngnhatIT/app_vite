// ModalWorkspace.tsx — FULL

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
import { handleApiCall } from "../../../api/HandApiCall";
import axiosInstance from "../../../api/AxiosIntance";

import InputComponent from "../../../components/InputComponent";
import ButtonComponent from "../../../components/ButtonComponent";
import LabelComponent from "../../../components/LabelComponent";

const modalClassName = `
  [&_.ant-modal-content]:!bg-transparent
  [&_.ant-modal-content]:!backdrop-blur-md
  [&_.ant-modal-content]:!border
  [&_.ant-modal-content]:!border-purple-500
  [&_.ant-modal-content]:!rounded-xl
  [&_.ant-modal-header]:!bg-transparent
  [&_.ant-modal-header]:!border-none
  [&_.ant-modal-footer]:!bg-transparent
  [&_.ant-modal-footer]:!border-none
`;

type User = {
  userId: string;
  userName: string;
  email: string;
  avatar?: string;
};

// ===========================
// Add/Edit Workspace Modal
// ===========================
export const AddEditWorkspaceModal = ({
  open,
  onClose,
  onSubmit,
  initialData,
}: {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  initialData?: any;
}) => {
  const { t } = useTranslation();
  const [name, setName] = useState(initialData?.name || "");
  const [owner, setOwner] = useState(initialData?.owner || "");
  const [desc, setDesc] = useState(initialData?.desc || "");
  const [file, setFile] = useState<File | null>(null);
  const [usePassword, setUsePassword] = useState(false);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const handleOk = () => {
    if (!name || !owner) return message.warning("Required fields missing");
    if (usePassword && password !== confirm)
      return message.error("Passwords do not match");
    onSubmit({
      name,
      owner,
      desc,
      file,
      password: usePassword ? password : undefined,
    });
  };

  return (
    <Modal
      open={open}
      onCancel={onClose}
      onOk={handleOk}
      title={
        <span className="text-white">
          {initialData ? t("workspace.editTitle") : t("workspace.createTitle")}
        </span>
      }
      okText={<span className="text-white">{t("common.save")}</span>}
      cancelText={<span className="text-white">{t("common.cancel")}</span>}
      className={modalClassName}
      centered
    >
      <div className="flex flex-col gap-3">
        <LabelComponent label="Workspace Name *" isDark />
        <InputComponent
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Workspace Name *"
          isDark
        />

        <LabelComponent label="Workspace Owner *" isDark />
        <Select value={owner} onChange={setOwner} placeholder="Owner">
          {/* options */}
        </Select>

        <LabelComponent label="Description" isDark />
        <InputComponent
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
          placeholder="Enter description"
          isDark
        />

        <LabelComponent label="Google Service Account" isDark />
        <Upload
          beforeUpload={(f) => {
            setFile(f);
            return false;
          }}
          showUploadList={false}
        >
          <ButtonComponent icon={<UploadOutlined />} isDark>
            Upload Google Service Account
          </ButtonComponent>
        </Upload>

        <Checkbox
          checked={usePassword}
          onChange={(e) => setUsePassword(e.target.checked)}
        >
          Enable password protection
        </Checkbox>

        {usePassword && (
          <>
            <LabelComponent label="Password *" isDark />
            <InputComponent
              type="password"
              placeholder="Password *"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              isDark
            />
            <LabelComponent label="Confirm Password *" isDark />
            <InputComponent
              type="password"
              placeholder="Confirm Password *"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              isDark
            />
          </>
        )}
      </div>
    </Modal>
  );
};

// ===========================
// Manage Members Modal
// ===========================
export const ManageMembersModal = ({
  open,
  onClose,
  workspaceId,
  onDeleteMembers,
}: {
  open: boolean;
  onClose: () => void;
  workspaceId: string;
  onDeleteMembers: (ids: string[]) => void;
}) => {
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
        if (result) setMembers(result);
        else message.error("Failed to fetch members");
        setLoading(false);
      });
      setSelected([]);
    }
  }, [open, workspaceId]);

  const columns = [
    {
      title: "#",
      render: (_: any, __: any, index: number) => (
        <span className="text-white">{index + 1}</span>
      ),
      width: 50,
    },
    {
      title: "Username",
      dataIndex: "userName",
      render: (_: any, record: User) => (
        <div className="flex gap-2 items-center">
          <Avatar src={record.avatar} />
          <div>
            <div className="text-white">{record.userName}</div>
            <div className="text-gray-400 text-xs">{record.email}</div>
          </div>
        </div>
      ),
    },
    {
      title: "Action",
      render: (_: any, record: User) => (
        <DeleteOutlined
          className="text-red-500 cursor-pointer"
          onClick={() => onDeleteMembers([record.userId])}
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
      title={
        <div className="flex justify-between items-center text-white">
          <span>Member Listing</span>
          <span className="text-sm text-purple-400">
            Total: {members.length}
          </span>
        </div>
      }
      className={modalClassName}
    >
      <Spin spinning={loading}>
        <Table
          rowKey="userId"
          rowSelection={{
            selectedRowKeys: selected,
            onChange: (keys) => setSelected(keys as string[]),
          }}
          columns={columns}
          dataSource={members}
          pagination={false}
          className="!bg-transparent [&_.ant-table-cell]:!text-white [&_.ant-table-thead]:!bg-transparent"
        />
        <div className="flex justify-end mt-4 gap-2">
          <ButtonComponent onClick={onClose} isDark>
            Cancel
          </ButtonComponent>
          <ButtonComponent
            onClick={() => onDeleteMembers(selected)}
            disabled={!selected.length}
            isDark
          >
            Delete
          </ButtonComponent>
        </div>
      </Spin>
    </Modal>
  );
};

// ===========================
// Add Member Modal
// ===========================
export const AddMemberModal = ({
  open,
  onClose,
  onSubmit,
}: {
  open: boolean;
  onClose: () => void;
  onSubmit: (userId: string) => void;
}) => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string>("");

  useEffect(() => {
    if (open) {
      setLoading(true);
      handleApiCall<User[]>(async () => {
        const res = await axiosInstance.get<{ data: User[] }>("/user");
        return res.data.data;
      }).then((result) => {
        if (result) setUsers(result);
        else message.error("Failed to fetch users");
        setLoading(false);
        setSelectedUserId("");
      });
    }
  }, [open]);

  const handleOk = () => {
    if (!selectedUserId) return message.warning("Please select a user");
    onSubmit(selectedUserId);
  };

  return (
    <Modal
      open={open}
      onCancel={onClose}
      centered
      onOk={handleOk}
      title={<span className="text-white">Add New Member</span>}
      okText={<span className="text-white">Add</span>}
      cancelText={<span className="text-white">Cancel</span>}
      className={modalClassName}
    >
      <Spin spinning={loading}>
        <Select
          showSearch
          placeholder="Select user"
          optionFilterProp="children"
          value={selectedUserId || undefined}
          onChange={setSelectedUserId}
          className="w-full"
        >
          {users.map((user) => (
            <Select.Option key={user.userId} value={user.userId}>
              {user.userName} ({user.email})
            </Select.Option>
          ))}
        </Select>
      </Spin>
    </Modal>
  );
};

// ===========================
// Change Password Modal
// ===========================
export const ChangePasswordModal = ({
  open,
  onClose,
  onSubmit,
}: {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: { current: string; next: string; confirm: string }) => void;
}) => {
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");

  const handleOk = () => onSubmit({ current, next, confirm });

  return (
    <Modal
      open={open}
      onCancel={onClose}
      onOk={handleOk}
      title={<span className="text-white">Change Workspace Password</span>}
      okText={<span className="text-white">Change</span>}
      cancelText={<span className="text-white">Cancel</span>}
      className={modalClassName}
    >
      <InputComponent
        type="password"
        placeholder="Current Password"
        value={current}
        onChange={(e) => setCurrent(e.target.value)}
        isDark
      />
      <InputComponent
        type="password"
        placeholder="New Password"
        value={next}
        onChange={(e) => setNext(e.target.value)}
        isDark
      />
      <InputComponent
        type="password"
        placeholder="Confirm Password"
        value={confirm}
        onChange={(e) => setConfirm(e.target.value)}
        isDark
      />
    </Modal>
  );
};
