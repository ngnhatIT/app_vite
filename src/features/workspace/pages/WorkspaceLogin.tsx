import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import type { AppDispatch, RootState } from "../../../app/store";
import { loginWorkspace } from "../../workspace/workspceThunk";
import ButtonComponent from "../../../components/ButtonComponent";
import LabelComponent from "../../../components/LabelComponent";
import { clearError, clearSuccessMsg } from "../../workspace/workspaceSlice";

export default function WorkspaceLogin() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const location = useLocation();

  const {
    loading,
    error,
    successMsg,
    loggedIn,
    currentWorkspaceId: reduxWorkspaceId,
  } = useSelector((state: RootState) => state.workspace);

  const darkMode = useSelector((state: RootState) => state.theme.darkMode);

  const [password, setPassword] = useState("");

  // Lấy workspaceId từ state trước, nếu không có fallback Redux
  const workspaceId: string | undefined =
    location.state?.workspaceId || reduxWorkspaceId;

  const handleSubmit = () => {
    if (!workspaceId || !password) return;

    dispatch(clearError());
    dispatch(clearSuccessMsg());

    dispatch(loginWorkspace({ wspId: workspaceId, password }))
      .unwrap()
      .then(() => setPassword(""))
      .catch(() => {});
  };

  useEffect(() => {
    if (loggedIn) {
      navigate("/workspace/files", { state: { workspaceId } });
    }
  }, [loggedIn, navigate, workspaceId]);

  useEffect(() => {
    if (!workspaceId) {
      navigate("/"); // hoặc trang chọn workspace
    }
  }, [workspaceId, navigate]);

  return (
    <div
      className={`flex items-center justify-center min-h-screen ${
        darkMode
          ? "bg-gradient-to-r from-purple-900 to-black"
          : "bg-gradient-to-r from-gray-100 to-gray-300"
      }`}
    >
      <div
        className={`rounded-2xl shadow-lg p-8 w-full max-w-md ${
          darkMode ? "bg-black/50 text-white" : "bg-white text-black"
        }`}
      >
        <h2 className="text-2xl font-bold mb-2">
          Workspace: {workspaceId ?? "(not selected)"}
        </h2>
        <LabelComponent
          label="Enter the workspace password to continue."
          className="text-sm mb-4"
        />

        <input
          type="password"
          placeholder="Workspace Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={`w-full mb-4 px-3 py-2 rounded outline-none ${
            darkMode ? "bg-gray-800 text-white" : "bg-gray-100 text-black"
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

        <ButtonComponent
          onClick={handleSubmit}
          disabled={loading || !workspaceId}
          className="w-full"
        >
          <LabelComponent label={loading ? "Logging in..." : "Login"} />
        </ButtonComponent>
      </div>
    </div>
  );
}
