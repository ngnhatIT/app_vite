import { Select, Upload, Checkbox, message, Typography } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import ButtonComponent from "../../../components/ButtonComponent";
import InputComponent from "../../../components/InputComponent";
import LabelComponent from "../../../components/LabelComponent";

const AddEditWorkspaceScreen = ({ initialData }: any) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [name, setName] = useState(initialData?.name || "");
  const [owner, setOwner] = useState(initialData?.owner || "");
  const [desc, setDesc] = useState(initialData?.desc || "");
  const [file, setFile] = useState<File | null>(initialData?.file || null);
  const [usePassword, setUsePassword] = useState(!!initialData?.password);
  const [password, setPassword] = useState(initialData?.password || "");
  const [confirm, setConfirm] = useState(initialData?.password || "");

  const handleSubmit = () => {
    if (!name || !owner || !file) {
      return message.warning(t("common.fillAllRequired"));
    }
    if (usePassword && password !== confirm) {
      return message.error(t("common.passwordNotMatch"));
    }
    const payload = {
      name,
      owner,
      desc,
      file,
      password: usePassword ? password : undefined,
    };
    console.log("submit:", payload);
    message.success(t("common.saved"));
  };

  return (
    <div className="p-6 max-w-4xl mx-auto text-white">
      <h2 className="text-xl font-semibold mb-6">
        {initialData ? t("workspace.edit") : t("workspace.add")}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Workspace Name */}
        <div>
          <LabelComponent label="workspace.name" required isDark />
          <InputComponent
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={t("workspace.namePlaceholder")}
            isDark
            allowClear
          />
        </div>

        {/* Workspace Owner */}
        <div>
          <LabelComponent label="workspace.owner" required isDark />
          <Select
            value={owner}
            onChange={setOwner}
            placeholder={t("workspace.ownerPlaceholder")}
            options={[]}
            className="w-full rounded-[8px]"
          />
        </div>

        {/* Description (full width) */}
        <div className="md:col-span-2">
          <LabelComponent label="workspace.desc" isDark />
          <InputComponent
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            placeholder={t("workspace.descPlaceholder")}
            isDark
            allowClear
            height={100}
          />
        </div>

        {/* File Upload (full width) */}
        <div className="md:col-span-2">
          <LabelComponent label="workspace.upload" required isDark />
          <div className="border border-dashed rounded-lg p-4 bg-[#1e1e2e]">
            {file ? (
              <div className="flex items-center justify-between">
                <span>{file.name}</span>
                <ButtonComponent
                  variant="secondary"
                  onClick={() => setFile(null)}
                  isDark
                  height="36px"
                >
                  {t("workspace.remove")}
                </ButtonComponent>
              </div>
            ) : (
              <Upload
                beforeUpload={(f) => {
                  setFile(f);
                  return false;
                }}
                showUploadList={false}
              >
                <ButtonComponent icon={<UploadOutlined />} isDark height="36px">
                  {t("workspace.uploadBtn")}
                </ButtonComponent>
              </Upload>
            )}
            <Typography.Text className="block mt-1 text-xs text-gray-400">
              {t("workspace.uploadNote")}
            </Typography.Text>
          </div>
        </div>
        <div className="md:col-span-2">
          <LabelComponent label="workspace.upload" required isDark />
          <div className="border border-dashed rounded-lg p-4 bg-[#1e1e2e]">
            {file ? (
              <div className="flex items-center justify-between">
                <span>{file.name}</span>
                <ButtonComponent
                  variant="secondary"
                  onClick={() => setFile(null)}
                  isDark
                  height="36px"
                >
                  {t("workspace.remove")}
                </ButtonComponent>
              </div>
            ) : (
              <Upload
                beforeUpload={(f) => {
                  setFile(f);
                  return false;
                }}
                showUploadList={false}
              >
                <ButtonComponent icon={<UploadOutlined />} isDark height="36px">
                  {t("workspace.uploadBtn")}
                </ButtonComponent>
              </Upload>
            )}
            <Typography.Text className="block mt-1 text-xs text-gray-400">
              {t("workspace.uploadNote")}
            </Typography.Text>
          </div>
        </div>
        <div className="md:col-span-2">
          <LabelComponent label="workspace.upload" required isDark />
          <div className="border border-dashed rounded-lg p-4 bg-[#1e1e2e]">
            {file ? (
              <div className="flex items-center justify-between">
                <span>{file.name}</span>
                <ButtonComponent
                  variant="secondary"
                  onClick={() => setFile(null)}
                  isDark
                  height="36px"
                >
                  {t("workspace.remove")}
                </ButtonComponent>
              </div>
            ) : (
              <Upload
                beforeUpload={(f) => {
                  setFile(f);
                  return false;
                }}
                showUploadList={false}
              >
                <ButtonComponent icon={<UploadOutlined />} isDark height="36px">
                  {t("workspace.uploadBtn")}
                </ButtonComponent>
              </Upload>
            )}
            <Typography.Text className="block mt-1 text-xs text-gray-400">
              {t("workspace.uploadNote")}
            </Typography.Text>
          </div>
        </div>

        {/* Enable Password (full width) */}
        <div className="md:col-span-2">
          <Checkbox
            checked={usePassword}
            onChange={(e) => setUsePassword(e.target.checked)}
            className="text-white"
          >
            {t("workspace.enablePassword")}
          </Checkbox>
        </div>

        {/* Password fields (only show when enabled) */}
        {usePassword && (
          <>
            <div>
              <LabelComponent label="workspace.password" required isDark />
              <InputComponent
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={t("workspace.passwordPlaceholder")}
                isDark
                allowClear
              />
            </div>
            <div>
              <LabelComponent label="workspace.confirm" required isDark />
              <InputComponent
                type="password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                placeholder={t("workspace.confirmPlaceholder")}
                isDark
                allowClear
              />
            </div>
          </>
        )}
      </div>

      {/* Action buttons */}
      <div className="flex justify-end gap-4 mt-8">
        <ButtonComponent
          variant="secondary"
          onClick={() => navigate(-1)}
          isDark
          height={44}
          className="w-[120px]"
        >
          {t("common.back")}
        </ButtonComponent>
        <ButtonComponent
          onClick={handleSubmit}
          isDark
          height={44}
          className="w-[140px]"
        >
          {initialData ? t("workspace.update") : t("workspace.save")}
        </ButtonComponent>
      </div>
    </div>
  );
};

export default AddEditWorkspaceScreen;
