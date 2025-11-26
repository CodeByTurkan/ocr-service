import React from "react";
import { Loader2 } from "lucide-react";

interface ProcessingOverlayProps {
  isVisible: boolean;
}

export const ProcessingOverlay: React.FC<ProcessingOverlayProps> = ({
  isVisible,
}) => {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 flex flex-col items-center gap-4 shadow-2xl">
        <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
        <p className="text-lg font-semibold text-gray-800">
          Processing document...
        </p>
        <p className="text-sm text-gray-500">Extracting data with OCR</p>
      </div>
    </div>
  );
};
