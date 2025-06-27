import { Form, Input, Button, message, Select } from "antd";
import { useEffect, useState } from "react";
import type { AppDispatch, RootState } from "../../../app/store";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsersThunk } from "../../users/userThunk";
import { addUserToWorkspaceThunk } from "../workspaceThunk";

interface WorkspaceAddUserProps {
  workspace: { id: number };
  onClose: () => void;
}

const WorkspaceAddUser: React.FC<WorkspaceAddUserProps> = ({
  workspace,
  onClose,
}) => {
  const [form] = Form.useForm();
  const dispatch = useDispatch<AppDispatch>();
  const { users } = useSelector((state: RootState) => state.user);
  const [loadingUsers, setLoadingUsers] = useState(false);

  useEffect(() => {
    const loadUsers = async () => {
      setLoadingUsers(true);
      await dispatch(fetchUsersThunk());
      setLoadingUsers(false);
    };
    loadUsers();
  }, [dispatch]);

  const onFinish = async (values: { email: string }) => {
    try {
      await dispatch(
        addUserToWorkspaceThunk({
          workspaceId: workspace.id,
          email: values.email,
        })
      ).unwrap();
      message.success("Thêm người dùng thành công!");
      onClose();
    } catch (error: any) {
      message.error(error?.message || "Đã xảy ra lỗi khi thêm người dùng");
    }
  };

  return (
    <div className="bg-[#1C1C2E] p-6 rounded-2xl shadow-lg w-[400px]">
      <h2 className="text-lg font-semibold text-white mb-4">Add New Member</h2>
      <Form layout="vertical" onFinish={onFinish} form={form}>
        <Form.Item
          label={<span className="text-white">Username</span>}
          name="email"
          rules={[{ required: true, message: "Please enter username!" }]}
        >
          <Select
            showSearch
            placeholder="Enter username"
            loading={loadingUsers}
            options={users.map((user: { email: any }) => ({
              label: user.email,
              value: user.email,
            }))}
            className="bg-[#2C2C3E] text-white"
            dropdownStyle={{ backgroundColor: "#2C2C3E" }}
            popupClassName="custom-dark-select"
          />
        </Form.Item>

        <div className="flex justify-end gap-3 mt-4">
          <Button
            onClick={onClose}
            className="bg-[#3A3A50] text-white border-none"
          >
            Cancel
          </Button>
          <Button
            type="primary"
            htmlType="submit"
            className="bg-[#7B3FE4] text-white border-none"
          >
            Save
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default WorkspaceAddUser;
