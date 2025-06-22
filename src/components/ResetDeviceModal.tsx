// src/components/ResetDeviceModal.tsx
import { Modal, Descriptions, Button, Typography, Tag } from "antd";

// Define DeviceLog type if not imported from elsewhere
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
  onConfirm: (deviceId: string) => void;
}

export default function ResetDeviceModal({
  open,
  onClose,
  device,
  onConfirm,
}: Props) {
  if (!device) return null;

  return (
    <Modal
      title="Đặt lại thiết bị chính"
      open={open}
      onCancel={onClose}
      footer={null}
    >
      <Typography.Paragraph>
        Bạn sắp <strong>gán thiết bị sau làm thiết bị chính</strong> cho người
        dùng:
      </Typography.Paragraph>

      <Descriptions bordered column={1} size="small" className="mb-4">
        <Descriptions.Item label="Người dùng">{device.user}</Descriptions.Item>
        <Descriptions.Item label="Thiết bị">{device.device}</Descriptions.Item>
        <Descriptions.Item label="MAC Address">
          <code>{device.macAddress}</code>
        </Descriptions.Item>
        <Descriptions.Item label="IP Address">
          {device.ipAddress}
        </Descriptions.Item>
        <Descriptions.Item label="Hợp lệ">
          {isAllowedIp(device.ipAddress) ? (
            <Tag color="green">✔ VPN/Công ty</Tag>
          ) : (
            <Tag color="red">IP không hợp lệ</Tag>
          )}
        </Descriptions.Item>
      </Descriptions>

      <div className="flex justify-end space-x-2">
        <Button onClick={onClose}>Hủy</Button>
        <Button
          type="primary"
          danger
          onClick={() => onConfirm(device.deviceId)}
        >
          Đặt làm thiết bị chính
        </Button>
      </div>
    </Modal>
  );
}

function isAllowedIp(ip: string): boolean {
  const allowed = ["123.123.", "10.0."];
  return allowed.some((prefix) => ip.startsWith(prefix));
}
