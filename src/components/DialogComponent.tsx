import React from "react";
import { createPortal } from "react-dom";
import { AlertTriangle, XCircle, CheckCircle } from "lucide-react";
import ButtonComponent from "./ButtonComponent";
import type { DialogType } from "./DialogType";

interface DialogComponentProps {
  open: boolean;
  title: string;
  content: string;
  confirmText?: string;
  cancelText?: string;
  type?: DialogType;
  isDark: boolean;
  onConfirm?: () => void;
  onCancel?: () => void;
}

const typeStyles = {
  warning: {
    Icon: AlertTriangle,
    bg: "bg-pink-500/20",
    text: "text-pink-500",
    border: "border-pink-500",
  },
  error: {
    Icon: XCircle,
    bg: "bg-red-500/20",
    text: "text-red-500",
    border: "border-red-500",
  },
  success: {
    Icon: CheckCircle,
    bg: "bg-green-500/20",
    text: "text-green-500",
    border: "border-green-500",
  },
};

const DialogComponent: React.FC<DialogComponentProps> = ({
  open,
  title,
  content,
  confirmText = "Ok",
  cancelText = "Cancel",
  type = "warning",
  isDark,
  onConfirm,
  onCancel,
}) => {
  if (!open) return null;

  const { Icon, bg, text, border } = typeStyles[type];

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div
        className={`rounded-2xl p-6 w-[400px] shadow-xl border ${border} ${
          isDark
            ? "bg-gradient-to-br from-[#1a1a1a] to-[#1c1b2f] text-white"
            : "bg-white text-gray-900"
        } transition-all duration-300`}
      >
        <div className="flex justify-center mb-4">
          <div
            className={`w-12 h-12 rounded-full flex items-center justify-center ${bg} ${text}`}
          >
            <Icon className="w-6 h-6" />
          </div>
        </div>

        <h2 className="text-center text-lg font-semibold mb-2">{title}</h2>
        <p
          className={`text-center text-sm mb-6 ${
            isDark ? "text-gray-400" : "text-gray-600"
          }`}
        >
          {content}
        </p>

        <div className="flex justify-between gap-10">
          <ButtonComponent
            className={`flex-1 rounded-md px-4 py-2 font-medium ${
              isDark
                ? "bg-[#333] text-white hover:bg-[#444]"
                : "bg-gray-200 text-gray-800 hover:bg-gray-300"
            }`}
            variant="secondary"
            onClick={onCancel}
          >
            {cancelText}
          </ButtonComponent>

          <ButtonComponent
            className={`flex-1 rounded-md px-4 py-2 font-medium ${
              isDark
                ? "bg-gradient-to-tr from-purple-500 to-pink-500 text-white hover:opacity-90"
                : "bg-purple-600 text-white hover:bg-purple-700"
            }`}
            onClick={onConfirm}
          >
            {confirmText}
          </ButtonComponent>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default DialogComponent;
