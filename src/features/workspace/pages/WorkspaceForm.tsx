import { useState, useCallback, useMemo } from "react";
import {
  Form,
  Input,
  Button,
  Card,
  Typography,
  message,
  Select,
  Spin,
  Checkbox,
} from "antd";
import { useNavigate } from "react-router-dom";
import debounce from "lodash/debounce";
import {
  PlusOutlined,
  ArrowLeftOutlined,
  LoadingOutlined,
  EyeInvisibleOutlined,
  EyeOutlined,
} from "@ant-design/icons";

const { Title } = Typography;
const { Search } = Input;

interface UserOption {
  label: string;
  value: string;
}

const WorkspaceForm: React.FC = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [ownerOptions, setOwnerOptions] = useState<UserOption[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPasswordEnabled, setIsPasswordEnabled] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

  const debouncedSearchUser = useMemo(
    () =>
      debounce((value: string) => {
        setLoadingUsers(true);
        setTimeout(() => {
          const mockResults = [
            "alice@example.com",
            "bob@example.com",
            "carol@example.com",
          ]
            .filter((email) =>
              email.toLowerCase().includes(value.toLowerCase())
            )
            .map((email) => ({ label: email, value: email }));
          setOwnerOptions(mockResults);
          setLoadingUsers(false);
        }, 500);
      }, 300),
    []
  );

  const handleSearchUser = useCallback(
    (value: string) => {
      if (value) {
        debouncedSearchUser(value);
      } else {
        setOwnerOptions([]);
      }
    },
    [debouncedSearchUser]
  );

  const onFinish = (values: any) => {
    setIsSubmitting(true);
    if (isPasswordEnabled && values.password !== values.confirmPassword) {
      message.error("Mật khẩu không khớp!");
      setIsSubmitting(false);
      return;
    }
    setTimeout(() => {
      console.log("Submit workspace:", values);
      message.success("Đã thêm Workspace thành công!");
      setIsSubmitting(false);
      navigate("/workspaces");
    }, 1000); // Giả lập API call
  };

  const onFinishFailed = (errorInfo: any) => {
    message.error("Vui lòng kiểm tra lại các trường nhập liệu!");
  };

  return (
    <div className="min-h-screen flex   bg-gray-100 p-4">
      <Card className="w-full max-w-md shadow-lg rounded-lg p-6 bg-white dark:bg-gray-800">
        <Title
          level={3}
          className="text-center mb-6 text-gray-900 dark:text-gray-100"
        >
          <PlusOutlined className="mr-2" /> Tạo Workspace mới
        </Title>
        <Form
          layout="vertical"
          form={form}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          initialValues={{ name: "", description: "", owner: "" }}
          className="space-y-4"
        >
          <Form.Item
            label={
              <span className="text-gray-700 dark:text-gray-300">
                Tên Workspace <span className="text-red-500">*</span>
              </span>
            }
            name="name"
            rules={[
              { required: true, message: "Vui lòng nhập tên workspace!" },
              { min: 2, message: "Tên phải có ít nhất 2 ký tự!" },
              { max: 50, message: "Tên không quá 50 ký tự!" },
            ]}
          >
            <Input
              placeholder="Nhập tên (VD: Nhóm thiết kế GEO)"
              size="large"
              className="w-full"
            />
          </Form.Item>

          <Form.Item
            label={
              <span className="text-gray-700 dark:text-gray-300">Mô tả</span>
            }
            name="description"
            rules={[{ max: 200, message: "Mô tả không quá 200 ký tự!" }]}
          >
            <Input.TextArea
              placeholder="Nhập mô tả (tuỳ chọn)"
              autoSize={{ minRows: 3, maxRows: 5 }}
              className="w-full"
            />
          </Form.Item>

          <Form.Item
            label={
              <span className="text-gray-700 dark:text-gray-300">
                Chủ Workspace (Owner) <span className="text-red-500">*</span>
              </span>
            }
            name="owner"
            rules={[
              { required: true, message: "Vui lòng chọn người tạo!" },
              { type: "email", message: "Vui lòng nhập email hợp lệ!" },
            ]}
          >
            <Select
              showSearch
              placeholder="Tìm tài khoản hệ thống..."
              onSearch={handleSearchUser}
              filterOption={false}
              notFoundContent={
                loadingUsers ? <Spin size="small" /> : "Không tìm thấy"
              }
              options={ownerOptions}
              size="large"
              className="w-full"
            />
          </Form.Item>

          <Form.Item>
            <Checkbox
              checked={isPasswordEnabled}
              onChange={(e) => setIsPasswordEnabled(e.target.checked)}
            >
              <span className="text-gray-700 dark:text-gray-300">
                Thiết lập mật khẩu bảo vệ
              </span>
            </Checkbox>
          </Form.Item>

          {isPasswordEnabled && (
            <>
              <Form.Item
                label={
                  <span className="text-gray-700 dark:text-gray-300">
                    Mật khẩu Workspace <span className="text-red-500">*</span>
                  </span>
                }
                name="password"
                rules={[
                  { required: true, message: "Vui lòng nhập mật khẩu!" },
                  { min: 6, message: "Mật khẩu phải có ít nhất 6 ký tự!" },
                ]}
              >
                <Input.Password
                  placeholder="Nhập mật khẩu bảo vệ"
                  size="large"
                  className="w-full"
                  visibilityToggle={{
                    visible: passwordVisible,
                    onVisibleChange: setPasswordVisible,
                  }}
                />
              </Form.Item>

              <Form.Item
                label={
                  <span className="text-gray-700 dark:text-gray-300">
                    Xác nhận mật khẩu <span className="text-red-500">*</span>
                  </span>
                }
                name="confirmPassword"
                dependencies={["password"]}
                rules={[
                  { required: true, message: "Vui lòng xác nhận mật khẩu!" },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue("password") === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error("Mật khẩu không khớp!"));
                    },
                  }),
                ]}
              >
                <Input.Password
                  placeholder="Nhập lại mật khẩu"
                  size="large"
                  className="w-full"
                  visibilityToggle={{
                    visible: confirmPasswordVisible,
                    onVisibleChange: setConfirmPasswordVisible,
                  }}
                />
              </Form.Item>
            </>
          )}

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              block
              className="bg-blue-600 hover:bg-blue-700 text-white transition duration-200"
              icon={isSubmitting ? <LoadingOutlined /> : null}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Đang tạo..." : "Tạo Workspace"}
            </Button>
          </Form.Item>

          <div className="flex gap-4">
            <Button
              type="default"
              size="large"
              block
              onClick={() => navigate("/workspaces")}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 transition duration-200"
            >
              <ArrowLeftOutlined className="mr-2" /> Hủy
            </Button>
            <Button
              type="link"
              onClick={() => navigate("/workspaces")}
              block
              className="text-gray-600 hover:text-gray-800 transition duration-200"
            >
              <ArrowLeftOutlined className="mr-2" /> Quay lại danh sách
            </Button>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default WorkspaceForm;
