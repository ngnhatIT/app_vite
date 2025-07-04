import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import type { AppDispatch, RootState } from "../../../app/store";
import ButtonComponent from "../../../components/ButtonComponent";
import { clearError, clearSuccessMsg } from "../workspaceSlice";
import { fetchFiles, deleteFile } from "../workspceThunk";

export default function WorkspaceFiles() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const location = useLocation();

  const {
    loading,
    error,
    successMsg,
    files,
    currentWorkspaceId: reduxWorkspaceId,
  } = useSelector((state: RootState) => state.workspace);

  const darkMode = useSelector((state: RootState) => state.theme.darkMode);

  const workspaceId: string | undefined =
    location.state?.workspaceId || reduxWorkspaceId;

  useEffect(() => {
    if (!workspaceId) {
      navigate("/"); // fallback nếu không có workspaceId
      return;
    }

    dispatch(fetchFiles({ wspId: workspaceId }));
  }, [workspaceId, dispatch, navigate]);

  const handleDelete = (sheetId: string) => {
    if (!workspaceId) return;

    dispatch(deleteFile({ googleSheetId: sheetId, wspId: workspaceId }))
      .unwrap()
      .then(() => {
        dispatch(fetchFiles({ wspId: workspaceId })); // refresh
      });
  };

  const tableClass = darkMode
    ? "bg-gray-800 text-white"
    : "bg-white text-black";

  const renderTableBody = () => {
    if (loading) {
      return (
        <tr>
          <td colSpan={5} className="text-center py-4">
            Loading...
          </td>
        </tr>
      );
    }

    if (files.length === 0) {
      return (
        <tr>
          <td colSpan={5} className="text-center py-4">
            No files found
          </td>
        </tr>
      );
    }

    return files.map((f, idx) => (
      <tr
        key={f.sheetId}
        className="border-b border-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
      >
        <td className="px-4 py-2">{idx + 1}</td>
        <td className="px-4 py-2">{f.sheetName}</td>
        <td className="px-4 py-2">{new Date(f.createdAt).toLocaleString()}</td>
        <td className="px-4 py-2">{new Date(f.updatedAt).toLocaleString()}</td>
        <td className="px-4 py-2">
          <ButtonComponent
            onClick={() => handleDelete(f.googleSheetId)}
            className="!bg-red-500 hover:!bg-red-600"
          >
            Delete
          </ButtonComponent>
        </td>
      </tr>
    ));
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Workspace Files</h2>

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

      <div className="overflow-x-auto">
        <table className={`table-auto w-full rounded ${tableClass}`}>
          <thead>
            <tr className="border-b border-gray-300">
              <th className="px-4 py-2">#</th>
              <th className="px-4 py-2">File Name</th>
              <th className="px-4 py-2">Created At</th>
              <th className="px-4 py-2">Updated At</th>
              <th className="px-4 py-2">Action</th>
            </tr>
          </thead>
          <tbody>{renderTableBody()}</tbody>
        </table>
      </div>
    </div>
  );
}
