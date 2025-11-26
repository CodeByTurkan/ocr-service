import React from "react";
import {
  Upload,
  CheckCircle2,
  AlertCircle,
  Eye,
  X,
  Camera,
  ShieldCheck,
} from "lucide-react";
import { UploadedFile } from "../types/document.types";

interface FileUploadBoxProps {
  label: string;
  uploadedFile: UploadedFile | null;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemove: () => void;
  onPreview: (preview: string) => void;
  error?: string;
  inputRef: React.RefObject<HTMLInputElement>;
}

export const FileUploadBox: React.FC<FileUploadBoxProps> = ({
  label,
  uploadedFile,
  onChange,
  onRemove,
  onPreview,
  error,
  inputRef,
}) => {
  return (
    <div className="flex-1">
      <label className="block text-sm font-bold text-gray-800 mb-3">
        {label}
      </label>

      {uploadedFile ? (
        <div className="relative border-2 border-green-400 rounded-xl overflow-hidden bg-white shadow-sm">
          <div className="relative">
            <img
              src={uploadedFile.preview}
              alt="Preview"
              className="w-full h-48 object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>

            <div className="absolute top-3 right-3 flex gap-2">
              <button
                onClick={() => onPreview(uploadedFile.preview)}
                className="p-2 bg-white/90 hover:bg-white rounded-lg transition-all shadow-lg"
                title="Preview"
                type="button"
              >
                <Eye className="w-4 h-4 text-gray-700" />
              </button>
              <button
                onClick={onRemove}
                className="p-2 bg-white/90 hover:bg-white rounded-lg transition-all shadow-lg"
                title="Remove"
                type="button"
              >
                <X className="w-4 h-4 text-red-600" />
              </button>
            </div>

            <div className="absolute bottom-3 left-3">
              <div className="flex items-center gap-2 bg-white/95 px-3 py-1.5 rounded-full shadow-lg">
                <ShieldCheck className="w-4 h-4 text-green-600" />
                <span className="text-xs font-semibold text-gray-800">
                  {uploadedFile.confidence}% confidence
                </span>
              </div>
            </div>
          </div>

          {uploadedFile.extractedData && (
            <div className="p-4 bg-gray-50 border-t border-gray-200">
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-gray-500 font-medium">Name:</span>
                  <p className="text-gray-800 font-semibold mt-0.5">
                    {uploadedFile.extractedData.name}
                  </p>
                </div>
                <div>
                  <span className="text-gray-500 font-medium">ID Number:</span>
                  <p className="text-gray-800 font-semibold mt-0.5">
                    {uploadedFile.extractedData.number}
                  </p>
                </div>
              </div>
              <div className="mt-2 flex items-center gap-2 text-green-600">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span className="text-xs font-medium">
                  Data extracted successfully
                </span>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div
          className={`relative border-2 border-dashed rounded-xl transition-all ${
            error
              ? "border-red-300 bg-red-50"
              : "border-gray-300 bg-gradient-to-br from-gray-50 to-white hover:border-blue-400 hover:shadow-md"
          }`}
        >
          <input
            ref={inputRef}
            type="file"
            accept=".png,.jpg,.jpeg,.pdf"
            onChange={onChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          <div className="p-8 text-center">
            <div className="flex flex-col items-center gap-3">
              <div
                className={`p-4 rounded-full ${error ? "bg-red-100" : "bg-blue-50"}`}
              >
                <Upload
                  className={`w-8 h-8 ${error ? "text-red-500" : "text-blue-500"}`}
                />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-700">
                  Drop your file here or click to browse
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Supports: PNG, JPG, PDF (max 10MB)
                </p>
              </div>
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                className="mt-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
              >
                <Camera className="w-4 h-4 inline mr-2" />
                Choose File
              </button>
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 mt-2 text-red-600">
          <AlertCircle className="w-4 h-4" />
          <p className="text-xs font-medium">{error}</p>
        </div>
      )}
    </div>
  );
};
