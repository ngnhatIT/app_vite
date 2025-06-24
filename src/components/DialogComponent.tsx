import React from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import ButtonComponent from "./ButtonComponent";

interface DialogComponentProps {
  open: boolean;
  title: string;
  content: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
}
const DialogComponent: React.FC<DialogComponentProps> = ({
  open,
  title,
  content,
  confirmText = "Ok",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
}) => {
  if (!open) return null;
  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-gradient-to-br from-[#1a1a1a] to-[#1c1b2f] rounded-2xl p-6 w-[380px] shadow-xl border border-purple-500">
        <div className="flex justify-center mb-4">
          <div className="bg-[#1c1b2f] p-2 rounded-full border border-purple-500">
            <span className="text-pink-400 text-xl">⚠️</span>
          </div>
        </div>
        <h2 className="text-white text-center text-lg font-semibold mb-2">
          {title}
        </h2>
        <p className="text-gray-400 text-center text-sm mb-6">{content}</p>
        <div className="flex justify-between gap-20">
          <ButtonComponent
            className="px-4 flex-1 py-2 text-white bg-[#333] rounded-md hover:bg-[#444]"
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
