import * as Dialog from "@radix-ui/react-dialog";
import type { ReactNode } from "react";

interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  onConfirm: () => void;
  onCancel?: () => void;
  okText?: string;
  cancelText?: string;
  icon?: ReactNode;
}

const ConfirmDialog = ({
  open,
  onOpenChange,
  title,
  description,
  onConfirm,
  onCancel,
  okText = "Ok, Disable",
  cancelText = "Cancel",
  icon,
}: ConfirmDialogProps) => {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50" />
        <Dialog.Content className="fixed z-50 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-[20px] bg-[#0f0b20] p-6 w-[400px] text-center shadow-xl border border-white/5">
          {/* Icon */}
          <div className="mb-4 flex justify-center">
            {icon || (
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-500 to-purple-500 flex items-center justify-center text-white text-xl font-bold">
                !
              </div>
            )}
          </div>

          {/* Title & Description */}
          <Dialog.Title className="text-white text-lg font-semibold mb-1">
            {title}
          </Dialog.Title>
          {description && (
            <Dialog.Description className="text-sm text-gray-400 mb-6">
              {description}
            </Dialog.Description>
          )}

          {/* Action buttons */}
          <div className="flex justify-center gap-3">
            <button
              onClick={() => {
                onCancel?.();
                onOpenChange(false);
              }}
              className="bg-[#2b273d] text-white px-4 py-2 rounded-md text-sm hover:bg-[#3c3652]"
            >
              {cancelText}
            </button>
            <button
              onClick={() => {
                onConfirm();
                onOpenChange(false);
              }}
              className="bg-[#9747FF] text-white px-4 py-2 rounded-md text-sm hover:bg-[#7d3fd3]"
            >
              {okText}
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default ConfirmDialog;
