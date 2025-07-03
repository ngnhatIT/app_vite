import { useEffect, useState } from "react";
import { Table, Avatar, Spin, message, Tooltip } from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  UserAddOutlined,
  LockOutlined,
  PlusOutlined,
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
  removeMembersThunk,
  addMemberThunk,
  changePasswordThunk,
} from "../workspaceThunk";
import {
  AddEditWorkspaceModal,
  ManageMembersModal,
  AddMemberModal,
  ChangePasswordModal,
} from "./ModalWorkspace";

const WorkspaceList = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { t } = useTranslation();

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

  const openModal = (
    type: typeof modalType,
    record: Workspace | null = null
  ) => {
    setSelectedWorkspace(record);
    setModalType(type);
  };

  const closeModal = () => {
    setModalType(null);
    setSelectedWorkspace(null);
  };

  const handleDelete = (workspaceId: string) => {
    dispatch(deleteWorkspaceThunk(workspaceId)).then(() => {
      message.success(t("workspace.deleted"));
    });
  };

  const columns = [
    {
      title: "#",
      render: (_: unknown, __: unknown, index: number) => (
        <span className="text-white">{index + 1}</span>
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
              onClick={() =>
                navigate(`/system/workspace-mng/create/`, {
                   state: { mode: "edit", id: record.workspaceId }
                })
              }
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
        <div className="flex justify-between items-center mb-6 gap-3 flex-wrap">
          <h2 className="text-xl font-semibold text-white">
            {t("workspace.title")}
          </h2>
          <button
            onClick={() =>
              navigate(`/system/workspace-mng/create`, {
                state: { mode: "create" },
              })
            }
            className="px-4 py-2 bg-blue-500 rounded text-white flex items-center gap-1"
          >
            <PlusOutlined />
            {t("workspace.add")}
          </button>
        </div>

        <Table
          rowKey="id"
          dataSource={list}
          columns={columns}
          pagination={false}
          className="!bg-transparent [&_.ant-table-cell]:!text-white"
        />

        {/* MODALS */}
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
              ).then(() => {
                message.success("Members removed");
              });
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
            onSubmit={({
              current,
              next,
              confirm,
            }: {
              current: string;
              next: string;
              confirm: string;
            }) => {
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
