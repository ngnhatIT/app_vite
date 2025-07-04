import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../../app/store";
import { createFile, fetchFiles } from "../workspceThunk";
import { clearError, clearSuccessMsg } from "../workspaceSlice";
import ButtonComponent from "../../../components/ButtonComponent";
import LabelComponent from "../../../components/LabelComponent";

interface AddNewFileModalProps {
  onClose: () => void;
}

export default function AddNewFileModal({ onClose }: AddNewFileModalProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { currentWorkspaceId, loading, error, successMsg } = useSelector(
    (state: RootState) => state.workspace
  );
  const darkMode = useSelector((state: RootState) => state.theme.darkMode);

  const [fileName, setFileName] = useState("");

  const handleCreate = () => {
    if (!fileName || !currentWorkspaceId) return;

    dispatch(clearError());
    dispatch(clearSuccessMsg());

    dispatch(createFile({ wspId: currentWorkspaceId, fileName }))
      .unwrap()
      .then(() => {
        dispatch(fetchFiles({ wspId: currentWorkspaceId })); // refresh list
        setFileName("");
        onClose();
      })
      .catch(() => {});
  };

  useEffect(() => {
    if (!currentWorkspaceId) {
      onClose();
    }
  }, [currentWorkspaceId, onClose]);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div
        className={`rounded-xl shadow-lg p-6 w-full max-w-md ${
          darkMode ? "bg-gray-800 text-white" : "bg-white text-black"
        }`}
      >
        <h2 className="text-xl font-semibold mb-4">Create New Google Sheet</h2>

        <LabelComponent
          label="Enter file name"
          className="text-sm mb-2 block"
        />

        <input
          type="text"
          value={fileName}
          onChange={(e) => setFileName(e.target.value)}
          className={`w-full mb-4 px-3 py-2 rounded outline-none ${
            darkMode ? "bg-gray-700 text-white" : "bg-gray-100 text-black"
          }`}
        />

        {error && (
          <div className="text-red-400 text-sm mb-2">
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
          <div className="text-green-400 text-sm mb-2">
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
            onClick={onClose}
            className="!bg-gray-400 hover:!bg-gray-500"
          />
          <ButtonComponent
            onClick={handleCreate}
            disabled={loading || !fileName}
            className="!bg-purple-600 hover:!bg-purple-700"
          />
        </div>
      </div>
    </div>
  );
}
