import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../../app/store";
import { createFile, fetchFiles } from "../workspceThunk";
import { clearError, clearSuccessMsg } from "../workspaceSlice";
import ButtonComponent from "../../../components/ButtonComponent";
import LabelComponent from "../../../components/LabelComponent";
import { useTranslation } from "react-i18next";

interface AddNewFileModalProps {
  onClose: () => void;
  onFileAdded: () => void;
  workspaceId: string;
}

export default function AddNewFileModal({
  onClose,
  onFileAdded,
  workspaceId,
}: AddNewFileModalProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error, successMsg } = useSelector(
    (state: RootState) => state.workspace
  );
  const darkMode = useSelector((state: RootState) => state.theme.darkMode);
  const { t } = useTranslation();

  const [fileName, setFileName] = useState("");

  const handleCreate = async () => {
    if (!fileName || !workspaceId) {
      dispatch(clearError());
      dispatch(clearSuccessMsg());
      return;
    }

    try {
      await dispatch(createFile({ wspId: workspaceId, fileName })).unwrap();
      dispatch(fetchFiles({ wspId: workspaceId }));
      onFileAdded(); // Notify parent to refetch files
      setFileName("");
      dispatch(clearSuccessMsg());
      // Không đóng modal ngay, để người dùng thấy successMsg
    } catch (error) {
      // Lỗi đã được xử lý trong Redux store (state.workspace.error)
    }
  };

  useEffect(() => {
    if (!workspaceId) {
      onClose();
    }
  }, [workspaceId, onClose]);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div
        className={`rounded-xl shadow-lg p-6 w-full max-w-md ${
          darkMode ? "bg-gray-800 text-white" : "bg-white text-black"
        }`}
      >
        <h2 className="text-xl font-semibold mb-4">
          {t("workspace.files.addFile")}
        </h2>

        <LabelComponent
          label={t("workspace.files.enterFilename")}
          className="text-sm mb-2 block"
          isDark={darkMode}
        />

        <input
          type="text"
          value={fileName}
          onChange={(e) => setFileName(e.target.value)}
          className={`w-full mb-4 px-3 py-2 rounded outline-none ${
            darkMode
              ? "bg-gray-700 text-white border-gray-600"
              : "bg-gray-100 text-black border-gray-300"
          } border`}
          placeholder={t("workspace.files.filenamePlaceholder")}
        />

        {error && (
          <div className="text-red-400 text-sm mb-2 flex items-center">
            {error}
            <button
              className="ml-2 underline"
              onClick={() => dispatch(clearError())}
            >
              x
            </button>
          </div>
        )}

        {successMsg && (
          <div className="text-green-400 text-sm mb-2 flex items-center">
            {successMsg}
            <button
              className="ml-2 underline"
              onClick={() => dispatch(clearSuccessMsg())}
            >
              x
            </button>
          </div>
        )}

        <div className="flex justify-end gap-2 mt-4">
          <ButtonComponent
            label={t("workspace.files.cancel")}
            onClick={onClose}
            isDark={darkMode}
            className="!bg-gray-400 hover:!bg-gray-500"
            disabled={loading}
          />
          <ButtonComponent
            label={t("workspace.files.create")}
            onClick={handleCreate}
            isDark={darkMode}
            disabled={loading || !fileName}
            className="!bg-purple-600 hover:!bg-purple-700"
          />
        </div>
      </div>
    </div>
  );
}
