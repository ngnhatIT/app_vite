import { Form, Input, Button, Spin, Avatar, Typography, Tag } from "antd";
import { EyeInvisibleOutlined, EyeTwoTone, UserOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../../app/store";
import { useEffect, useState } from "react";
import { fetchProfileThunk } from "../profileThunk";


const { Title, Text } = Typography;

const Profile: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [form] = Form.useForm();

  const { profile, loading } = useSelector((state: RootState) => state.profile);
  const [changing] = useState(false);

  useEffect(() => {
    dispatch(fetchProfileThunk());
  }, [dispatch]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0F0C1D]">
      <Spin spinning={loading}>
        <div className="bg-[#1A1334] p-10 rounded-3xl shadow-lg w-[400px] text-center">
          <Avatar size={64} icon={<UserOutlined />} className="mb-4 bg-[#3B2F63]" />
          <Title level={4} style={{ color: "white", marginBottom: 0 }}>
            {profile?.username || "Sophie Thompson"}
          </Title>
          <Text type="secondary" className="text-white/60">
            {profile?.username || "sophiethompson@gmail.com"}
          </Text>
          <div className="my-2">
            <Tag color="purple" className="uppercase">
              {profile?.role || "Super Admin"}
            </Tag>
          </div>

          <div className="border-t border-white/10 my-4" />

          <Form
            layout="vertical"
            form={form}
          
            className="text-left"
          >
            <Form.Item
              label={<span className="text-white">Password</span>}
              name="newPassword"
              rules={[{ required: true, message: "Please enter new password" }]}
            >
              <Input.Password
                placeholder="Enter new password"
                iconRender={(visible) =>
                  visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                }
                className="bg-[#2A1F4A] text-white border-none"
              />
            </Form.Item>

            <Button
              type="primary"
              htmlType="submit"
              block
              loading={changing}
              className="bg-[#8A2BE2] hover:bg-[#9A4DFF] mt-2 rounded-lg font-semibold"
            >
              Change Password
            </Button>
          </Form>
        </div>
      </Spin>
    </div>
  );
};

export default Profile;
