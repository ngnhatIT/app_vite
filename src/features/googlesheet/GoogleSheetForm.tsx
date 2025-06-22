import { useState, useEffect } from "react";
import { Form, Input, Button, Card, Typography, message, Select } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeftOutlined } from "@ant-design/icons";

const { Title } = Typography;

interface GoogleSheet {
  id?: number;
  name: string;
  owner: string;
}

const GoogleSheetForm: React.FC = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { sheetId } = useParams<{ sheetId?: string }>();
  const [isEditing, setIsEditing] = useState(false);

  const owners = ["Nguyen Van A", "Tran Thi B", "Le Van C"];

  useEffect(() => {
    if (sheetId) {
      setIsEditing(true);
      const sheet = {
        id: Number(sheetId),
        name: "Budget 2024",
        owner: "Nguyen Van A",
      };
      form.setFieldsValue(sheet);
    }
  }, [sheetId, form]);

  const onFinish = (values: GoogleSheet) => {
    console.log("Submit Google Sheet:", values);
    message.success(
      `${isEditing ? "Cập nhật" : "Thêm"} Google Sheet thành công!`
    );
    navigate("/googlesheets");
  };

  const onFinishFailed = () => {
    message.error("Vui lòng kiểm tra lại các trường nhập liệu!");
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100 p-4">
      <Card className="w-full max-w-md shadow-lg rounded-lg p-6 bg-white dark:bg-gray-800">
        <Title
          level={3}
          className="text-center mb-6 text-gray-900 dark:text-gray-100"
        >
          {isEditing ? "Chỉnh sửa Google Sheet" : "Thêm Google Sheet"}
        </Title>
        <Form
          layout="vertical"
          form={form}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          initialValues={{ name: "", owner: "" }}
          className="space-y-4"
        >
          <Form.Item
            label={
              <span className="text-gray-700 dark:text-gray-300">
                Tên <span className="text-red-500">*</span>
              </span>
            }
            name="name"
            rules={[{ required: true, message: "Vui lòng nhập tên!" }]}
          >
            <Input
              placeholder="Nhập tên Google Sheet"
              size="large"
              className="w-full"
            />
          </Form.Item>

          <Form.Item
            label={
              <span className="text-gray-700 dark:text-gray-300">
                Chủ sở hữu <span className="text-red-500">*</span>
              </span>
            }
            name="owner"
            rules={[{ required: true, message: "Vui lòng chọn chủ sở hữu!" }]}
          >
            <Select
              placeholder="Chọn chủ sở hữu"
              size="large"
              className="w-full"
            >
              {owners.map((owner) => (
                <Select.Option key={owner} value={owner}>
                  {owner}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              block
              className="bg-blue-600 hover:bg-blue-700 text-white transition duration-200"
            >
              {isEditing ? "Cập nhật" : "Thêm"}
            </Button>
          </Form.Item>

          <Button
            type="default"
            size="large"
            block
            onClick={() => navigate("/googlesheets")}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 transition duration-200"
          >
            <ArrowLeftOutlined className="mr-2" /> Quay lại
          </Button>
        </Form>
      </Card>
    </div>
  );
};

export default GoogleSheetForm;
