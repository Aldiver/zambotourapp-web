import React from 'react';

interface ConfirmModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({ isOpen, onConfirm, onCancel }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="rounded-lg bg-white p-8 shadow-2xl">
        <h2 className="text-lg font-bold">Are you sure you want to do that?</h2>
        <p className="mt-2 text-sm text-gray-500">
          Doing that could cause some issues elsewhere, are you 100% sure it's OK?
        </p>
        <div className="mt-4 flex gap-2">
          <button
            type="button"
            className="rounded bg-green-50 px-4 py-2 text-sm font-medium text-green-600"
            onClick={onConfirm}
          >
            Yes, I'm sure
          </button>
          <button
            type="button"
            className="rounded bg-gray-50 px-4 py-2 text-sm font-medium text-gray-600"
            onClick={onCancel}
          >
            No, go back
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
