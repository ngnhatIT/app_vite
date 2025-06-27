// WorkspaceChangePassword.tsx - Refactored with Dark UI + Redux Thunk
import { Form, Input, Button, message } from "antd";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../../../app/store";

interface WorkspaceChangePasswordProps {
  workspace: { id: number };
  onClose: () => void;
}

const WorkspaceChangePassword: React.FC<WorkspaceChangePasswordProps> = ({
  workspace,
  onClose,
}) => {
  const [form] = Form.useForm();
  const dispatch = useDispatch<AppDispatch>();

  const onFinish = async (values: any) => {
    if (values.newPassword !== values.confirmPassword) {
      message.error("Passwords do not match!");
      return;
    }
    try {
      await dispatch(
        changeWorkspacePasswordThunk({
          workspaceId: workspace.id,
          currentPassword: values.currentPassword,
          newPassword: values.newPassword,
        })
      ).unwrap();
      message.success("Password changed successfully!");
      onClose();
    } catch (error: any) {
      message.error(error?.message || "Failed to change password");
    }
  };

  return (
    <div className="bg-[#1C1C2E] p-6 rounded-2xl shadow-lg w-[400px]">
      <h2 className="text-lg font-semibold text-white mb-4">
        Change Workspace Password
      </h2>
      <Form layout="vertical" onFinish={onFinish} form={form}>
        <Form.Item
          label={<span className="text-white">Current Password</span>}
          name="currentPassword"
          rules={[
            { required: true, message: "Please enter current password!" },
          ]}
        >
          <Input.Password
            placeholder="Enter current password"
            className="bg-[#2C2C3E] text-white placeholder-gray-400 border-none"
          />
        </Form.Item>

        <Form.Item
          label={<span className="text-white">New Password</span>}
          name="newPassword"
          rules={[{ required: true, message: "Please enter new password!" }]}
        >
          <Input.Password
            placeholder="Enter new password"
            className="bg-[#2C2C3E] text-white placeholder-gray-400 border-none"
          />
        </Form.Item>

        <Form.Item
          label={<span className="text-white">Confirm New Password</span>}
          name="confirmPassword"
          dependencies={["newPassword"]}
          rules={[
            { required: true, message: "Please confirm new password!" },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("newPassword") === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error("Passwords do not match!"));
              },
            }),
          ]}
        >
          <Input.Password
            placeholder="Enter confirm new password"
            className="bg-[#2C2C3E] text-white placeholder-gray-400 border-none"
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

export default WorkspaceChangePassword;
function useAppDispatch() {
  throw new Error("Function not implemented.");
}

function changeWorkspacePasswordThunk(arg0: {
  workspaceId: number;
  currentPassword: any;
  newPassword: any;
}): any {
  throw new Error("Function not implemented.");
}
