import React, { useEffect, useState } from "react";
import { Table, Checkbox, Avatar, Tooltip, Button, message, Spin } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import axios from "axios";

const PERMISSIONS = ["view", "edit", "download", "export", "import", "print"];

interface RecordType {
  key: number;
  username: string;
  email: string;
  avatar: string;
  permissions: string[];
}

const PermissionMatrix = () => {
  const [data, setData] = useState<RecordType[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchMockPermissions = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/mock-permissions");
      setData(res.data);
    } catch (e) {
      message.error("Không thể tải dữ liệu.");
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = (key: number) => {
    setData((prev) => prev.filter((r) => r.key !== key));
    message.success("Đã xoá người dùng khỏi bảng");
  };

  const togglePermission = (
    recordKey: number,
    perm: string,
    checked: boolean
  ) => {
    setData((prevData) =>
      prevData.map((record) =>
        record.key === recordKey
          ? {
              ...record,
              permissions: checked
                ? [...record.permissions, perm]
                : record.permissions.filter((p) => p !== perm),
            }
          : record
      )
    );
  };

  useEffect(() => {
    axios.get = (async () => ({
      data: Array.from({ length: 8 }).map((_, i) => ({
        key: i,
        username: "Nur Aisyah Binti Zainuddin",
        email: "nuraisyahbintizainuddin@gmail.com",
        avatar: `https://i.pravatar.cc/150?img=${i + 1}`,
        permissions: PERMISSIONS.filter((_, idx) => (i + idx) % 3 === 0),
      })),
    })) as typeof axios.get;

    fetchMockPermissions();
  }, []);

  const columns = [
    {
      title: "#",
      dataIndex: "index",
      render: (_: any, __: any, index: number) => (
        <span className="text-white">{index + 1}</span>
      ),
    },
    {
      title: "User Name",
      dataIndex: "username",
      render: (_: any, record: any) => (
        <div className="flex items-center gap-3">
          <Avatar src={record.avatar} />
          <div>
            <div className="text-white font-medium">{record.username}</div>
            <div className="text-gray-400 text-sm">{record.email}</div>
          </div>
        </div>
      ),
    },
    ...PERMISSIONS.map((perm) => ({
      title: perm.charAt(0).toUpperCase() + perm.slice(1),
      dataIndex: perm,
      render: (_: any, record: RecordType) => (
        <Checkbox
          checked={record.permissions.includes(perm)}
          onChange={(e) => togglePermission(record.key, perm, e.target.checked)}
          className="!text-purple-400"
        />
      ),
    })),
    {
      title: "Action",
      render: (_: any, record: RecordType) => (
        <Tooltip title="Remove">
          <Button
            icon={<DeleteOutlined />}
            type="text"
            className="text-white hover:text-red-500"
            onClick={() => handleRemove(record.key)}
          />
        </Tooltip>
      ),
    },
  ];

  return (
    <div className="p-6 bg-[#0E0B1D] min-h-screen text-white">
      {loading ? (
        <Spin size="large" />
      ) : (
        <Table
          columns={columns}
          dataSource={data}
          rowKey="key"
          pagination={false}
          className="
            !bg-transparent
            [&_.ant-table]:!bg-transparent 
            [&_.ant-table-container]:!bg-transparent 
            [&_.ant-table-thead_th]:!bg-[#1C1C2E] 
            [&_.ant-table-tbody_td]:!bg-transparent 
            [&_.ant-table-cell]:!text-white 
            [&_.ant-table-placeholder]:!bg-transparent 
            [&_.ant-empty-description]:!text-white/60"
        />
      )}
    </div>
  );
};

export default PermissionMatrix;
