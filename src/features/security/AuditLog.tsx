import React, { useState, useMemo } from "react";
import {
  Table,
  Input,
  DatePicker,
  Button,
  Modal,
  Select,
  Typography,
  theme as antdTheme,
  Breadcrumb,
} from "antd";
import dayjs from "dayjs";
import { useFakeApi } from "../../hooks/useFakeApi";


const { RangePicker } = DatePicker;
const { Option } = Select;
const { Text } = Typography;

interface AuditLog {
  id: number;
  workspace: string;
  user: string;
  ipAddress: string;
  actionTime: string;
  action: string;
  detail: string;
}

const ACTION_OPTIONS = ["edit", "view", "comment", "download", "export", "import"];

export default function AuditLog() {
  const {
    token: { colorBgContainer, colorTextBase },
  } = antdTheme.useToken();

  const { data: logs, loading } = useFakeApi<AuditLog>("auditlogs");

  const [filters, setFilters] = useState({
    workspace: "",
    user: "",
    action: "",
    dateRange: null as [dayjs.Dayjs, dayjs.Dayjs] | null,
  });
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const handleClear = () =>
    setFilters({ workspace: "", user: "", action: "", dateRange: null });

  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      const matchWorkspace = filters.workspace
        ? log.workspace.toLowerCase().includes(filters.workspace.toLowerCase())
        : true;
      const matchUser = filters.user
        ? log.user.toLowerCase().includes(filters.user.toLowerCase())
        : true;
      const matchAction = filters.action
        ? log.action.toLowerCase() === filters.action.toLowerCase()
        : true;
      const matchDate =
        filters.dateRange && filters.dateRange.length === 2
          ? dayjs(log.actionTime).isAfter(filters.dateRange[0]) &&
          dayjs(log.actionTime).isBefore(filters.dateRange[1])
          : true;
      return matchWorkspace && matchUser && matchAction && matchDate;
    });
  }, [logs, filters]);

  const columns = [
    { title: "Workspace", dataIndex: "workspace" },
    { title: "Người dùng", dataIndex: "user" },
    { title: "IP", dataIndex: "ipAddress" },
    {
      title: "Thời gian",
      dataIndex: "actionTime",
      render: (text: string) => dayjs(text).format("YYYY-MM-DD HH:mm:ss"),
    },
    { title: "Hành động", dataIndex: "action" },
    { title: "Chi tiết", dataIndex: "detail" },
    {
      title: "Thao tác",
      key: "actions",
      render: (_: any, record: AuditLog) => (
        <Button type="link" onClick={() => {
          setSelectedLog(record);
          setModalOpen(true);
        }}>
          Xem
        </Button>
      ),
    },
  ];

  return (
    <div className="p-4" style={{ background: colorBgContainer, color: colorTextBase }}>
      <Breadcrumb items={[{ title: "Trang chủ" }, { title: "Sự kiện bảo mật" }]} />

      <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-6 gap-4 mt-6 mb-2">
        <div className="md:col-span-2">
          <Input
            placeholder="Tìm theo Workspace"
            value={filters.workspace}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, workspace: e.target.value }))
            }
          />
        </div>

        <div className="md:col-span-2">
          <Input
            placeholder="Tìm theo Người dùng"
            value={filters.user}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, user: e.target.value }))
            }
          />
        </div>

        <div className="md:col-span-1">
          <Select
            placeholder="Tìm theo Hành động"
            allowClear
            value={filters.action || undefined}
            onChange={(value) =>
              setFilters((prev) => ({ ...prev, action: value || "" }))
            }
            className="w-full"
          >
            {ACTION_OPTIONS.map((a) => (
              <Option key={a} value={a}>
                {a.charAt(0).toUpperCase() + a.slice(1)}
              </Option>
            ))}
          </Select>
        </div>

        <div className="md:col-span-2">
          <RangePicker
            className="w-full"
            value={filters.dateRange}
            onChange={(range) => {
              const valid =
                range && range.length === 2 && range[0] && range[1];
              setFilters((prev: any) => ({
                ...prev,
                dateRange: valid ? [range[0], range[1]] : null,
              }));
            }}
          />
        </div>
      </div>


      <div className="flex justify-end gap-2 mb-4">
        <Button type="primary">Tìm kiếm</Button>
        <Button onClick={handleClear}>Xoá điều kiện</Button>
      </div>

      <div className="overflow-x-auto">
        <Table
          rowKey="id"
          loading={loading}
          columns={columns}
          dataSource={filteredLogs}
          pagination={{ pageSize: 10 }}
          
          scroll={{ x: true }}
          locale={{ emptyText: "Không có dữ liệu" }}
        />
      </div>

      <Modal
        title="Chi tiết hành động"
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        footer={null}
      >
        {selectedLog && (
          <div className="space-y-2">
            <p><Text strong>Workspace:</Text> {selectedLog.workspace}</p>
            <p><Text strong>Người dùng:</Text> {selectedLog.user}</p>
            <p><Text strong>IP:</Text> {selectedLog.ipAddress}</p>
            <p><Text strong>Thời gian:</Text> {dayjs(selectedLog.actionTime).format("YYYY-MM-DD HH:mm:ss")}</p>
            <p><Text strong>Hành động:</Text> {selectedLog.action}</p>
            <p><Text strong>Chi tiết:</Text> {selectedLog.detail}</p>
          </div>
        )}
      </Modal>
    </div>
  );
}
