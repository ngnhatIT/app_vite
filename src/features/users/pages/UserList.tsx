import { useEffect, useState } from "react";
import {
  Table,
  Button,
  Space,
  Avatar,
  Tooltip,
  Pagination,
  Modal,
  Spin,
  Checkbox,
  message,
} from "antd";
import {
  PlusOutlined,
  SearchOutlined,
  EditOutlined,
  CheckOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsersThunk, updateUserStatusThunk } from "../userThunk";
import type { RootState, AppDispatch } from "../../../app/store";
import PrimaryButton from "../../../components/ButtonComponent";
import InputComponent from "../../../components/InputComponent";
import { useTranslation } from "react-i18next";
import LabelComponent from "../../../components/LabelComponent";

const UserList = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  const [confirmLoading, setConfirmLoading] = useState(false);

  const isDark = useSelector((state: RootState) => state.theme.darkMode);
  const users = useSelector((state: RootState) => state.user.users);
  const userStatus = useSelector((state: RootState) => state.user.status);
  const lastFetched = useSelector((state: RootState) => state.user.lastFetched);
  const error = useSelector((state: RootState) => state.user.error);

  useEffect(() => {
    const FIVE_MINUTES = 5 * 60 * 1000;
    if (!lastFetched || Date.now() - lastFetched > FIVE_MINUTES) {
      dispatch(fetchUsersThunk());
    }
  }, [dispatch, lastFetched]);

  useEffect(() => {
    if (userStatus.toggleStatus === "succeeded") {
      message.success(
        t("user_list.user.updated") || "User status updated successfully"
      );
    } else if (userStatus.toggleStatus === "failed" && error) {
      message.error(
        error ||
          t("user_list.form.submitFailed") ||
          "Failed to update user status"
      );
    }
  }, [userStatus.toggleStatus, error]);

  const filteredUsers = users.filter(
    (u) =>
      u.username.toLowerCase().includes(searchText.toLowerCase()) ||
      u.email.toLowerCase().includes(searchText.toLowerCase())
  );

  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

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

  return (
    <Spin
      spinning={userStatus.list === "loading" || confirmLoading}
      size="large"
    >
      <div>
        <div className="flex justify-between items-center mb-6 flex-wrap gap-4 px-2">
          <h2 className="text-xl font-semibold text-white">
            {t("user_list.title")}
          </h2>

          <div className="flex gap-3">
            <InputComponent
              type="text"
              icon={<SearchOutlined />}
              placeholder={t("user_list.search_placeholder")}
              isDark={isDark}
              height="48px"
              width={600}
              className="rounded-lg border border-white/10 bg-white/5 text-white placeholder:text-white/50"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
            <div className="flex-1">
              <PrimaryButton
                icon={<PlusOutlined />}
                onClick={() => navigate("/users/create")}
                className="width-[300px] h-12 px-5 rounded-lg font-medium text-white bg-gradient-to-r from-fuchsia-600 to-purple-600 hover:from-fuchsia-500 hover:to-purple-500"
              >
                <LabelComponent label="user_list.add_user" isDark={isDark} />
              </PrimaryButton>
            </div>
          </div>
        </div>

        <div style={{ height: "calc(100vh - 400px)", overflowY: "auto" }}>
          <Table
            dataSource={paginatedUsers}
            rowKey="user_id"
            pagination={false}
            rowClassName={() => "bg-transparent"}
            locale={{
              emptyText: (
                <div className="text-white/60 italic py-6 text-sm text-center">
                  {t("user_list.empty")}
                </div>
              ),
            }}
            columns={[
              {
                title: "",
                dataIndex: "checkbox",
                width: 40,
                render: () => (
                  <input type="checkbox" className="accent-purple-500" />
                ),
              },
              {
                title: "#",
                width: 50,
                render: (_: any, __: any, index: number) => (
                  <span className="text-white">
                    {(currentPage - 1) * pageSize + index + 1}
                  </span>
                ),
              },
              {
                title: t("user_list.columns.name"),
                dataIndex: "username",
                render: (_: any, record: any) => (
                  <div className="flex items-center gap-3">
                    <Avatar className="bg-purple-500 text-white">
                      {record.username[0]}
                    </Avatar>
                    <div>
                      <div className="font-medium text-white">
                        {record.username}
                      </div>
                      <div className="text-gray-400 text-sm">
                        {record.email}
                      </div>
                    </div>
                  </div>
                ),
              },
              {
                title: t("user_list.columns.role"),
                dataIndex: "role",
                render: (role: string) => (
                  <span className="text-white">{role}</span>
                ),
              },
              {
                title: t("user_list.columns.status"),
                dataIndex: "is_active",
                render: (active: boolean) => (
                  <span
                    className={`px-3 py-1 text-xs rounded-full ${
                      active
                        ? "bg-green-500 text-white"
                        : "bg-gray-400 text-white"
                    }`}
                  >
                    {active
                      ? t("user_list.status.active")
                      : t("user_list.status.inactive")}
                  </span>
                ),
              },
              {
                title: t("user_list.columns.isCheck"),
                render: (_: any, record: any) => (
                  <Checkbox checked={record.ip_check} disabled />
                ),
              },
              {
                title: t("user_list.columns.action"),
                render: (_: any, record: any) => (
                  <Space>
                    <Tooltip title={t("user_list.tooltip.edit")}>
                      <Button
                        icon={<EditOutlined />}
                        shape="circle"
                        className="bg-transparent border border-white text-white hover:!bg-white hover:!text-black"
                        onClick={() => {
                          navigate(`/users/update`, {
                            state: { user_id: record.user_id },
                          });
                        }}
                      />
                    </Tooltip>
                    <Tooltip
                      title={
                        record.is_active
                          ? t("user_list.tooltip.deactivate")
                          : t("user_list.tooltip.activate")
                      }
                    >
                      <Button
                        icon={
                          record.is_active ? (
                            <CheckOutlined />
                          ) : (
                            <ExclamationCircleOutlined />
                          )
                        }
                        shape="circle"
                        className={`bg-transparent border ${
                          record.is_active
                            ? "border-red-500 text-red-500 hover:!bg-red-500 hover:!text-white"
                            : "border-green-500 text-green-500 hover:!bg-green-500 hover:!text-white"
                        }`}
                        onClick={() =>
                          handleStatusToggle(record.user_id, record.is_active)
                        }
                      />
                    </Tooltip>
                  </Space>
                ),
              },
            ]}
            className="!bg-transparent [&_.ant-table-cell]:!text-white"
          />
        </div>

        <div className="mt-2 flex items-center justify-between w-full">
          <div className="flex items-center gap-2 text-white text-sm">
            <select
              className="bg-transparent border border-gray-500 rounded px-2 py-[2px] text-sm text-white"
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setCurrentPage(1);
              }}
            >
              {[8, 16, 24].map((size) => (
                <option key={size} value={size} className="text-black">
                  {size}
                </option>
              ))}
            </select>
            <span className="text-white/70">
              {(currentPage - 1) * pageSize + 1}–
              {Math.min(currentPage * pageSize, filteredUsers.length)} of{" "}
              {filteredUsers.length}
            </span>
          </div>

          <Pagination
            current={currentPage}
            pageSize={pageSize}
            total={filteredUsers.length}
            onChange={(page) => setCurrentPage(page)}
            showSizeChanger={false}
            prevIcon={null}
            nextIcon={null}
            className="text-white [&_.ant-pagination-item-active]:!bg-[#9747FF] [&_.ant-pagination-item-active>a]:!text-white"
          />

          <div className="flex gap-2">
            <button
              disabled={currentPage === 1 || filteredUsers.length === 0}
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              className="w-8 h-8 rounded-md bg-[#1d152f] flex items-center justify-center text-white/70 hover:text-white disabled:opacity-40"
            >
              &lt;
            </button>
            <button
              disabled={
                currentPage === Math.ceil(filteredUsers.length / pageSize) ||
                filteredUsers.length === 0
              }
              onClick={() =>
                setCurrentPage((prev) =>
                  Math.min(prev + 1, Math.ceil(filteredUsers.length / pageSize))
                )
              }
              className="w-8 h-8 rounded-md bg-[#1d152f] flex items-center justify-center text-white/70 hover:text-white disabled:opacity-40"
            >
              &gt;
            </button>
          </div>
        </div>
      </div>
    </Spin>
  );
};

export default UserList;
