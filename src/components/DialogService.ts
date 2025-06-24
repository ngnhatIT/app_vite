import { createRoot } from "react-dom/client";
import React from "react";
import DialogComponent from "./DialogComponent";

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
  onOk,
  onCancel,
}: {
  title: string;
  content: string;
  onOk?: () => void;
  onCancel?: () => void;
}) => {
  const handleClose = () => {
    root.render(React.createElement(React.Fragment, null));
  };

  root.render(
    React.createElement(DialogComponent, {
      open: true,
      title,
      content,
      confirmText: "Ok",
      cancelText: "Cancel",
      onConfirm: () => {
        handleClose();
        onOk?.();
      },
      onCancel: () => {
        handleClose();
        onCancel?.();
      },
    })
  );
};
