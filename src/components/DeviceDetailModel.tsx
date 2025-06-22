import { Descriptions, Modal, Tag } from "antd";

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

interface Props {
  open: boolean;
  onClose: () => void;
  device: DeviceLog | null;
}

export default function DeviceDetailModal({ open, onClose, device }: Props) {
  if (!device) return null;

  const isValidIp = isAllowedIp(device.ipAddress);

  return (
    <Modal
      title="Chi tiết thiết bị đăng nhập"
      open={open}
      onCancel={onClose}
      footer={null}
    >
      <Descriptions bordered column={1} size="small">
        <Descriptions.Item label="Người dùng">{device.user}</Descriptions.Item>
        <Descriptions.Item label="Thiết bị">{device.device}</Descriptions.Item>
        <Descriptions.Item label="Hệ điều hành">{device.os}</Descriptions.Item>
        <Descriptions.Item label="MAC Address">
          <code>{device.macAddress}</code>
        </Descriptions.Item>
        <Descriptions.Item label="Device ID">
          <code>{device.deviceId}</code>
        </Descriptions.Item>
        <Descriptions.Item label="IP Address">
          <code>{device.ipAddress}</code>{" "}
          {isValidIp ? (
            <Tag color="green">✔ Hợp lệ (Công ty/VPN)</Tag>
          ) : (
            <Tag color="red">✘ IP lạ</Tag>
          )}
        </Descriptions.Item>
        <Descriptions.Item label="Vị trí">{device.location}</Descriptions.Item>
        <Descriptions.Item label="Thiết bị chính">
          {device.isPrimaryDevice ? (
            <Tag color="green">✔ Thiết bị gốc</Tag>
          ) : (
            <Tag color="default">Khác thiết bị</Tag>
          )}
        </Descriptions.Item>
        <Descriptions.Item label="Thời gian hoạt động gần nhất">
          {device.lastActive}
        </Descriptions.Item>
      </Descriptions>
    </Modal>
  );
}

// isAllowedIp function có thể đặt ở utils.ts
function isAllowedIp(ip: string): boolean {
  const allowed = ["123.123.", "10.0."]; // ví dụ dải IP VPN/công ty
  return allowed.some((prefix) => ip.startsWith(prefix));
}
