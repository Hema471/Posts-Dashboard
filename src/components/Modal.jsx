import React from "react";
import { X } from "lucide-react";

const Modal = ({ isOpen, onClose, children, title }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[99999]">
      <div className="bg-white p-6 rounded-2xl w-full max-w-md shadow-lg transform transition-all scale-100 animate-fadeIn">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">{title}</h2>
          <button
            onClick={onClose}
            className="cursor-pointer p-1 rounded-full hover:bg-gray-100 transition"
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        {/* Modal Content (children) */}
        <div>{children}</div>
      </div>
    </div>
  );
};

export default Modal;
