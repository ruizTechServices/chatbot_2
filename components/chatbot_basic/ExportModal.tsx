"use client";

import React from "react";

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const ExportModal: React.FC<ExportModalProps> = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="bg-[#111111] border border-gray-700 rounded-md w-11/12 max-w-md p-6 text-white shadow-xl">
        <h2 className="text-lg font-semibold mb-2">Export Conversation</h2>
        <p className="text-sm text-gray-300 mb-6">
          This will download the current conversation as a <code>.jsonl</code> file. Continue?
        </p>
        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-md bg-gray-700 hover:bg-gray-600 text-sm"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="px-4 py-2 rounded-md bg-amber-600 hover:bg-amber-500 text-sm"
          >
            Export
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExportModal;
