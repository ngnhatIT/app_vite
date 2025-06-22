import React, { useMemo, useState } from "react";
import {
  Table,
  Input,
  Button,
  Row,
  Col,
  Typography,
  DatePicker,
  Space,
  Breadcrumb,
  Modal,
  theme as antdTheme,
} from "antd";
import {
  SearchOutlined,
  ReloadOutlined,
  EyeOutlined,
  DownloadOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";


import type { ColumnType } from "antd/es/table";
import { useFakeApi } from "../../../hooks/useFakeApi";

const { Text } = Typography;
const { RangePicker } = DatePicker;

interface StatisticalRecord {
  id: number;
  workspace: string;
  userCount: number;
  sheetCount: number;
  weeklyAccessCount: number;
  weeklySummary: string;
  accessPerDay?: { day: string; count: number }[];
}

const Statistical: React.FC = () => {
  const {
    token: { colorBgContainer, colorTextBase },
  } = antdTheme.useToken();

  const { data, loading } = useFakeApi<StatisticalRecord>("statistics");

  const [filters, setFilters] = useState({
    workspace: "",
    user: "",
    dateRange: null as [dayjs.Dayjs, dayjs.Dayjs] | null,
  });
  const [applied, setApplied] = useState(filters);

  const [selectedStat, setSelectedStat] = useState<StatisticalRecord | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSearch = () => setApplied(filters);
  const handleClear = () => {
    const reset = { workspace: "", user: "", dateRange: null };
    setFilters(reset);
    setApplied(reset);
  };


  const filteredData = useMemo(() => {
    return data.filter((item) => {
      const matchWorkspace = applied.workspace
        ? item.workspace.toLowerCase().includes(applied.workspace.toLowerCase())
        : true;
      const matchUser = applied.user
        ? item.userCount > 0 &&
          item.workspace.toLowerCase().includes(applied.user.toLowerCase())
        : true;
      const matchDate =
        applied.dateRange && applied.dateRange[0] && applied.dateRange[1]
          ? true
          : true;
      return matchWorkspace && matchUser && matchDate;
    });
  }, [data, applied]);

  const columns: ColumnType<StatisticalRecord>[] = [
    { title: "Workspace", dataIndex: "workspace" },
    {
      title: "Tổng số file Google Sheet",
      dataIndex: "sheetCount",
      align: "center",
    },
    {
      title: "Tổng số người dùng",
      dataIndex: "userCount",
      align: "center",
    },
    {
      title: "Truy cập theo tuần",
      dataIndex: "weeklyAccessCount",
      align: "center",
    },
    {
      title: "Ghi chú đánh giá",
      dataIndex: "weeklySummary",
      responsive: ["lg"],
    },
    {
      title: "Xem",
      key: "action",
      align: "center",
      render: (_: any, record: StatisticalRecord) => (
        <Button
          icon={<EyeOutlined />}
          onClick={() => {
            setSelectedStat(record);
            setIsModalOpen(true);
          }}
        >
          View
        </Button>
      ),
    },
  ];

  return (
    <div
      className="p-4"
      style={{ background: colorBgContainer, color: colorTextBase }}
    >
      {/* Breadcrumb */}
      <Breadcrumb
        items={[{ title: "Trang chủ" }, { title: "Thống kê hoạt động" }]}
        className="mb-4"
      />

      <Text strong className="text-xl">
        Báo cáo thống kê hệ thống
      </Text>

      {/* Bộ lọc tìm kiếm */}
      <Row gutter={[16, 16]} className="mt-4 mb-2" wrap>
        <Col xs={24} sm={12} md={6}>
          <Input
            placeholder="Tìm theo Workspace"
            value={filters.workspace}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, workspace: e.target.value }))
            }
          />
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Input
            placeholder="Tìm theo người dùng"
            value={filters.user}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, user: e.target.value }))
            }
          />
        </Col>
        <Col xs={24} sm={24} md={12}>
          <RangePicker
            style={{ width: "100%" }}
            value={filters.dateRange}
            onChange={(range) =>
              setFilters((prev) => ({
                ...prev,
                dateRange:
                  range && range[0] && range[1]
                    ? ([range[0], range[1]] as [dayjs.Dayjs, dayjs.Dayjs])
                    : null,
              }))
            }
          />
        </Col>
      </Row>

      {/* Nút tìm kiếm + xoá điều kiện */}
      <Row justify="end" className="mb-4">
        <Col>
          <Space>
            <Button
              icon={<SearchOutlined />}
              type="primary"
              onClick={handleSearch}
            >
              Tìm kiếm
            </Button>
            <Button icon={<ReloadOutlined />} onClick={handleClear}>
              Xoá điều kiện
            </Button>
          </Space>
        </Col>
      </Row>

      {/* Bảng dữ liệu */}
      <Table
        rowKey="id"
        columns={columns}
        dataSource={filteredData}
        loading={loading}
        bordered
        scroll={{ x: true }}
        pagination={{ pageSize: 10 }}
      />

      {/* Nút export Excel - cuối trang, phải */}
      <Row justify="end" className="mt-4">
        <Col>
        
        </Col>
      </Row>

      {/* Modal chi tiết biểu đồ */}
     
    </div>
  );
};

export default Statistical;
