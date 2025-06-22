// src/pages/IPWhitelistSetting.tsx
import {
  Card,
  Table,
  Button,
  Space,
  Modal,
  Form,
  Input,
  Select,
  Popconfirm,
  Tag,
  message,
  Breadcrumb,
} from "antd";
import { useState } from "react";
import dayjs from "dayjs";
import { useFakeApi } from "../../../hooks/useFakeApi";

const { Option } = Select;

interface WhitelistedIP {
  id: string;
  ip: string;
  type: "STATIC" | "VPN" | "CIDR";
  description: string;
  createdAt: string;
}

export default function IPWhitelistSetting() {
  const {
    data: list,
    loading,
    setData,
  } = useFakeApi<WhitelistedIP>("whitelist");
  const [modalOpen, setModalOpen] = useState(false);
  const [form] = Form.useForm();

  const addIP = (values: any) => {
    const newIp: WhitelistedIP = {
      id: 23123123,
      ...values,
      createdAt: dayjs().format("YYYY-MM-DD"),
    };
    const newList = [newIp, ...(list || [])];
    setData(newList);
    message.success("Thêm IP whitelist thành công");
    setModalOpen(false);
    form.resetFields();
  };

  const deleteIp = (id: string) => {
    if (!list) return;
    const newList = list.filter((item: any) => item.id !== id);
    setData(newList);
    message.success("Đã xoá IP");
  };

  const columns = [
    { title: "IP / CIDR", dataIndex: "ip", key: "ip" },
    {
      title: "Loại",
      dataIndex: "type",
      key: "type",
      render: (type: string) => {
        if (type === "STATIC") return <Tag color="blue">STATIC</Tag>;
        if (type === "VPN") return <Tag color="green">VPN</Tag>;
        return <Tag color="purple">CIDR</Tag>;
      },
    },
    { title: "Ghi chú", dataIndex: "description", key: "description" },
    { title: "Ngày tạo", dataIndex: "createdAt", key: "createdAt" },
    {
      title: "Hành động",
      key: "action",
      render: (_: any, record: WhitelistedIP) => (
        <Popconfirm title="Xoá IP này?" onConfirm={() => deleteIp(record.id)}>
          <Button type="link" danger>
            Xoá
          </Button>
        </Popconfirm>
      ),
    },
  ];

  return (
    <div className="p-4 space-y-4">
      <Breadcrumb
        items={[{ title: "Trang chủ" }, { title: "Cài đặt IP cho hệ thống" }]}
        className="mb-4 pb-4"
      />

      <Card className="pt-4">
        <div className="flex justify-end mb-2">
          <Button type="primary" onClick={() => setModalOpen(true)}>
            Thêm IP Whitelist
          </Button>
        </div>
        <Table
          rowKey="id"
          loading={loading}
          columns={columns}
          dataSource={list}
        />
      </Card>

      <Modal
        title="Thêm IP được phép truy cập"
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        onOk={() => form.submit()}
      >
        <Form form={form} layout="vertical" onFinish={addIP}>
          <Form.Item
            name="ip"
            label="IP hoặc CIDR"
            rules={[{ required: true, message: "Bắt buộc nhập IP" }]}
          >
            <Input placeholder="VD: 123.123.123.123 hoặc 10.0.0.0/16" />
          </Form.Item>
          <Form.Item
            name="type"
            label="Loại IP"
            rules={[{ required: true, message: "Chọn loại IP" }]}
          >
            <Select placeholder="Chọn loại">
              <Option value="STATIC">STATIC</Option>
              <Option value="VPN">VPN</Option>
              <Option value="CIDR">CIDR</Option>
            </Select>
          </Form.Item>
          <Form.Item name="description" label="Ghi chú">
            <Input placeholder="Mô tả IP: Vị trí, phòng ban, v.v." />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
