import { useEffect, useState, useRef } from "react";
import { Table, Tooltip, Spin, Pagination, message, Tag } from "antd";
import {
  SearchOutlined,
  SettingOutlined,
  PlusOutlined,
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  CommentOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  UserAddOutlined,
} from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import ButtonComponent from "../../../components/ButtonComponent";
import InputComponent from "../../../components/InputComponent";
import LabelComponent from "../../../components/LabelComponent";
import { fetchFiles, deleteFile } from "../workspceThunk";
import AddNewFileModal from "./AddNewFileModal";
import type { AppDispatch, RootState } from "../../../app/store";
import type { GoogleSheetFile } from "../dto/workspaceDTO";

export default function WorkspaceFiles() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();

  const [searchText, setSearchText] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(8);

  const { files, loading } = useSelector((state: RootState) => state.workspace);
  const isDark = useSelector((state: RootState) => state.theme.darkMode);
  const locationWorkspaceId = location.state?.workspaceId;
  const workspaceId: string | undefined = locationWorkspaceId;
  const workspaceName: string = location.state?.workspaceName || "Workspace";

  const hasFetched = useRef(false);

  const fetchFilesData = async (wspId: string) => {
    try {
      const result = await dispatch(fetchFiles({ wspId })).unwrap();
      console.log("fetchFilesData result:", result); // Debug log
    } catch (error) {
      console.error("fetchFilesData error:", error);
      message.error(t("workspace.files.fetchFailed"));
      navigate("/");
    }
  };

  useEffect(() => {
    if (!workspaceId) {
      navigate("/");
      return;
    }

    if (hasFetched.current) return;
    hasFetched.current = true;

    fetchFilesData(workspaceId);
  }, [workspaceId, navigate, dispatch]);

  const handleDelete = async (sheetId: string) => {
    if (!workspaceId) return;
    try {
      await dispatch(
        deleteFile({ googleSheetId: sheetId, wspId: workspaceId })
      ).unwrap();
      await fetchFilesData(workspaceId);
      message.success(t("workspace.files.deleteSuccess"));
    } catch (error) {
      message.error(t("workspace.files.deleteFailed"));
    }
  };

  const handleView = (googleSheetId: string) => {
    navigate(`/workspace/view/${googleSheetId}`, {
      state: { workspaceId, workspaceName },
    });
  };

  const handleEdit = (googleSheetId: string) => {
    navigate(`/workspace/edit/${googleSheetId}`, {
      state: { workspaceId, workspaceName },
    });
  };

  const handleComment = (googleSheetId: string) => {
    navigate(`/workspace/comment/${googleSheetId}`, {
      state: { workspaceId, workspaceName },
    });
  };

  const handleAddMembers = (googleSheetId: string) => {
    navigate(`/workspace/permissions`, {
      state: { sheetId: googleSheetId, workspaceId, workspaceName },
    });
  };

  const handleFileAdded = () => {
    if (workspaceId) {
      fetchFilesData(workspaceId);
    }
  };

  const filteredFiles = Array.isArray(files)
    ? files.filter((f) => {
        console.log("Filtering file:", f); // Debug each file
        return f.sheetName?.toLowerCase().includes(searchText.toLowerCase());
      })
    : [];
  console.log("filteredFiles:", filteredFiles); // Debug filteredFiles

  const paginatedFiles = filteredFiles.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );
  console.log("paginatedFiles:", paginatedFiles); // Debug paginatedFiles

  const columns = [
    {
      title: "#",
      dataIndex: "index",
      width: "5%",
      render: (_: unknown, __: any, idx: number) =>
        (currentPage - 1) * pageSize + idx + 1,
    },
    {
      title: t("workspace.files.filename"),
      dataIndex: "sheetName",
      render: (name: string) => (
        <LabelComponent
          label={name || "Untitled"}
          isDark={isDark}
          className="truncate max-w-[150px]"
        />
      ),
    },
    {
      title: t("workspace.files.updatedAt"),
      dataIndex: "updatedAt",
      render: (date: string) => (date ? new Date(date).toLocaleString() : "-"),
    },
    {
      title: t("workspace.files.action"),
      width: "20%",
      render: (_: unknown, record: GoogleSheetFile) => (
        <div className="flex gap-2">
          <Tooltip title={t("workspace.files.view")}>
            <button
              onClick={() => handleView(record.sheetId)}
              className="text-blue-500 hover:text-blue-400"
            >
              <EyeOutlined />
            </button>
          </Tooltip>
          <Tooltip title={t("workspace.files.edit")}>
            <button
              onClick={() => handleEdit(record.sheetId)}
              className="text-yellow-500 hover:text-yellow-400"
            >
              <EditOutlined />
            </button>
          </Tooltip>
          <Tooltip title={t("workspace.files.comment")}>
            <button
              onClick={() => handleComment(record.sheetId)}
              className="text-purple-500 hover:text-purple-400"
            >
              <CommentOutlined />
            </button>
          </Tooltip>
          <Tooltip title={t("workspace.files.addMembers")}>
            <button
              onClick={() => handleAddMembers(record.sheetId)}
              className="text-green-500 hover:text-green-400"
            >
              <UserAddOutlined />
            </button>
          </Tooltip>
          <Tooltip title={t("workspace.files.delete")}>
            <button
              onClick={() => handleDelete(record.sheetId)}
              className="text-red-500 hover:text-red-400"
            >
              <DeleteOutlined />
            </button>
          </Tooltip>
        </div>
      ),
    },
  ];

  return (
    <Spin spinning={loading}>
      <div className="p-4">
        <div className="flex flex-wrap lg:flex-row lg:items-center justify-between gap-4 mb-6">
          {/* Khối Input + 2 Button chiếm full width dưới lg, co lại auto khi lên lg */}
          <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto flex-1">
            {/* Ô Input full width dưới lg, chiếm flex auto khi lên lg */}
            <InputComponent
              type="text"
              icon={<SearchOutlined />}
              placeholder={t("workspace.files.searchPlaceholder")}
              isDark={isDark}
              height="40px"
              className="flex-1 min-w-[150px] rounded-lg border border-white/10 bg-white/5 text-white placeholder:text-white/50"
              value={searchText}
              onChange={(e) => {
                setSearchText(e.target.value);
                setCurrentPage(1);
              }}
            />

            {/* Nhóm nút */}
            <div className="flex gap-2 w-full sm:w-auto">
              <ButtonComponent
                icon={<SettingOutlined />}
                onClick={() =>
                  navigate("/workspace/settings", {
                    state: { workspaceId, workspaceName },
                  })
                }
                isDark={isDark}
                height="40px"
                variant="secondary"
                label={t("workspace.files.settings")}
                className="flex-1 sm:flex-initial"
              />
              <ButtonComponent
                icon={<PlusOutlined />}
                onClick={() => setShowModal(true)}
                isDark={isDark}
                height="40px"
                variant="primary"
                label={t("workspace.files.addFile")}
                className="flex-1 sm:flex-initial"
              />
            </div>
          </div>
        </div>

        <Table<GoogleSheetFile>
          dataSource={paginatedFiles}
          rowKey="sheetId"
          columns={columns}
          pagination={false}
          scroll={{ x: 800 }}
          locale={{
            emptyText: (
              <div className="text-white/60 italic py-6 text-sm text-center">
                {t("workspace.files.empty")}
              </div>
            ),
          }}
          className="custom-user-table"
          rowClassName={() => (isDark ? "bg-gray-800" : "bg-white")}
        />

        <div className="mt-4 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-white text-sm">
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setCurrentPage(1);
              }}
              className={`rounded-md border px-3 py-1 text-sm font-medium min-w-[80px] cursor-pointer ${
                isDark
                  ? "bg-gray-800 border-gray-600 text-white"
                  : "bg-white border-gray-300 text-black"
              }`}
            >
              {[8, 16, 24].map((size) => (
                <option key={size} value={size} className="text-black">
                  {size}
                </option>
              ))}
            </select>
            <span className="text-white/70">
              {(currentPage - 1) * pageSize + 1}–
              {Math.min(currentPage * pageSize, filteredFiles.length)}{" "}
              {t("workspace.files.of")} {filteredFiles.length}
            </span>
          </div>
          <Pagination
            current={currentPage}
            pageSize={pageSize}
            total={filteredFiles.length}
            onChange={setCurrentPage}
            showSizeChanger={false}
            showLessItems
            className="custom-pagination"
          />
        </div>
      </div>

      {showModal && (
        <AddNewFileModal
          onClose={() => setShowModal(false)}
          onFileAdded={handleFileAdded}
          workspaceId={workspaceId!}
        />
      )}
    </Spin>
  );
}
