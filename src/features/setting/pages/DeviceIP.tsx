import {
  Card,
  Input,
  Table,
  Button,
  Popconfirm,
  Space,
  Tag,
  DatePicker,
  Select,
  Breadcrumb,
} from "antd";
import { useEffect, useState } from "react";
import { useFakeApi } from "../../../hooks/useFakeApi";
import ResetDeviceModal from "../../../components/ResetDeviceModal";
import DeviceDetailModal from "../../../components/DeviceDetailModel";

const { RangePicker } = DatePicker;
const { Option } = Select;

interface DeviceLog {
  id: string;
  user: string;
  ipAddress: string;
  macAddress: string;
  device: string;
  os: string;
  location: string;
  deviceId: string;
  isPrimaryDevice: boolean;
  lastActive: string;
}

interface WhitelistedIP {
  id: string;
  ip: string;
  type: "STATIC" | "VPN" | "CIDR";
  description: string;
  createdAt: string;
}

export default function DeviceIpManagement() {
  const {
    data: devices,
    setData: setDevices,
    loading,
  } = useFakeApi<DeviceLog>("devices");
  const { data: whitelist } = useFakeApi<WhitelistedIP>("whitelist");

  const [searchText, setSearchText] = useState("");
  const [filteredData, setFilteredData] = useState<DeviceLog[]>([]);
  const [selectedDevice, setSelectedDevice] = useState<DeviceLog | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [resetTarget, setResetTarget] = useState<DeviceLog | null>(null);
  const [resetModalOpen, setResetModalOpen] = useState(false);

  useEffect(() => {
    if (devices) setFilteredData(devices);
  }, [devices]);

  const isAllowedIp = (ip: string): boolean => {
    if (!whitelist) return false;
    return whitelist.some((entry) => {
      if (entry.type === "STATIC") return ip === entry.ip;
      if (entry.type === "VPN" || entry.type === "CIDR") {
        return ip.startsWith(entry.ip.split("/")[0]);
      }
      return false;
    });
  };

  const handleSearch = () => {
    const keyword = searchText.toLowerCase();
    if (!devices) return;
    const result = devices.filter(
      (item) =>
        item.user.toLowerCase().includes(keyword) ||
        item.ipAddress.includes(keyword) ||
        item.macAddress.includes(keyword) ||
        item.device.toLowerCase().includes(keyword)
    );
    setFilteredData(result);
  };

  const handleDelete = (id: string) => {
    if (!devices) return;
    const updated = devices.filter((item: any) => item.id !== id);
    setDevices(updated);
    setFilteredData(updated);
  };

  const openResetDevice = (device: DeviceLog) => {
    setResetTarget(device);
    setResetModalOpen(true);
  };

  const confirmResetDevice = (deviceId: string) => {
    if (!devices) return;
    const updated = devices.map((d: any) => ({
      ...d,
      isPrimaryDevice: d.deviceId === deviceId,
    }));
    setDevices(updated);
    setFilteredData(updated);
    setResetModalOpen(false);
  };

  const viewDetail = (device: DeviceLog) => {
    setSelectedDevice(device);
    setModalVisible(true);
  };

  const columns = [
    { title: "User", dataIndex: "user", key: "user" },
    { title: "Thiết bị", dataIndex: "device", key: "device" },
    { title: "MAC Address", dataIndex: "macAddress", key: "macAddress" },
    { title: "Device ID", dataIndex: "deviceId", key: "deviceId" },
    {
      title: "Trạng thái thiết bị",
      key: "deviceStatus",
      render: (_: any, record: DeviceLog) => {
        return record.isPrimaryDevice ? (
          <Tag color="green">✔ Thiết bị được phép</Tag>
        ) : (
          <Tag color="red">⚠ Thiết bị lạ</Tag>
        );
      },
    },
    {
      title: "IP",
      key: "ipAddress",
      render: (_: any, record: DeviceLog) => {
        const valid = isAllowedIp(record.ipAddress);
        return (
          <Space>
            <code>{record.ipAddress}</code>
            {valid ? (
              <Tag color="green">✔ IP hợp lệ</Tag>
            ) : (
              <Tag color="red">✘ IP không hợp lệ</Tag>
            )}
          </Space>
        );
      },
    },
    { title: "OS", dataIndex: "os", key: "os" },
    { title: "Vị trí", dataIndex: "location", key: "location" },
    { title: "Last Active", dataIndex: "lastActive", key: "lastActive" },
    {
      title: "Hành động",
      key: "action",
      render: (_: any, record: DeviceLog) => (
        <Space>
          <Button type="link" onClick={() => viewDetail(record)}>
            Chi tiết
          </Button>
          {!record.isPrimaryDevice && (
            <>
              <Popconfirm
                title="Xoá thiết bị này?"
                onConfirm={() => handleDelete(record.id)}
              >
                <Button type="link" danger>
                  Xoá
                </Button>
              </Popconfirm>
              <Button type="link" onClick={() => openResetDevice(record)}>
                Đặt làm thiết bị chính
              </Button>
            </>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div className="p-4 space-y-4">
      <Breadcrumb
        items={[
          { title: "Trang chủ" },
          { title: "Quản lý thiết bị và ip hệ thống" },
        ]}
        className="mb-4 pb-4"
      />

      <Card>
        <div className="grid md:grid-cols-4 gap-4">
          <Input
            placeholder="Tìm theo user, IP, MAC..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
          <RangePicker className="w-full" />
          <Select allowClear placeholder="Hệ điều hành" className="w-full">
            <Option value="macOS">macOS</Option>
            <Option value="Windows">Windows</Option>
            <Option value="Linux">Linux</Option>
          </Select>
          <Button type="primary" onClick={handleSearch}>
            Tìm kiếm
          </Button>
        </div>
      </Card>

      <Card>
        <Table
          rowKey="id"
          columns={columns}
          dataSource={filteredData}
          loading={loading}
        />
      </Card>

      <DeviceDetailModal
        open={modalVisible}
        onClose={() => setModalVisible(false)}
        device={selectedDevice}
      />
      <ResetDeviceModal
        open={resetModalOpen}
        onClose={() => setResetModalOpen(false)}
        device={resetTarget}
        onConfirm={confirmResetDevice}
      />
    </div>
  );
}
