// WorkspaceList.tsx — Updated Table Background Transparent

import { useEffect, useState } from "react";
import { Table, Avatar, Spin, message, Tooltip, Pagination } from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  UserAddOutlined,
  LockOutlined,
  PlusOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import type { AppDispatch, RootState } from "../../../app/store";
import type { Workspace } from "../dto/workSpaceDTO";
import {
  fetchWorkspacesThunk,
  deleteWorkspaceThunk,
  updateWorkspaceThunk,
  addMemberThunk,
  removeMembersThunk,
  changePasswordThunk,
} from "../workspaceThunk";
import InputComponent from "../../../components/InputComponent";
import {
  AddEditWorkspaceModal,
  ManageMembersModal,
  AddMemberModal,
  ChangePasswordModal,
} from "./ModalWorkspace";
import ButtonComponent from "../../../components/ButtonComponent";

const WorkspaceList = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  const [modalType, setModalType] = useState<
    null | "edit" | "members" | "addMember" | "changePassword"
  >(null);
  const [selectedWorkspace, setSelectedWorkspace] = useState<Workspace | null>(
    null
  );

  const { list, status } = useSelector(
    (state: RootState) => state.workspaceMng
  );
  const loading = status === "loading";

  useEffect(() => {
    dispatch(fetchWorkspacesThunk());
  }, [dispatch]);

  const filteredList = list.filter(
    (w) =>
      w.workspaceName.toLowerCase().includes(searchText.toLowerCase()) ||
      w.wspOwner.toLowerCase().includes(searchText.toLowerCase())
  );

  const paginatedList = filteredList.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const openModal = (type: typeof modalType, workspace: Workspace | null) => {
    setSelectedWorkspace(workspace);
    setModalType(type);
  };

  const closeModal = () => {
    setSelectedWorkspace(null);
    setModalType(null);
  };

  const handleDelete = (workspaceId: string) => {
    dispatch(deleteWorkspaceThunk(workspaceId))
      .then(() => message.success(t("workspace.deleted")))
      .catch((err) => message.error(err?.message || "Delete failed"));
  };

  const columns = [
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
      title: t("workspace.columns.workspaceName"),
      dataIndex: "workspaceName",
      render: (text: string) => (
        <span className="text-white font-medium">{text}</span>
      ),
    },
    {
      title: t("workspace.columns.wspOwner"),
      dataIndex: "wspOwner",
      render: (_: unknown, record: Workspace) => (
        <div className="flex items-center gap-2">
          <Avatar src={record.avatar} />
          <div className="text-white">
            <div>{record.wspOwner}</div>
            <div className="text-white/60 text-sm">{record.email}</div>
          </div>
        </div>
      ),
    },
    {
      title: t("workspace.columns.member"),
      dataIndex: "members",
      render: (_: unknown, record: Workspace) => (
        <span className="text-white">
          {record.members}{" "}
          <a
            className="underline text-fuchsia-500 cursor-pointer"
            onClick={() => openModal("members", record)}
          >
            {t("workspace.view_detail")}
          </a>
        </span>
      ),
    },
    {
      title: t("workspace.columns.action"),
      render: (_: unknown, record: Workspace) => (
        <div className="flex gap-2">
          <Tooltip title={t("workspace.tooltip.permission")}>
            <UserAddOutlined
              onClick={() => openModal("addMember", record)}
              className="text-white cursor-pointer"
            />
          </Tooltip>
          <Tooltip title={t("workspace.tooltip.change_password")}>
            <LockOutlined
              onClick={() => openModal("changePassword", record)}
              className="text-white cursor-pointer"
            />
          </Tooltip>
          <Tooltip title={t("workspace.tooltip.edit")}>
            <EditOutlined
              onClick={() => openModal("edit", record)}
              className="text-white cursor-pointer"
            />
          </Tooltip>
          <Tooltip title={t("workspace.tooltip.delete")}>
            <DeleteOutlined
              onClick={() => handleDelete(record.workspaceId)}
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
        <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
          <h2 className="text-xl font-semibold text-white">
            {t("workspace.title")}
          </h2>

          <div className="flex gap-3">
            <InputComponent
              type="text"
              icon={<SearchOutlined />}
              placeholder={t("workspace.search_placeholder")}
              isDark
              height="48px"
              width={600}
              className="rounded-lg border border-white/10 bg-white/5 text-white placeholder:text-white/50"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />

            <ButtonComponent
              variant="primary"
              onClick={() =>
                navigate(`/system/workspace-mng/create`, {
                  state: { mode: "create" },
                })
              }
              className="px-4 py-2 flex-1"
            >
              <PlusOutlined /> {t("workspace.add")}
            </ButtonComponent>
          </div>
        </div>

        <Table
          dataSource={paginatedList}
          rowKey="workspaceId"
          columns={columns}
          pagination={false}
          className="!bg-transparent [&_.ant-table]:!bg-transparent [&_.ant-table-cell]:!bg-transparent [&_.ant-table-thead]:!bg-transparent [&_.ant-table-tbody]:!bg-transparent [&_.ant-table-cell]:!text-white"
        />

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
              {Math.min(currentPage * pageSize, filteredList.length)} of{" "}
              {filteredList.length}
            </span>
          </div>

          <Pagination
            current={currentPage}
            pageSize={pageSize}
            total={filteredList.length}
            onChange={(page) => setCurrentPage(page)}
            showSizeChanger={false}
            prevIcon={null}
            nextIcon={null}
            className="text-white [&_.ant-pagination-item-active]:!bg-[#9747FF] [&_.ant-pagination-item-active>a]:!text-white"
          />

          <div className="flex gap-2">
            <button
              disabled={currentPage === 1 || filteredList.length === 0}
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              className="w-8 h-8 rounded-md bg-[#1d152f] flex items-center justify-center text-white/70 hover:text-white disabled:opacity-40"
            >
              &lt;
            </button>
            <button
              disabled={
                currentPage === Math.ceil(filteredList.length / pageSize) ||
                filteredList.length === 0
              }
              onClick={() =>
                setCurrentPage((prev) =>
                  Math.min(prev + 1, Math.ceil(filteredList.length / pageSize))
                )
              }
              className="w-8 h-8 rounded-md bg-[#1d152f] flex items-center justify-center text-white/70 hover:text-white disabled:opacity-40"
            >
              &gt;
            </button>
          </div>
        </div>

        {/* Modals remain as before */}
        {modalType === "edit" && selectedWorkspace && (
          <AddEditWorkspaceModal
            open
            onClose={closeModal}
            initialData={selectedWorkspace}
            onSubmit={(payload) => {
              dispatch(
                updateWorkspaceThunk({
                  id: selectedWorkspace.workspaceId,
                  ...payload,
                })
              ).then(() => {
                message.success("Updated");
                closeModal();
              });
            }}
          />
        )}

        {modalType === "members" && selectedWorkspace && (
          <ManageMembersModal
            open
            onClose={closeModal}
            workspaceId={selectedWorkspace.workspaceId}
            onDeleteMembers={(memberIds) => {
              dispatch(
                removeMembersThunk({
                  workspaceId: selectedWorkspace.workspaceId,
                  memberIds,
                })
              ).then(() => message.success("Members removed"));
            }}
          />
        )}

        {modalType === "addMember" && selectedWorkspace && (
          <AddMemberModal
            open
            onClose={closeModal}
            onSubmit={(userId) => {
              dispatch(
                addMemberThunk({
                  workspaceId: selectedWorkspace.workspaceId,
                  userId,
                })
              ).then(() => {
                message.success("Member added");
                closeModal();
              });
            }}
          />
        )}

        {modalType === "changePassword" && selectedWorkspace && (
          <ChangePasswordModal
            open
            onClose={closeModal}
            onSubmit={({ current, next, confirm }) => {
              if (next !== confirm) {
                message.error("Passwords do not match");
                return;
              }
              dispatch(
                changePasswordThunk({
                  workspaceId: selectedWorkspace.workspaceId,
                  currentPassword: current,
                  password: next,
                  confirmPassword: confirm,
                })
              ).then(() => {
                message.success("Password changed");
                closeModal();
              });
            }}
          />
        )}
      </div>
    </Spin>
  );
};

export default WorkspaceList;
