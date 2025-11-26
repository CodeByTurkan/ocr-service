import React from "react";
import { CreditCard, FileText, CheckCircle2 } from "lucide-react";
import { DocumentType } from "../types/document.types";

interface DocumentTypeSelectorProps {
  selected: DocumentType;
  onChange: (type: DocumentType) => void;
}

export const DocumentTypeSelector: React.FC<DocumentTypeSelectorProps> = ({
  selected,
  onChange,
}) => {
  return (
    <div className="mb-8">
      <label className="block text-sm font-bold text-gray-800 mb-4">
        Select Document Type
      </label>
      <div className="grid grid-cols-2 gap-4">
        <button
          type="button"
          onClick={() => onChange("id")}
          className={`relative overflow-hidden flex items-center gap-4 p-5 rounded-xl border-2 transition-all ${
            selected === "id"
              ? "border-blue-500 bg-gradient-to-br from-blue-50 to-indigo-50 shadow-lg scale-105"
              : "border-gray-200 bg-white hover:border-blue-300 hover:shadow-md"
          }`}
        >
          {selected === "id" && (
            <div className="absolute top-2 right-2">
              <CheckCircle2 className="w-5 h-5 text-blue-600" />
            </div>
          )}
          <div
            className={`p-3 rounded-lg ${selected === "id" ? "bg-blue-100" : "bg-gray-100"}`}
          >
            <CreditCard
              className={`w-7 h-7 ${selected === "id" ? "text-blue-600" : "text-gray-400"}`}
            />
          </div>
          <div className="text-left">
            <span
              className={`font-bold block ${selected === "id" ? "text-blue-700" : "text-gray-600"}`}
            >
              ID Document
            </span>
            <span className="text-xs text-gray-500">National ID Card</span>
          </div>
        </button>

        <button
          type="button"
          onClick={() => onChange("passport")}
          className={`relative overflow-hidden flex items-center gap-4 p-5 rounded-xl border-2 transition-all ${
            selected === "passport"
              ? "border-blue-500 bg-gradient-to-br from-blue-50 to-indigo-50 shadow-lg scale-105"
              : "border-gray-200 bg-white hover:border-blue-300 hover:shadow-md"
          }`}
        >
          {selected === "passport" && (
            <div className="absolute top-2 right-2">
              <CheckCircle2 className="w-5 h-5 text-blue-600" />
            </div>
          )}
          <div
            className={`p-3 rounded-lg ${selected === "passport" ? "bg-blue-100" : "bg-gray-100"}`}
          >
            <FileText
              className={`w-7 h-7 ${selected === "passport" ? "text-blue-600" : "text-gray-400"}`}
            />
          </div>
          <div className="text-left">
            <span
              className={`font-bold block ${selected === "passport" ? "text-blue-700" : "text-gray-600"}`}
            >
              Passport
            </span>
            <span className="text-xs text-gray-500">
              International Passport
            </span>
          </div>
        </button>
      </div>
    </div>
  );
};
