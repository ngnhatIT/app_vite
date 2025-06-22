import React, { useEffect, useState } from "react";
import {
  Table,
  Checkbox,
  Typography,
  Space,
  Spin,
  Button,
  Modal,
  Form,
  Input,
  Popconfirm,
  message,
  theme as antdTheme,
} from "antd";
import axios from "axios";

const { Text } = Typography;
const PERMISSIONS = ["edit", "view", "comment", "download", "export", "import","print"];

interface Permission {
  [key: string]: boolean;
}

interface RecordType {
  id: number;
  sheetName: string;
  userId: number;
  username: string;
  permissions: Permission;
}

const GoogleSheetPermissionMatrix: React.FC = () => {
  const { token } = antdTheme.useToken();
  const [data, setData] = useState<RecordType[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();

  const fetchPermissions = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:4000/permissions");
      setData(res.data);
    } catch (e) {
      message.error("Không thể tải dữ liệu.");
    } finally {
      setLoading(false);
    }
  };

  const updatePermission = async (
    record: RecordType,
    field: string,
    checked: boolean
  ) => {
    const updated = {
      ...record,
      permissions: {
        ...record.permissions,
        [field]: checked,
      },
    };

    try {
      await axios.put(`http://localhost:4000/permissions/${record.id}`, updated);
      setData((prev) =>
        prev.map((r) => (r.id === record.id ? updated : r))
      );
      message.success("Đã cập nhật quyền");
    } catch {
      message.error("Không thể cập nhật");
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`http://localhost:4000/permissions/${id}`);
      setData((prev) => prev.filter((item) => item.id !== id));
      message.success("Đã xoá người dùng");
    } catch {
      message.error("Không thể xoá");
    }
  };

  const columns = [
    {
      title: "Tên Sheet",
      dataIndex: "sheetName",
      key: "sheetName",
      render: (text: string) => <Text strong>{text}</Text>,
    },
    {
      title: "Người dùng",
      dataIndex: "username",
      key: "username",
    },
    ...PERMISSIONS.map((perm) => ({
      title: perm.charAt(0).toUpperCase() + perm.slice(1),
      key: perm,
      align: "center" as const,
      render: (_: any, record: RecordType) => (
        <Checkbox
          checked={record.permissions?.[perm]}
          onChange={(e) =>
            updatePermission(record, perm, e.target.checked)
          }
        />
      ),
    })),
    {
      title: "Hành động",
      key: "actions",
      render: (_: any, record: RecordType) => (
        <Popconfirm
          title="Xoá người dùng này?"
          onConfirm={() => handleDelete(record.id)}
        >
          <Button danger>Xoá</Button>
        </Popconfirm>
      ),
    },
  ];

  const handleAdd = async () => {
    try {
      const values = await form.validateFields();
      const newPermission: RecordType = {
        ...values,
        id: Date.now(), // chỉ dùng tạm nếu server không tự sinh
        permissions: PERMISSIONS.reduce(
          (acc, perm) => ({ ...acc, [perm]: false }),
          {} as Permission
        ),
      };
      await axios.post("http://localhost:4000/permissions", newPermission);
      fetchPermissions();
      setIsModalOpen(false);
      message.success("Đã thêm người dùng");
    } catch {
      message.error("Lỗi khi thêm");
    }
  };

  useEffect(() => {
    fetchPermissions();
  }, []);

  return (
    <div
      className="p-4"
      style={{ background: token.colorBgContainer, color: token.colorTextBase }}
    >
      <Space
        className="w-full mb-4"
        align="center"
        style={{ justifyContent: "space-between" }}
      >
        <Text strong className="text-lg">
          Quản lý phân quyền Google Sheets
        </Text>
        <Button type="primary" onClick={() => setIsModalOpen(true)}>
          Thêm người dùng
        </Button>
      </Space>

      {loading ? (
        <Spin />
      ) : (
        <Table
          rowKey={(r) => r.id}
          columns={columns}
          dataSource={data}
          pagination={false}
          bordered
        />
      )}

      <Modal
        title="Thêm người dùng"
        open={isModalOpen}
        onOk={handleAdd}
        onCancel={() => setIsModalOpen(false)}
        okText="Thêm"
        destroyOnClose
      >
        <Form layout="vertical" form={form}>
          <Form.Item name="sheetName" label="Tên Sheet" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="username" label="Tên người dùng" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="userId" label="ID người dùng" rules={[{ required: true }]}>
            <Input type="number" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default GoogleSheetPermissionMatrix;
