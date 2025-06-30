import React from 'react';
import { DeleteConfirmDialog } from './dialogs';

interface DeleteDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
  itemName?: string;
  itemType?: 'project' | 'file' | 'course' | 'document' | 'folder';
}

const DeleteDialog: React.FC<DeleteDialogProps> = (props) => {
  return <DeleteConfirmDialog {...props} />;
};

export default DeleteDialog;