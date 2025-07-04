import { Upload } from "antd";
import { PlusOutlined } from "@ant-design/icons";

type UploadFieldProps = {
  label?: string; // optional vì trong ảnh không thấy label
  file: File | null;
  setFile: (f: File | null) => void;
  fileName: string;
  setFileName: (name: string) => void;
};

const UploadField = ({
  file,
  setFile,
  fileName,
  setFileName,
}: UploadFieldProps) => {
  return (
    <div className="md:col-span-2">
      <div className="flex flex-col items-center justify-center border border-dashed border-purple-500 rounded-lg bg-gradient-to-r from-[#1e1e2e] to-[#1e1e2e] p-6 text-center text-white">
        {file || fileName ? (
          <div className="flex flex-col gap-2">
            <span className="text-sm">{file?.name || fileName}</span>
            <button
              onClick={() => {
                setFile(null);
                setFileName("");
              }}
              className="px-3 py-1 bg-red-500 rounded text-white text-xs"
            >
              Remove
            </button>
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
            <div className="flex flex-col items-center justify-center gap-1 cursor-pointer">
              <div className="w-8 h-8 flex items-center justify-center rounded-full bg-purple-700 text-white">
                <PlusOutlined />
              </div>
              <p className="mt-2 text-sm font-medium">Upload File</p>
              <p className="text-xs text-gray-400">(Upload file up to 20MB)</p>
            </div>
          </Upload>
        )}
      </div>
    </div>
  );
};

export default UploadField;
