import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useLocation } from "react-router-dom";
import { Select, Checkbox, message, Spin } from "antd";
import axiosInstance from "../../../api/AxiosIntance";

import ButtonComponent from "../../../components/ButtonComponent";
import InputComponent from "../../../components/InputComponent";
import LabelComponent from "../../../components/LabelComponent";
import UploadField from "../../../components/UpdateFieldComponent";
import { useSelector } from "react-redux";
import type { RootState } from "../../../app/store";

const WorkspaceForm = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const isDark = useSelector((state: RootState) => state.theme.darkMode);

  const { mode, id } = (location.state || {}) as {
    mode: "create" | "edit";
    id?: string;
  };

  const [name, setName] = useState("");
  const [owner, setOwner] = useState("");
  const [desc, setDesc] = useState("");
  const [usePassword, setUsePassword] = useState(false);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const [viewConfig, setViewConfig] = useState<File | null>(null);
  const [editConfig, setEditConfig] = useState<File | null>(null);
  const [commentConfig, setCommentConfig] = useState<File | null>(null);

  const [viewFileName, setViewFileName] = useState("");
  const [editFileName, setEditFileName] = useState("");
  const [commentFileName, setCommentFileName] = useState("");

  const [owners, setOwners] = useState<{ userId: string; userName: string }[]>(
    []
  );
  const [loadingOwners, setLoadingOwners] = useState(false);
  const [loadingDetail, setLoadingDetail] = useState(false);

  const fetchOwners = async () => {
    setLoadingOwners(true);
    try {
      const res = await axiosInstance.get<{
        data: { user_id: string; username: string }[];
      }>("/system/workspaces/select-owner");
      setOwners(
        (res.data.data || []).map((o) => ({
          userId: o.user_id,
          userName: o.username,
        }))
      );
    } catch {
      message.error(t("common.error"));
    } finally {
      setLoadingOwners(false);
    }
  };

  const fetchDetail = async () => {
    if (!id) {
      message.error(t("workspace.error.noId"));
      return;
    }
    setLoadingDetail(true);
    try {
      const res = await axiosInstance.get<{ data: any }>(
        `/system/workspaces/${id}`
      );
      const detail = res.data.data;

      setName(detail.workspaceName);
      setOwner(detail.ownerId);
      setDesc(detail.description || "");
      setUsePassword(detail.isPasswordRequired);

      setViewFileName(detail.viewFileName || "");
      setEditFileName(detail.editFileName || "");
      setCommentFileName(detail.commentFileName || "");
    } catch {
      message.error(t("common.error"));
    } finally {
      setLoadingDetail(false);
    }
  };

  useEffect(() => {
    fetchOwners();
    if (mode === "edit") {
      fetchDetail();
    }
  }, [mode, id]);

  const handleSubmit = async () => {
    if (!name || !owner) {
      message.warning(t("common.fillAllRequired"));
      return;
    }

    if (usePassword && password !== confirm) {
      message.error(t("common.passwordNotMatch"));
      return;
    }

    const formData = new FormData();
    formData.append("workspaceName", name);
    formData.append("ownerId", owner);
    if (desc) formData.append("description", desc);
    formData.append("isPasswordRequired", String(usePassword));

    if (usePassword) {
      formData.append("password", password);
      formData.append("confirmPassword", confirm);
    }

    if (viewConfig) {
      formData.append("viewConfig", viewConfig);
    } else if (!viewFileName) {
      formData.append("viewConfig", "");
    }

    if (editConfig) {
      formData.append("editConfig", editConfig);
    } else if (!editFileName) {
      formData.append("editConfig", "");
    }

    if (commentConfig) {
      formData.append("commentConfig", commentConfig);
    } else if (!commentFileName) {
      formData.append("commentConfig", "");
    }

    try {
      if (mode === "edit" && id) {
        await axiosInstance.patch(`/system/workspaces/${id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        await axiosInstance.post(`/system/workspaces`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      message.success(t("common.saved"));
      navigate(-1);
    } catch (err: any) {
      console.error(err);
      message.error(t("common.error"));
    }
  };

  if (mode === "edit" && loadingDetail) {
    return <Spin tip="Loading workspace detail..." />;
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2
        className={`text-xl font-semibold mb-6 ${
          isDark ? "text-white" : "text-black"
        }`}
      >
        {mode === "edit" ? t("workspace.edit") : t("workspace.add")}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <LabelComponent label="workspace.name" required isDark={isDark} />
          <InputComponent
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={t("workspace.namePlaceholder")}
            isDark={isDark}
            allowClear
          />
        </div>

        <div>
          <LabelComponent label="workspace.owner" required isDark={isDark} />
          <Select
            loading={loadingOwners}
            value={owner}
            onChange={setOwner}
            placeholder={t("workspace.ownerPlaceholder")}
            className={`w-full rounded-[8px] ${
              isDark
                ? "bg-gray-800 text-white border-gray-600"
                : "bg-white text-black border-gray-300"
            }`}
          >
            {owners.map((o) => (
              <Select.Option key={o.userId} value={o.userId}>
                {o.userName}
              </Select.Option>
            ))}
          </Select>
        </div>

        <div className="md:col-span-2">
          <LabelComponent label="workspace.desc" isDark={isDark} />
          <textarea
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            placeholder={t("workspace.descPlaceholder")}
            className={`w-full mt-1 rounded-md p-2 border ${
              isDark
                ? "bg-gray-800 text-white border-gray-600"
                : "bg-white text-black border-gray-300"
            }`}
            rows={4}
          />
        </div>

        <UploadField
          label="workspace.viewConfig"
          file={viewConfig}
          setFile={setViewConfig}
          fileName={viewFileName}
          setFileName={setViewFileName}
          isDark={isDark}
        />

        <UploadField
          label="workspace.editConfig"
          file={editConfig}
          setFile={setEditConfig}
          fileName={editFileName}
          setFileName={setEditFileName}
          isDark={isDark}
        />

        <UploadField
          label="workspace.commentConfig"
          file={commentConfig}
          setFile={setCommentConfig}
          fileName={commentFileName}
          setFileName={setCommentFileName}
          isDark={isDark}
        />

        <div className="md:col-span-2">
          <Checkbox
            checked={usePassword}
            onChange={(e) => setUsePassword(e.target.checked)}
            className={isDark ? "text-white" : "text-black"}
          >
            {t("workspace.enablePassword")}
          </Checkbox>
        </div>

        {usePassword && (
          <>
            <div>
              <LabelComponent
                label="workspace.password"
                required
                isDark={isDark}
              />
              <InputComponent
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={t("workspace.passwordPlaceholder")}
                isDark={isDark}
                allowClear
              />
            </div>
            <div>
              <LabelComponent
                label="workspace.confirm"
                required
                isDark={isDark}
              />
              <InputComponent
                type="password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                placeholder={t("workspace.confirmPlaceholder")}
                isDark={isDark}
                allowClear
              />
            </div>
          </>
        )}
      </div>

      <div className="flex justify-end gap-4 mt-8">
        <ButtonComponent
          variant="secondary"
          onClick={() => navigate(-1)}
          isDark={isDark}
          height={44}
          className="w-[120px]"
        >
          {t("common.back")}
        </ButtonComponent>
        <ButtonComponent
          onClick={handleSubmit}
          isDark={isDark}
          height={44}
          className="w-[140px]"
        >
          {mode === "edit" ? t("workspace.update") : t("workspace.save")}
        </ButtonComponent>
      </div>
    </div>
  );
};

export default WorkspaceForm;
