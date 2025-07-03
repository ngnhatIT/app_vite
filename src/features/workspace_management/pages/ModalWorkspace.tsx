import {
  Modal,
  Input,
  Select,
  Button,
  Upload,
  Checkbox,
  Avatar,
  Table,
  message,
  Spin,
} from "antd";
import {
  UploadOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { handleApiCall } from "../../../api/HandApiCall";
import axiosInstance from "../../../api/AxiosIntance";


type User = {
  userId: string;
  userName: string;
  email: string;
  avatar?: string;
};

// ===========================
// Add/Edit Workspace Modal
// ===========================
type AddEditWorkspaceModalProps = {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  initialData?: any;
};

export const AddEditWorkspaceModal = ({
  open,
  onClose,
  onSubmit,
  initialData,
}: AddEditWorkspaceModalProps) => {
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
      title={initialData ? t("workspace.editTitle") : t("workspace.createTitle")}
      onCancel={onClose}
      onOk={handleOk}
      okText={t("common.save")}
      cancelText={t("common.cancel")}
    >
      <div className="flex flex-col gap-3">
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Workspace Name *"
        />
        <Select
          value={owner}
          onChange={setOwner}
          placeholder="Select Workspace Owner *"
          options={[]}
        />
        <Input.TextArea
          rows={3}
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
          placeholder="Enter description"
        />
        <Upload
          beforeUpload={(file) => {
            setFile(file);
            return false;
          }}
        >
          <Button icon={<UploadOutlined />}>
            Upload Google Service Account
          </Button>
        </Upload>
        <Checkbox
          checked={usePassword}
          onChange={(e) => setUsePassword(e.target.checked)}
        >
          Enable password protection
        </Checkbox>
        {usePassword && (
          <>
            <Input.Password
              placeholder="Password *"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Input.Password
              placeholder="Confirm Password *"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
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
type ManageMembersModalProps = {
  open: boolean;
  onClose: () => void;
  workspaceId: string;
  onDeleteMembers: (ids: string[]) => void;
};

export const ManageMembersModal = ({
  open,
  onClose,
  workspaceId,
  onDeleteMembers,
}: ManageMembersModalProps) => {
  const [loading, setLoading] = useState(false);
  const [members, setMembers] = useState<User[]>([]);
  const [selected, setSelected] = useState<string[]>([]);

  const fetchMembers = async () => {
    setLoading(true);
    const result = await handleApiCall<User[]>(async () => {
      const res = await axiosInstance.get<{ data: User[] }>(
        `system/workspaces/${workspaceId}/members`
      );
      return res.data.data;
    });
    if (result) {
      setMembers(result);
    } else {
      message.error("Failed to fetch members");
    }
    setLoading(false);
  };

  useEffect(() => {
    if (open) {
      fetchMembers();
      setSelected([]);
    }
  }, [open, workspaceId]);

  const columns = [
    {
      title: "#",
      render: (_: any, __: any, index: number) => index + 1,
    },
    {
      title: "Username",
      dataIndex: "username",
      render: (_: any, record: User) => (
        <div className="flex gap-2 items-center">
          <Avatar src={record.avatar} />
          <div>
            <div>{record.userName}</div>
            <div className="text-gray-400 text-sm">{record.email}</div>
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
    <Modal open={open} onCancel={onClose} footer={null} title="Member Listing">
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
          className="!bg-transparent [&_.ant-table-cell]:!text-white"
        />
        <div className="flex justify-end mt-4 gap-2">
          <Button onClick={onClose}>Cancel</Button>
          <Button
            danger
            disabled={!selected.length}
            onClick={() => onDeleteMembers(selected)}
          >
            Delete Selected
          </Button>
        </div>
      </Spin>
    </Modal>
  );
};

// ===========================
// Add Member Modal (with fetch users)
// ===========================
type AddMemberModalProps = {
  open: boolean;
  onClose: () => void;
  onSubmit: (userId: string) => void;
};

export const AddMemberModal = ({
  open,
  onClose,
  onSubmit,
}: AddMemberModalProps) => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string>("");

  const fetchUsers = async () => {
    setLoading(true);
    const result = await handleApiCall<User[]>(async () => {
      const res = await axiosInstance.get<{ data: User[] }>("/user");
      return res.data.data;
    });
    if (result) {
      setUsers(result || []);
    } else {
      message.error("Failed to fetch users");
    }
    setLoading(false);
  };

  useEffect(() => {
    if (open) {
      fetchUsers();
      setSelectedUserId("");
    }
  }, [open]);

  const handleOk = () => {
    if (!selectedUserId) {
      message.warning("Please select a user");
      return;
    }
    onSubmit(selectedUserId);
  };

  return (
    <Modal
      open={open}
      onCancel={onClose}
      onOk={handleOk}
      title="Add New Member"
      okText="Add"
      cancelText="Cancel"
    >
      <Spin spinning={loading}>
        <Select
          showSearch
          placeholder="Select user"
          optionFilterProp="children"
          value={selectedUserId || undefined}
          onChange={setSelectedUserId}
          className="w-full"
          filterOption={(input, option) => {
            const label = typeof option?.children === "string"
              ? option.children
              : (Array.isArray(option?.children)
                  ? option.children.join(" ")
                  : String(option?.children));
            return label.toLowerCase().includes(input.toLowerCase());
          }}
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
type ChangePasswordModalProps = {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: {
    current: string;
    next: string;
    confirm: string;
  }) => void;
};

export const ChangePasswordModal = ({
  open,
  onClose,
  onSubmit,
}: ChangePasswordModalProps) => {
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");

  const handleOk = () => {
    onSubmit({ current, next, confirm });
  };

  return (
    <Modal
      open={open}
      onCancel={onClose}
      onOk={handleOk}
      title="Change Workspace Password"
      okText="Change"
      cancelText="Cancel"
    >
      <Input.Password
        placeholder="Enter current password"
        value={current}
        onChange={(e) => setCurrent(e.target.value)}
        className="mb-2"
      />
      <Input.Password
        placeholder="Enter new password"
        value={next}
        onChange={(e) => setNext(e.target.value)}
        className="mb-2"
      />
      <Input.Password
        placeholder="Confirm new password"
        value={confirm}
        onChange={(e) => setConfirm(e.target.value)}
      />
    </Modal>
  );
};
