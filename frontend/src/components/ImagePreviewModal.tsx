import React from "react";
import { X } from "lucide-react";

interface ImagePreviewModalProps {
  imageUrl: string | null;
  onClose: () => void;
}

export const ImagePreviewModal: React.FC<ImagePreviewModalProps> = ({
  imageUrl,
  onClose,
}) => {
  if (!imageUrl) return null;

  return (
    <div
      className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div className="relative max-w-4xl max-h-[90vh]">
        <button
          onClick={onClose}
          className="absolute -top-12 right-0 p-2 bg-white rounded-lg hover:bg-gray-100 transition-colors"
          type="button"
        >
          <X className="w-6 h-6" />
        </button>
        <img
          src={imageUrl}
          alt="Preview"
          className="max-w-full max-h-[85vh] rounded-xl shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        />
      </div>
    </div>
  );
};
