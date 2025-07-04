import { useEffect, useState } from "react";
import { Table, Avatar, Spin, message, Tooltip, Pagination, Modal } from "antd";
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

import {
  addMemberLocal,
  removeMembersLocal,
} from "../workspaceSlice";

import InputComponent from "../../../components/InputComponent";
import ButtonComponent from "../../../components/ButtonComponent";
import LabelComponent from "../../../components/LabelComponent";
import {
  AddEditWorkspaceModal,
  ManageMembersModal,
  AddMemberModal,
  ChangePasswordModal,
} from "./ModalWorkspace";

import "./wsp.css";

const WorkspaceList = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const isDark = useSelector((s: RootState) => s.theme.darkMode);

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
      w.workspaceOwner.toLowerCase().includes(searchText.toLowerCase())
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

  const confirmDelete = (workspaceId: string) => {
    Modal.confirm({
      title: t("workspace.confirmDeleteTitle"),
      content: t("workspace.confirmDeleteContent"),
      okText: t("common.yes"),
      cancelText: t("common.no"),
      onOk: () => {
        dispatch(deleteWorkspaceThunk(workspaceId))
          .then(() => message.success(t("workspace.deleted")))
          .catch((err) => message.error(err?.message || "Delete failed"));
      },
    });
  };

  const columns = [
    {
      title: <LabelComponent label="#" isDark={isDark} />,
      render: (_: any, __: any, index: number) => (
        <LabelComponent
          label={((currentPage - 1) * pageSize + index + 1).toString()}
          isDark={isDark}
        />
      ),
      width: 50,
    },
    {
      title: <LabelComponent label="workspace.columns.workspaceName" isDark={isDark} />,
      dataIndex: "workspaceName",
      render: (text: string) => <LabelComponent label={text} isDark={isDark} />,
    },
    {
      title: <LabelComponent label="workspace.columns.wspOwner" isDark={isDark} />,
      dataIndex: "wspOwner",
      render: (_: unknown, record: Workspace) => (
        <div className="flex items-center gap-2">
          <Avatar src={record.avatar} />
          <div>
            <LabelComponent label={record.workspaceOwner} isDark={isDark} />
            <div className="text-xs">{record.email}</div>
          </div>
        </div>
      ),
    },
    {
      title: <LabelComponent label="workspace.columns.member" isDark={isDark} />,
      dataIndex: "members",
      render: (_: unknown, record: Workspace) => (
        <span>
         {record.members.toString()} {" "}
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
      title: <LabelComponent label="workspace.columns.action" isDark={isDark} />,
      render: (_: unknown, record: Workspace) => (
        <div className="flex gap-2">
          <Tooltip title={t("workspace.tooltip.permission")}>
            <UserAddOutlined
              onClick={() => openModal("addMember", record)}
              className="cursor-pointer"
            />
          </Tooltip>
          <Tooltip title={t("workspace.tooltip.change_password")}>
            <LockOutlined
              onClick={() => openModal("changePassword", record)}
              className="cursor-pointer"
            />
          </Tooltip>
          <Tooltip title={t("workspace.tooltip.edit")}>
            <EditOutlined
              onClick={() =>
                navigate(`/system/workspace-mng/create/`, {
                  state: { mode: "edit", id: record.workspaceId },
                })
              }
              className="cursor-pointer"
            />
          </Tooltip>
          <Tooltip title={t("workspace.tooltip.delete")}>
            <DeleteOutlined
              onClick={() => confirmDelete(record.workspaceId)}
              className="text-red-500 cursor-pointer"
            />
          </Tooltip>
        </div>
      ),
    },
  ];

  return (
    <Spin spinning={loading}>
      <div className="p-4">
        {/* Header */}
        <div className="flex justify-between mb-6 gap-4">
          <LabelComponent label="workspace.title" isDark={isDark} as="h2" />
          <div className="flex gap-3">
            <InputComponent
              type="text"
              icon={<SearchOutlined />}
              placeholder={t("workspace.search_placeholder")}
              isDark={isDark}
              value={searchText}
              onChange={(e) => {
                setSearchText(e.target.value);
                setCurrentPage(1);
              }}
            />
            <ButtonComponent
              icon={<PlusOutlined />}
              onClick={() =>
                navigate(`/system/workspace-mng/create`, {
                  state: { mode: "create" },
                })
              }
              isDark={isDark}
              variant="primary"
              label="workspace.add"
            />
          </div>
        </div>

        {/* Table */}
        <Table
          dataSource={paginatedList}
          rowKey="workspaceId"
          columns={columns}
          pagination={false}
          className="custom-user-table"
        />

        {/* Pagination */}
        <div className="mt-2 flex justify-between">
          <Pagination
            current={currentPage}
            pageSize={pageSize}
            total={list.length}
            onChange={setCurrentPage}
            showSizeChanger={false}
          />
        </div>

        {/* Modals */}
        {modalType === "addMember" && selectedWorkspace && (
          <AddMemberModal
            open
            onClose={closeModal}
            onSubmit={(user_id) => {
              dispatch(
                addMemberThunk({
                  workspaceId: selectedWorkspace.workspaceId,
                  user_id,
                })
              )
                .unwrap()
                .then(() => {
                  message.success(t("workspace.memberAdded"));
                  dispatch(
                    addMemberLocal({ workspaceId: selectedWorkspace.workspaceId })
                  );
                })
                .catch(() => message.error(t("common.error")));
            }}
          />
        )}

        {modalType === "members" && selectedWorkspace && (
          <ManageMembersModal
            open
            onClose={closeModal}
            workspaceId={selectedWorkspace.workspaceId}
            onDeleteMembers={async (memberIds) => {
              try {
                await dispatch(
                  removeMembersThunk({
                    workspaceId: selectedWorkspace.workspaceId,
                    memberIds,
                  })
                ).unwrap();

                message.success(t("workspace.membersRemoved"));
                dispatch(
                  removeMembersLocal({
                    workspaceId: selectedWorkspace.workspaceId,
                    count: memberIds.length,
                  })
                );
                return "ok";
              } catch {
                message.error(t("common.error"));
                return "error";
              }
            }}
          />
        )}

        {modalType === "edit" && selectedWorkspace && (
          <AddEditWorkspaceModal
            open
            onClose={closeModal}
            initialData={selectedWorkspace}
            onSubmit={(payload: any) => {
              dispatch(
                updateWorkspaceThunk({
                  id: selectedWorkspace.workspaceId,
                  ...payload,
                })
              )
                .unwrap()
                .then(() => {
                  message.success(t("workspace.updated"));
                })
                .catch(() => message.error(t("common.error")));
            }}
          />
        )}

        {modalType === "changePassword" && selectedWorkspace && (
          <ChangePasswordModal
            open
            onClose={closeModal}
            onSubmit={({ current, next, confirm }) => {
              if (next !== confirm) {
                message.error(t("workspace.passwordMismatch"));
                return;
              }
              dispatch(
                changePasswordThunk({
                  workspaceId: selectedWorkspace.workspaceId,
                  currentPassword: current,
                  password: next,
                  confirmPassword: confirm,
                })
              )
                .unwrap()
                .then(() => {
                  message.success(t("workspace.passwordChanged"));
                  closeModal();
                })
                .catch(() => message.error(t("common.error")));
            }}
          />
        )}
      </div>
    </Spin>
  );
};

export default WorkspaceList;
