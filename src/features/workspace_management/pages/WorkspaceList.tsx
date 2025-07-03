import { useEffect, useState } from "react";
import { Table, Button, Space, Popconfirm, message } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

import { fetchWorkspacesThunk, deleteWorkspaceThunk } from "../workspaceThunk";
import ModalWorkspace from "./ModalWorkspace";
import type { RootState, AppDispatch } from "../../../app/store";

const WorkspaceList = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { t } = useTranslation();
  const [modalVisible, setModalVisible] = useState(false);
  const [editingWorkspace, setEditingWorkspace] = useState(null);

  const workspaces = useSelector((state: RootState) => state.workspaceMng.list);
  const loading = useSelector((state: RootState) => state.workspaceMng.loading);

  useEffect(() => {
    dispatch(fetchWorkspacesThunk());
  }, [dispatch]);

  const handleDelete = async (id: string) => {
    try {
      await dispatch(deleteWorkspaceThunk(id)).unwrap();
      message.success(t("workspace.deleteSuccess"));
    } catch {
      message.error(t("workspace.deleteFailed"));
    }
  };

  const columns = [
    {
      title: t("workspace.name"),
      dataIndex: "name",
      key: "name",
    },
    {
      title: t("workspace.owner"),
      dataIndex: "owner",
      key: "owner",
    },
    {
      title: t("workspace.desc"),
      dataIndex: "desc",
      key: "desc",
    },
    {
      title: t("common.actions"),
      key: "actions",
      render: (_: any, record: any) => (
        <Space>
          <Button
            type="link"
            onClick={() => {
              setEditingWorkspace(record);
              setModalVisible(true);
            }}
          >
            {t("common.edit")}
          </Button>
          <Popconfirm
            title={t("workspace.confirmDelete")}
            onConfirm={() => handleDelete(record.id)}
            okText={t("common.yes")}
            cancelText={t("common.no")}
          >
            <Button danger type="link">
              {t("common.delete")}
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="w-full px-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">
          {t("workspace.title") || "Workspaces"}
        </h2>
        <Button
          type="primary"
          onClick={() => {
            setEditingWorkspace(null);
            setModalVisible(true);
          }}
        >
          {t("workspace.add")}
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={workspaces}
        loading={loading}
        rowKey="id"
        bordered
      />

      {modalVisible && (
        <ModalWorkspace
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          onSubmit={() => {
            setModalVisible(false);
            dispatch(fetchWorkspacesThunk());
          }}
          initialValues={editingWorkspace}
        />
      )}
    </div>
  );
};

export default WorkspaceList;
