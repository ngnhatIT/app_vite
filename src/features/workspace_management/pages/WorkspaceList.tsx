// 📁 src/features/workspace/WorkspaceManagement.tsx
import { useEffect, useState } from "react";
import {
  Table,
  Button,
  Modal,
  Input,
  Avatar,
  Tooltip,
  message,
  Spin,
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  LockOutlined,
  UserAddOutlined,
} from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../../app/store";

import { useTranslation } from "react-i18next";
import { deleteWorkspaceThunk, fetchWorkspacesThunk } from "../workspaceThunk";
import { useNavigate } from "react-router-dom";

const WorkspaceManagement = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { t } = useTranslation();

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(8);
  const [searchText, setSearchText] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const navigate = useNavigate();

  const { list, total, status } = useSelector(
    (state: RootState) => state.workspaceMng
  );
  const loading = status === "loading";

  useEffect(() => {
    dispatch(
      fetchWorkspacesThunk({ page: currentPage, pageSize, search: searchText })
    );
  }, [dispatch, currentPage, pageSize, searchText]);

  const handleDelete = (workspaceId: string) => {
    Modal.confirm({
      title: t("workspace.delete_title"),
      content: t("workspace.delete_confirm"),
      okText: t("workspace.ok_delete"),
      cancelText: t("workspace.cancel"),
      onOk: async () => {
        await dispatch(deleteWorkspaceThunk(workspaceId));
        dispatch(
          fetchWorkspacesThunk({
            page: currentPage,
            pageSize,
            search: searchText,
          })
        );
        message.success(t("workspace.deleted"));
      },
    });
  };

  const columns = [
    {
      title: "",
      render: () => <input type="checkbox" className="accent-purple-500" />,
      width: 40,
    },
    {
      title: "#",
      render: (_: any, __: any, index: number) => (
        <span className="text-white">
          {(currentPage - 1) * pageSize + index + 1}
        </span>
      ),
      width: 50,
    },
    {
      title: t("workspace.columns.name"),
      dataIndex: "name",
      render: (text: string) => (
        <span className="text-white font-medium">{text}</span>
      ),
    },
    {
      title: t("workspace.columns.owner"),
      dataIndex: "owner",
      render: (_: any, record: any) => (
        <div className="flex items-center gap-2">
          <Avatar src={record.avatar} />
          <div className="text-white">
            <div>{record.owner}</div>
            <div className="text-white/60 text-sm">{record.email}</div>
          </div>
        </div>
      ),
    },
    {
      title: t("workspace.columns.member"),
      dataIndex: "members",
      render: (count: number) => (
        <span className="text-white">
          {count}{" "}
          <a className="underline text-fuchsia-500 cursor-pointer">
            {t("workspace.view_detail")}
          </a>
        </span>
      ),
    },
    {
      title: t("workspace.columns.action"),
      render: (_: any, record: any) => (
        <div className="flex gap-2">
          <Tooltip title={t("workspace.tooltip.permission")}>
            {" "}
            <UserAddOutlined className="text-white cursor-pointer" />
          </Tooltip>
          <Tooltip title={t("workspace.tooltip.change_password")}>
            {" "}
            <LockOutlined className="text-white cursor-pointer" />
          </Tooltip>
          <Tooltip title={t("workspace.tooltip.edit")}>
            {" "}
            <EditOutlined className="text-white cursor-pointer" />
          </Tooltip>
          <Tooltip title={t("workspace.tooltip.delete")}>
            {" "}
            <DeleteOutlined
              onClick={() => handleDelete(record.id)}
              className="text-red-500 cursor-pointer"
            />
          </Tooltip>
        </div>
      ),
    },
  ];

  return (
    <Spin spinning={loading} size="large">
      <div className="p-4">
        <div className="flex justify-between items-center mb-6 gap-3 flex-wrap">
          <h2 className="text-xl font-semibold text-white">
            {t("workspace.title")}
          </h2>
          <div className="flex gap-2">
            <Input
              placeholder={t("workspace.search")}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="w-[300px] text-white bg-white/10 border-white/20"
            />
            <Button
              icon={<PlusOutlined />}
              onClick={() => navigate("/system/workspace-mng/create")}
            >
              {t("workspace.add")}
            </Button>
          </div>
        </div>

        <Table
          rowKey="id"
          dataSource={list}
          columns={columns}
          pagination={false}
          className="!bg-transparent [&_.ant-table-cell]:!text-white"
        />

        <div className="flex justify-between items-center mt-4 text-white">
          <span className="text-sm">
            {list.length === 0
              ? "0"
              : `${(currentPage - 1) * pageSize + 1} - ${
                  (currentPage - 1) * pageSize + list.length
                } of ${total}`}
          </span>
          <div className="flex gap-2">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              className="w-8 h-8 bg-[#1d152f] rounded text-white/70 hover:text-white disabled:opacity-40"
            >
              &lt;
            </button>
            <button
              disabled={currentPage * pageSize >= total}
              onClick={() =>
                setCurrentPage((prev) =>
                  Math.min(prev + 1, Math.ceil(total / pageSize))
                )
              }
              className="w-8 h-8 bg-[#1d152f] rounded text-white/70 hover:text-white disabled:opacity-40"
            >
              &gt;
            </button>
          </div>
        </div>
      </div>
    </Spin>
  );
};

export default WorkspaceManagement;
