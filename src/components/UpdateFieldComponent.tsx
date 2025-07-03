import { Upload, Typography } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import ButtonComponent from "./ButtonComponent";

type UploadFieldProps = {
  label: string;
  file: File | null;
  setFile: (f: File | null) => void;
  fileName: string;
  setFileName: (name: string) => void;
  t: (key: string) => string;
};

const UploadField = ({
  label,
  file,
  setFile,
  fileName,
  setFileName,
  t,
}: UploadFieldProps) => {
  return (
    <div className="md:col-span-2">
      <div className="text-sm font-medium mb-1">{label}</div>

      <div className="border border-dashed rounded-lg p-4 bg-[#1e1e2e]">
        {file ? (
          <div className="flex justify-between">
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
        ) : fileName ? (
          <div className="flex justify-between">
            <span>{fileName}</span>
            <ButtonComponent
              variant="secondary"
              onClick={() => setFileName("")}
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
              setFileName(""); // reset fileName BE
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
  );
};

export default UploadField;
