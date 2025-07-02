// 📁 src/features/workspace/WorkspaceModals.tsx
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
} from "antd";
import { UploadOutlined, DeleteOutlined } from "@ant-design/icons";
import { useState } from "react";
import { useTranslation } from "react-i18next";

export const AddEditWorkspaceModal = ({
  open,
  onClose,
  onSubmit,
  initialData,
}: any) => {
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
      title={t("workspace.modal.title")}
      onCancel={onClose}
      onOk={handleOk}
      okText={t("workspace.save")}
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

export const ManageMembersModal = ({
  open,
  onClose,
  members,
  onDeleteMembers,
}: any) => {
  const { t } = useTranslation();
  const [selected, setSelected] = useState<string[]>([]);

  const columns = [
    {
      title: "#",
      render: (_: any, __: any, index: number) => index + 1,
    },
    {
      title: "Username",
      dataIndex: "username",
      render: (_: any, record: any) => (
        <div className="flex gap-2 items-center">
          <Avatar src={record.avatar} />
          <div>
            <div>{record.username}</div>
            <div className="text-white/60 text-sm">{record.email}</div>
          </div>
        </div>
      ),
    },
    {
      title: "Action",
      render: (_: any, record: any) => (
        <DeleteOutlined
          className="text-red-500 cursor-pointer"
          onClick={() => onDeleteMembers([record.id])}
        />
      ),
    },
  ];

  return (
    <Modal open={open} onCancel={onClose} footer={null} title="Member Listing">
      <Table
        rowKey="id"
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
        <Button danger onClick={() => onDeleteMembers(selected)}>
          Delete Member
        </Button>
      </div>
    </Modal>
  );
};

export const AddMemberModal = ({ open, onClose, onSubmit }: any) => {
  const [username, setUsername] = useState("");
  return (
    <Modal
      open={open}
      onCancel={onClose}
      onOk={() => onSubmit(username)}
      title="Add New Member"
    >
      <Input
        placeholder="Enter username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
    </Modal>
  );
};

export const ChangePasswordModal = ({ open, onClose, onSubmit }: any) => {
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");

  return (
    <Modal
      open={open}
      onCancel={onClose}
      onOk={() => onSubmit({ current, next, confirm })}
      title="Change Workspace Password"
    >
      <Input.Password
        placeholder="Enter current password"
        value={current}
        onChange={(e) => setCurrent(e.target.value)}
      />
      <Input.Password
        placeholder="Enter new password"
        value={next}
        onChange={(e) => setNext(e.target.value)}
        className="mt-2"
      />
      <Input.Password
        placeholder="Confirm new password"
        value={confirm}
        onChange={(e) => setConfirm(e.target.value)}
        className="mt-2"
      />
    </Modal>
  );
};
