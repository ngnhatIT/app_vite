import React from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import ButtonComponent from "./ButtonComponent";
import { useSelector } from "react-redux";
import type { RootState } from "../app/store";

interface DialogComponentProps {
  open: boolean;
  title: string;
  content: string;
  confirmText?: string;
  cancelText?: string;
  isDark: boolean;
  onConfirm?: () => void;
  onCancel?: () => void;
}
const DialogComponent: React.FC<DialogComponentProps> = ({
  open,
  title,
  isDark,
  content,
  confirmText = "Ok",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
}) => {
  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div
        className={`${
          isDark
            ? "bg-gradient-to-br from-[#1a1a1a] to-[#1c1b2f] border border-purple-500"
            : "bg-white border border-gray-300"
        } rounded-2xl p-6 w-[380px] shadow-xl transition-colors duration-200`}
      >
        <div className="flex justify-center mb-4">
          <div
            className={`p-2 rounded-full ${
              isDark
                ? "bg-[#1c1b2f] border border-purple-500"
                : "bg-[#f3f3f3] border border-gray-300"
            }`}
          >
            <span className="text-pink-500 text-xl">⚠️</span>
          </div>
        </div>

        <h2
          className={`text-center text-lg font-semibold mb-2 ${
            isDark ? "text-white" : "text-gray-900"
          }`}
        >
          {title}
        </h2>

        <p
          className={`text-center text-sm mb-6 ${
            isDark ? "text-gray-400" : "text-gray-600"
          }`}
        >
          {content}
        </p>

        <div className="flex justify-between gap-20">
          <ButtonComponent
            className={`px-4 flex-1 py-2 rounded-md ${
              isDark
                ? "text-white bg-[#333] hover:bg-[#444]"
                : "text-gray-700 bg-gray-200 hover:bg-gray-300"
            }`}
            variant="secondary"
            onClick={onCancel}
          >
            {cancelText}
          </ButtonComponent>

          <ButtonComponent className="flex-1" onClick={onConfirm}>
            {confirmText}
          </ButtonComponent>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default DialogComponent;
