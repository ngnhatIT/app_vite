import { createRoot } from "react-dom/client";
import React from "react";
import DialogComponent from "./DialogComponent";
import type { DialogType } from "./DialogType";

let container = document.getElementById("dialog-root");
if (!container) {
  container = document.createElement("div");
  container.id = "dialog-root";
  document.body.appendChild(container);
}

const root = createRoot(container);

export const showDialog = ({
  title,
  content,
  isDark,
  type = "warning",
  confirmText = "Ok",
  cancelText = "Cancel",
  onOk,
  onCancel,
}: {
  title: string;
  content: string;
  isDark: boolean;
  type?: DialogType;
  confirmText?: string;
  cancelText?: string;
  onOk?: () => void;
  onCancel?: () => void;
}) => {
  const handleClose = () => {
    root.render(React.createElement(React.Fragment, null));
  };

  root.render(
    <DialogComponent
      open={true}
      title={title}
      content={content}
      isDark={isDark}
      type={type}
      confirmText={confirmText}
      cancelText={cancelText}
      onConfirm={() => {
        handleClose();
        onOk?.();
      }}
      onCancel={() => {
        handleClose();
        onCancel?.();
      }}
    />
  );
};
