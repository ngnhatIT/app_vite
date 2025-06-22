// WorkspaceAddUser.tsx (updated with suggestions)
import { Form, Input, Button, message, Select } from "antd";
import { useState, useEffect } from "react";

const mockUsers = [
  { id: 1, email: "user1@example.com" },
  { id: 2, email: "user2@example.com" },
  { id: 3, email: "user3@example.com" },
];

interface WorkspaceAddUserProps {
  workspace: { id: number; [key: string]: any };
  onClose: () => void;
}

const WorkspaceAddUser = ({ workspace, onClose }: WorkspaceAddUserProps) => {
  const [form] = Form.useForm();
  const [userOptions, setUserOptions] = useState<
    { label: string; value: string }[]
  >([]);

  useEffect(() => {
    return setUserOptions(
      mockUsers.map((user) => ({
        label: user.email,
        value: user.email,
      }))
    );
  }, []);

  const onFinish = (values: any) => {
    console.log("Add user to workspace", workspace.id, values);
    message.success("Đã thêm người dùng!");
    onClose();
  };

  return (
    <Form layout="vertical" onFinish={onFinish} form={form}>
      <Form.Item
        label="Chọn người dùng"
        name="email"
        rules={[{ required: true, message: "Vui lòng chọn người dùng!" }]}
      >
        <Select
          showSearch
          placeholder="Nhập email để tìm..."
          options={userOptions}
          filterOption={(input, option) =>
            (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
          }
        />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit">
          Thêm
        </Button>
      </Form.Item>
    </Form>
  );
};

export default WorkspaceAddUser;
