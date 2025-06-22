import {
  Card,
  Table,
  Tag,
  Button,
  Popconfirm,
  Select,
  Input,
  DatePicker,
  message,
  Breadcrumb,
} from "antd";
import { useState, useEffect } from "react";
import dayjs from "dayjs";
import { useFakeApi } from "../../hooks/useFakeApi";

const { Option } = Select;
const { RangePicker } = DatePicker;

interface SecurityIncident {
  id: string;
  user: string;
  type: "MASS_DOWNLOAD" | "FAILED_LOGIN" | "OUTSIDE_ACCESS" | "UNAUTHORIZED_DEVICE";
  description: string;
  severity: "LOW" | "MEDIUM" | "HIGH";
  timestamp: string;
  resolved: boolean;
}

export default function SecurityIncidents() {
  const { data, loading, setData } = useFakeApi<SecurityIncident>("incidents");

  const [filtered, setFiltered] = useState<SecurityIncident[]>([]);
  const [filters, setFilters] = useState({
    user: "",
    severity: "",
    type: "",
    status: "",
    dateRange: null as [dayjs.Dayjs, dayjs.Dayjs] | null,
  });

  useEffect(() => {
    if (data) filterData();
  }, [data]);

  const filterData = () => {
    let result = data || [];

    if (filters.user)
      result = result.filter((item) =>
        item.user.toLowerCase().includes(filters.user.toLowerCase())
      );

    if (filters.severity)
      result = result.filter((item) => item.severity === filters.severity);

    if (filters.type)
      result = result.filter((item) => item.type === filters.type);

    if (filters.status !== "")
      result = result.filter((item) =>
        filters.status === "resolved" ? item.resolved : !item.resolved
      );

    if (filters.dateRange)
      result = result.filter((item) =>
        dayjs(item.timestamp).isAfter(filters.dateRange![0]) &&
        dayjs(item.timestamp).isBefore(filters.dateRange![1])
      );

    setFiltered(result);
  };

  const clearFilters = () => {
    setFilters({
      user: "",
      severity: "",
      type: "",
      status: "",
      dateRange: null,
    });
    setFiltered(data || []);
  };

  const markResolved = (id: string) => {
    const updated = data?.map((item) =>
      item.id === id ? { ...item, resolved: true } : item
    );
    if (updated) {
      setData(updated);
      message.success("Đã đánh dấu là đã xử lý");
      filterData();
    }
  };

  const columns = [
    { title: "User", dataIndex: "user" },
    {
      title: "Loại vi phạm",
      dataIndex: "type",
      render: (type: string) => {
        const map = {
          MASS_DOWNLOAD: "Tải file hàng loạt",
          FAILED_LOGIN: "Đăng nhập sai nhiều lần",
          OUTSIDE_ACCESS: "Truy cập ngoài giờ",
          UNAUTHORIZED_DEVICE: "Thiết bị không hợp lệ",
        };
        return map[type as keyof typeof map];
      },
    },
    { title: "Mô tả", dataIndex: "description" },
    {
      title: "Mức độ",
      dataIndex: "severity",
      render: (s: string) => (
        <Tag color={{ LOW: "green", MEDIUM: "orange", HIGH: "red" }[s]}>
          {s}
        </Tag>
      ),
    },
    {
      title: "Thời gian",
      dataIndex: "timestamp",
      render: (v: string) => dayjs(v).format("YYYY-MM-DD HH:mm:ss"),
    },
    {
      title: "Trạng thái",
      dataIndex: "resolved",
      render: (v: boolean) =>
        v ? <Tag color="blue">Đã xử lý</Tag> : <Tag color="red">Chưa xử lý</Tag>,
    },
    {
      title: "Hành động",
      render: (_: any, record: SecurityIncident) => (
        <div className="space-x-2">
          {!record.resolved && (
            <Popconfirm
              title="Đánh dấu đã xử lý?"
              onConfirm={() => markResolved(record.id)}
            >
              <Button type="link">Đánh dấu</Button>
            </Popconfirm>
          )}
          <Button type="link" danger>
            Khoá tài khoản
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="p-4 space-y-4">
      <Breadcrumb items={[{ title: "Trang chủ" }, { title: "Sự kiện bảo mật" }]} />

      <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-6 gap-4 pt-4">
        <div className="md:col-span-2">
          <Input
            placeholder="Email người dùng"
            value={filters.user}
            onChange={(e) => setFilters((prev) => ({ ...prev, user: e.target.value }))}
          />
        </div>

        <div className="md:col-span-1">
          <Select
            allowClear
            placeholder="Mức độ"
            value={filters.severity || undefined}
            onChange={(v) => setFilters((prev) => ({ ...prev, severity: v || "" }))}
            className="w-full"
          >
            <Option value="LOW">LOW</Option>
            <Option value="MEDIUM">MEDIUM</Option>
            <Option value="HIGH">HIGH</Option>
          </Select>
        </div>

        <div className="md:col-span-1">
          <Select
            allowClear
            placeholder="Loại vi phạm"
            value={filters.type || undefined}
            onChange={(v) => setFilters((prev) => ({ ...prev, type: v || "" }))}
            className="w-full"
          >
            <Option value="MASS_DOWNLOAD">Tải file hàng loạt</Option>
            <Option value="FAILED_LOGIN">Đăng nhập sai</Option>
            <Option value="OUTSIDE_ACCESS">Ngoài giờ</Option>
            <Option value="UNAUTHORIZED_DEVICE">Thiết bị lạ</Option>
          </Select>
        </div>

        <div className="md:col-span-1">
          <Select
            allowClear
            placeholder="Trạng thái"
            value={filters.status || undefined}
            onChange={(v) => setFilters((prev) => ({ ...prev, status: v || "" }))}
            className="w-full"
          >
            <Option value="resolved">Đã xử lý</Option>
            <Option value="unresolved">Chưa xử lý</Option>
          </Select>
        </div>

        <div className="md:col-span-2">
          <RangePicker
            className="w-full"
            value={filters.dateRange}
            onChange={(v) => {
              if (v && v.length === 2 && v[0] !== null && v[1] !== null) {
                setFilters((prev) => ({ ...prev, dateRange: [v[0], v[1]] as [dayjs.Dayjs, dayjs.Dayjs] }));
              } else {
                setFilters((prev) => ({ ...prev, dateRange: null }));
              }
            }}
          />
        </div>
      </div>
      <div className="flex justify-end gap-2">
        <Button type="primary" onClick={filterData}>
          Lọc
        </Button>
        <Button onClick={clearFilters}>Xoá điều kiện</Button>
      </div>

      <div className="overflow-x-auto">
        <Table
          rowKey="id"
          loading={loading}
          columns={columns}
          dataSource={filtered}
          scroll={{ x: true }}
          locale={{ emptyText: "Không có dữ liệu phù hợp" }}
        />
      </div>
    </div>
  );
}
