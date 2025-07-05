import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import type { AppDispatch, RootState } from "../../../app/store";
import { loginWorkspace } from "../../workspace/workspceThunk";
import ButtonComponent from "../../../components/ButtonComponent";
import LabelComponent from "../../../components/LabelComponent";
import { clearError, clearSuccessMsg } from "../../workspace/workspaceSlice";
import InputComponent from "../../../components/InputComponent";
import { useTranslation } from "react-i18next";
import { message } from "antd";

export default function WorkspaceLogin() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const location = useLocation();

  const { loading, currentWorkspaceId: reduxWorkspaceId } = useSelector(
    (state: RootState) => state.workspace
  );

  const isDark = useSelector((state: RootState) => state.theme.darkMode);
  const { t } = useTranslation();

  const [password, setPassword] = useState("");

  const workspaceId: string | undefined =
    location.state?.workspaceId || reduxWorkspaceId;

  const workspaceName: string | undefined =
    location.state?.workspaceName || "Workspace Name";

  const handleSubmit = () => {
    if (!workspaceId) return;

    dispatch(clearError());
    dispatch(clearSuccessMsg());

    dispatch(loginWorkspace({ wspId: workspaceId, password }))
      .unwrap()
      .then(() => {
        setPassword("");
        navigate("/workspace/files", { state: { workspaceId } });
      })
      .catch((err: any) => {
        message.error(err.message);
      });
  };

  useEffect(() => {
    if (!workspaceId) {
      navigate("/");
    }
  }, [workspaceId, navigate]);

  return (
    <div
      className={`
        w-full min-h-[500px] max-h-[100px] flex items-center justify-center`}
    >
      <div
        className={`
          flex flex-col items-center gap-6 max-w-md w-full p-8 rounded-xl
          backdrop-blur-md shadow-lg
        `}
        style={{
          maxHeight: "calc(100vh - 60px)",
          overflowY: "auto",
        }}
      >
        {/* Icon */}
        <div className="w-16 h-16 rounded-full bg-purple-700 flex items-center justify-center text-white text-2xl">
          ⌨️
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold">{workspaceName}</h2>

        {/* Subtitle */}
        <LabelComponent
          label="sheet.login.subTitle"
          className="text-sm text-gray-400 text-center"
        />

        {/* Input */}
        <InputComponent
          type="password"
          placeholder={t("sheet.login.placeholderPassword")}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          isDark={isDark}
        />
        {/* Button */}
        <ButtonComponent
          onClick={handleSubmit}
          disabled={loading || !workspaceId}
          className="w-full bg-purple-600 hover:bg-purple-700 text-white mt-2"
        >
          <LabelComponent
            label={
              loading ? "sheet.login.loadingLogin" : "sheet.login.loginWsp"
            }
          />
        </ButtonComponent>
      </div>
    </div>
  );
}
