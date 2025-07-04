import { useEffect, useState } from "react";
import {
  Table,
  Avatar,
  Tooltip,
  Checkbox,
  Space,
  Spin,
  message,
  Pagination,
  Modal,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  ExclamationCircleOutlined,
  StopOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import ButtonComponent from "../../../components/ButtonComponent";
import LabelComponent from "../../../components/LabelComponent";
import InputComponent from "../../../components/InputComponent";
import { fetchUsersThunk, updateUserStatusThunk } from "../userThunk";
import type { RootState, AppDispatch } from "../../../app/store";
import "./user.css";

interface User {
  user_id: string;
  username: string;
  email: string;
  avatar?: string;
  role: string;
  is_active: boolean;
  ip_check: boolean;
}

const UserList = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  const [confirmLoading, setConfirmLoading] = useState(false);

  const isDark = useSelector((state: RootState) => state.theme.darkMode);
  const users = useSelector((state: RootState) => state.user.users) as User[];
  const userStatus = useSelector((state: RootState) => state.user.status);
  const error = useSelector((state: RootState) => state.user.error);

  useEffect(() => {
    dispatch(fetchUsersThunk());
  }, [dispatch]);

  useEffect(() => {
    if (userStatus.toggleStatus === "succeeded") {
      message.success(t("user_list.user.updated"));
    } else if (userStatus.toggleStatus === "failed" && error) {
      message.error(error || t("user_list.form.submitFailed"));
    }
  }, [userStatus.toggleStatus, error, t]);

  const filteredUsers = users.filter(
    (u) =>
      u.username.toLowerCase().includes(searchText.toLowerCase()) ||
      u.email.toLowerCase().includes(searchText.toLowerCase())
  );

  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handleEdit = (user_id: string) => {
    navigate(`/users/update`, {
      state: { userId: user_id },
    });
  };

  const handleStatusToggle = (userId: string, current: boolean) => {
    Modal.confirm({
      title: t(
        current
          ? "user_list.modal.title_deactivate"
          : "user_list.modal.title_activate"
      ),
      icon: <ExclamationCircleOutlined />,
      content: t("user_list.modal.confirm", {
        action: current
          ? t("user_list.tooltip.deactivate")
          : t("user_list.tooltip.activate"),
      }),
      okText: t("user_list.modal.ok"),
      cancelText: t("user_list.modal.cancel"),
      onOk: async () => {
        setConfirmLoading(true);
        await dispatch(
          updateUserStatusThunk({ user_id: userId, is_active: !current })
        );
        setConfirmLoading(false);
      },
    });
  };

  const columns = [
    {
      title: "",
      dataIndex: "checkbox",
      width: "5%",
      render: () => <Checkbox />,
    },
    {
      title: <LabelComponent label="user_list.columns.name" isDark={isDark} />,
      dataIndex: "username",
      width: "45%",
      sorter: (a: User, b: User) => a.username.localeCompare(b.username),
      render: (_: unknown, record: User) => (
        <div className="flex items-center gap-2">
          <Avatar src={record.avatar} />
          <div>
            <div>
              <LabelComponent label={record.username} isDark={isDark} />
            </div>
            <div className="text-sm text-gray-400">{record.email}</div>
          </div>
        </div>
      ),
    },
    {
      title: <LabelComponent label="user_list.columns.role" isDark={isDark} />,
      dataIndex: "role",
      width: "15%",
      render: (role: string) => <span className="capitalize">{role}</span>,
    },
    {
      title: (
        <LabelComponent label="user_list.columns.status" isDark={isDark} />
      ),
      dataIndex: "is_active",
      width: "15%",
      render: (active: boolean) => (
        <span
          className={`px-2 py-1 rounded text-sm ${
            active ? "bg-green-500 text-white" : "bg-gray-400 text-white"
          }`}
        >
          {active
            ? t("user_list.status.active")
            : t("user_list.status.inactive")}
        </span>
      ),
    },
    {
      title: (
        <LabelComponent label="user_list.columns.ipCheck" isDark={isDark} />
      ),
      dataIndex: "ip_check",
      width: "10%",
      render: (_: unknown, record: User) => (
        <Checkbox checked={record.ip_check} disabled />
      ),
    },
    {
      title: (
        <LabelComponent label="user_list.columns.action" isDark={isDark} />
      ),
      width: "10%",
      render: (_: unknown, record: User) => (
        <Space>
          <Tooltip
            title={t("user_list.tooltip.edit")}
            color={isDark ? "#000" : "#555"}
          >
            <button
              onClick={() => handleEdit(record.user_id)}
              className="text-white hover:text-purple-400"
            >
              <EditOutlined style={{ color: isDark ? "#fff" : "#000" }} />
            </button>
          </Tooltip>
          <Tooltip
            title={
              record.is_active
                ? t("user_list.tooltip.deactivate")
                : t("user_list.tooltip.activate")
            }
            color={isDark ? "#000" : "#555"}
          >
            <button
              onClick={() =>
                handleStatusToggle(record.user_id, record.is_active)
              }
              className={`${
                record.is_active
                  ? "text-green-500 hover:text-green-400"
                  : "text-red-500 hover:text-red-400"
              }`}
            >
              {record.is_active ? (
                <CheckCircleOutlined
                  style={{
                    fontSize: 16,
                    color: isDark ? "lightgreen" : "green",
                  }}
                />
              ) : (
                <StopOutlined
                  style={{
                    fontSize: 16,
                    color: isDark ? "red" : "#f00",
                  }}
                />
              )}
            </button>
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <Spin spinning={userStatus.list === "loading" || confirmLoading}>
      <div>
        {/* Header */}
        <div className="flex justify-between items-center mb-6 flex-wrap gap-4 px-2">
          <div className="flex gap-3 items-center w-full">
            <LabelComponent
              label="user_list.title"
              as="h2"
              isDark={isDark}
              className="text-[32px] font-semibold flex-5"
            />
            <div className="flex-2">
              <InputComponent
                type="text"
                icon={
                  <EditOutlined style={{ color: isDark ? "#fff" : "#000" }} />
                }
                placeholder={t("user_list.search_placeholder")}
                isDark={isDark}
                height="48px"
                className="rounded-lg border border-white/10 bg-white/5 text-white placeholder:text-white/50 w-full"
                value={searchText}
                onChange={(e) => {
                  setSearchText(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>

            <div>
              <ButtonComponent
                icon={
                  <PlusOutlined style={{ color: isDark ? "#fff" : "#000" }} />
                }
                onClick={() => navigate("/users/create")}
                isDark={isDark}
                variant="primary"
                height="48px"
                label="user_list.add_user"
              />
            </div>
          </div>
        </div>

        {/* Table */}
        <Table<User>
          dataSource={paginatedUsers}
          rowKey="user_id"
          pagination={false}
          columns={columns}
          locale={{
            emptyText: (
              <div className="text-white/60 italic py-6 text-sm text-center">
                {t("user_list.empty")}
              </div>
            ),
          }}
          className="custom-user-table"
        />

        {/* Pagination */}
        <div className="mt-2 flex items-center justify-between w-full flex-wrap gap-2">
          <div className="flex items-center gap-2 text-white text-sm">
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setCurrentPage(1);
              }}
              className={`
    rounded-md border px-3 py-1 text-sm font-medium
    min-w-[80px] cursor-pointer appearance-none
    focus:outline-none
    ${
      isDark
        ? "bg-gray-800 border-gray-600 text-white"
        : "bg-white border-gray-300 text-black"
    }
  `}
              style={{
                WebkitAppearance: "none", // Safari + Chrome
                MozAppearance: "none", // Firefox
                appearance: "none",
                color: isDark ? "#fff" : "#000", // giá trị hiển thị chính
                backgroundImage: `url("data:image/svg+xml,%3Csvg fill='%23${
                  isDark ? "ffffff" : "000000"
                }' viewBox='0 0 24 24'%3E%3Cpath d='M7 10l5 5 5-5z'/%3E%3C/svg%3E")`,
                backgroundRepeat: "no-repeat",
                backgroundPosition: "right 0.5rem center",
                backgroundSize: "1rem",
                WebkitTextFillColor: isDark ? "#fff" : "#000", // fix Webkit render
              }}
            >
              {[8, 16, 24].map((size) => (
                <option
                  key={size}
                  value={size}
                  className="text-black" // option màu đen (trình duyệt tự lo)
                >
                  {size}
                </option>
              ))}
            </select>

            <span className="text-white/70">
              {(currentPage - 1) * pageSize + 1}–
              {Math.min(currentPage * pageSize, filteredUsers.length)}{" "}
              {t("user_list.pagination.of")} {filteredUsers.length}
            </span>
          </div>

          <div>
            <Pagination
              current={currentPage}
              pageSize={pageSize}
              total={filteredUsers.length}
              onChange={setCurrentPage}
              showSizeChanger={false}
              showLessItems
              className="custom-pagination"
            />
          </div>
        </div>
      </div>
    </Spin>
  );
};

export default UserList;
