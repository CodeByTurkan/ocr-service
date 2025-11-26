import React, { useState } from "react";
import {
  AlertCircle,
  Camera,
  CheckCircle2,
  CreditCard,
  Eye,
  FileText,
  Loader2,
  ShieldCheck,
  Upload,
  X,
} from "lucide-react";

interface Errors {
  front?: string;
  back?: string;
  passport?: string;
}

interface UploadedFile {
  file: File;
  preview: string;
  confidence?: number;
  extractedData?: {
    name?: string;
    number?: string;
    expiry?: string;
  };
}

type DocumentType = "id" | "passport";

const styles = {
  container: {
    minHeight: "100vh",
    background: "#FFFFFF",
    padding: "3rem clamp(1rem, 4vw, 4rem)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  formWrapper: {
    width: "100%",
    maxWidth: "760px",
    background: "#FFFFFF",
    borderRadius: "28px",
    border: "1px solid #E4E7EC",
    boxShadow: "0 35px 80px rgba(15, 23, 42, 0.08)",
    padding: "2.75rem",
    display: "flex",
    flexDirection: "column" as const,
    gap: "2rem",
  },
  formHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "1rem",
    flexWrap: "wrap" as const,
  },
  label: {
    fontSize: "0.85rem",
    fontWeight: 700,
    color: "#0F172A",
    letterSpacing: "0.08em",
    textTransform: "uppercase" as const,
    marginBottom: "0.65rem",
  },
  docSwitch: {
    border: "1px solid #E4E7EC",
    borderRadius: "18px",
    padding: "0.4rem",
    display: "grid",
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    gap: "0.4rem",
    background: "#F8FAFC",
  },
  docButton: (isSelected: boolean) => ({
    position: "relative" as const,
    border: "none",
    borderRadius: "14px",
    padding: "0.95rem 1.1rem",
    display: "flex",
    alignItems: "center",
    gap: "0.75rem",
    cursor: "pointer",
    background: isSelected ? "#FFFFFF" : "transparent",
    boxShadow: isSelected ? "0 18px 40px rgba(15, 23, 42, 0.12)" : "none",
    transition: "all 0.25s ease",
  }),
  iconBox: (isSelected: boolean) => ({
    padding: "0.75rem",
    borderRadius: "12px",
    background: isSelected ? "#EEF2FF" : "#E2E8F0",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  }),
  helperText: {
    fontSize: "0.85rem",
    color: "#94A3B8",
  },
  uploadBox: (hasFile: boolean, hasError: boolean) => ({
    position: "relative" as const,
    borderRadius: "22px",
    border: hasFile
      ? "1.5px solid #34D399"
      : hasError
        ? "1.5px solid #F97066"
        : "1.5px dashed #CBD5F5",
    padding: "2.25rem",
    background: hasFile ? "#F3FFFA" : "#F7F9FC",
    minHeight: "260px",
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "center",
    justifyContent: "center",
    gap: "1rem",
    textAlign: "center" as const,
  }),
  previewImage: {
    width: "100%",
    height: "14rem",
    objectFit: "cover" as const,
    borderRadius: "16px",
  },
  buttonRow: {
    display: "flex",
    gap: "1rem",
    flexWrap: "wrap" as const,
  },
  button: (isPrimary: boolean) => ({
    flex: 1,
    minWidth: "200px",
    padding: "1.1rem 1.5rem",
    borderRadius: "18px",
    border: isPrimary ? "none" : "1.5px solid #E4E7EC",
    background: isPrimary ? "#111827" : "#FFFFFF",
    color: isPrimary ? "#FFFFFF" : "#111827",
    fontSize: "1rem",
    fontWeight: 600,
    cursor: "pointer",
    boxShadow: isPrimary
      ? "0 22px 40px rgba(15, 23, 42, 0.2)"
      : "0 10px 25px rgba(15, 23, 42, 0.08)",
  }),
  overlay: {
    position: "fixed" as const,
    inset: 0,
    background: "rgba(15, 23, 42, 0.38)",
    backdropFilter: "blur(8px)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 50,
  },
  modal: {
    background: "#FFFFFF",
    borderRadius: "28px",
    padding: "2.5rem",
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "center",
    gap: "1rem",
    boxShadow: "0 35px 90px rgba(15, 23, 42, 0.25)",
  },
  error: {
    display: "flex",
    alignItems: "center",
    gap: "0.45rem",
    color: "#B42318",
    fontSize: "0.85rem",
    marginTop: "0.45rem",
  },
  footerNote: {
    marginTop: "2rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "0.5rem",
    color: "#475467",
    fontSize: "0.9rem",
  },
};

interface FileUploadBoxProps {
  label: string;
  uploadedFile: UploadedFile | null;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemove: () => void;
  onPreview: (src: string) => void;
  error?: string;
}

const FileUploadBox: React.FC<FileUploadBoxProps> = ({
  label,
  uploadedFile,
  onChange,
  onRemove,
  onPreview,
  error,
}) => (
  <div style={{ flex: 1, minWidth: "280px" }}>
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <label style={styles.label}>{label}</label>
      {!uploadedFile && (
        <span style={styles.helperText}>PNG • JPG • PDF • up to 10MB</span>
      )}
    </div>

    {uploadedFile ? (
      <div
        style={{
          borderRadius: "24px",
          overflow: "hidden",
          border: "1.5px solid #34D399",
          background: "#FFFFFF",
          boxShadow: "0 20px 60px rgba(15, 23, 42, 0.08)",
        }}
      >
        <div style={{ position: "relative" }}>
          <img
            src={uploadedFile.preview}
            alt="Preview"
            style={styles.previewImage}
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(180deg, rgba(0,0,0,0.05), rgba(0,0,0,0.45))",
            }}
          />

          <div
            style={{
              position: "absolute",
              top: "0.9rem",
              right: "0.9rem",
              display: "flex",
              gap: "0.45rem",
            }}
          >
            <button
              type="button"
              onClick={() => onPreview(uploadedFile.preview)}
              style={{
                width: "38px",
                height: "38px",
                borderRadius: "12px",
                border: "none",
                background: "rgba(255,255,255,0.95)",
                cursor: "pointer",
              }}
            >
              <Eye size={18} color="#0F172A" />
            </button>
            <button
              type="button"
              onClick={onRemove}
              style={{
                width: "38px",
                height: "38px",
                borderRadius: "12px",
                border: "none",
                background: "rgba(255,255,255,0.95)",
                cursor: "pointer",
              }}
            >
              <X size={18} color="#DC2626" />
            </button>
          </div>

          <div
            style={{
              position: "absolute",
              bottom: "1.1rem",
              left: "1.1rem",
              display: "flex",
              gap: "0.6rem",
              flexWrap: "wrap" as const,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.4rem",
                background: "rgba(255,255,255,0.95)",
                padding: "0.4rem 0.95rem",
                borderRadius: "999px",
                fontSize: "0.85rem",
                fontWeight: 600,
                color: "#047857",
              }}
            >
              <ShieldCheck size={16} color="#10B981" />
              {uploadedFile.confidence}% accurate
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.35rem",
                background: "rgba(255,255,255,0.95)",
                padding: "0.35rem 0.9rem",
                borderRadius: "999px",
                fontSize: "0.8rem",
                color: "#0F172A",
              }}
            >
              <Camera size={14} />
              AI scanned
            </div>
          </div>
        </div>

        {uploadedFile.extractedData && (
          <div
            style={{
              padding: "1.5rem",
              borderTop: "1px solid #DCFCE7",
              background: "#F1FFF8",
            }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
                gap: "1.2rem",
                fontSize: "0.9rem",
              }}
            >
              <div>
                <span style={{ color: "#6B7280", fontWeight: 500 }}>Holder</span>
                <p
                  style={{
                    color: "#0F172A",
                    fontWeight: 600,
                    marginTop: "0.35rem",
                  }}
                >
                  {uploadedFile.extractedData.name}
                </p>
              </div>
              <div>
                <span style={{ color: "#6B7280", fontWeight: 500 }}>Number</span>
                <p
                  style={{
                    color: "#0F172A",
                    fontWeight: 600,
                    marginTop: "0.35rem",
                  }}
                >
                  {uploadedFile.extractedData.number}
                </p>
              </div>
              <div>
                <span style={{ color: "#6B7280", fontWeight: 500 }}>
                  Valid thru
                </span>
                <p
                  style={{
                    color: "#0F172A",
                    fontWeight: 600,
                    marginTop: "0.35rem",
                  }}
                >
                  {uploadedFile.extractedData.expiry}
                </p>
              </div>
            </div>
            <div
              style={{
                marginTop: "0.8rem",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                color: "#059669",
                fontSize: "0.85rem",
                fontWeight: 500,
              }}
            >
              <CheckCircle2 size={16} />
              Data extracted successfully
            </div>
          </div>
        )}
      </div>
    ) : (
      <label style={styles.uploadBox(false, !!error)}>
        <input
          type="file"
          accept="image/*,.pdf"
          onChange={onChange}
          style={{ display: "none" }}
        />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "0.75rem",
          }}
        >
          <div
            style={{
              padding: "1rem",
              borderRadius: "50%",
              background: error ? "#FEE2E2" : "#E0E7FF",
            }}
          >
            <Upload size={32} color={error ? "#B42318" : "#4338CA"} />
          </div>
          <div>
            <p
              style={{
                fontSize: "1rem",
                fontWeight: 600,
                margin: 0,
                color: "#0F172A",
              }}
            >
              Drag & drop to upload
            </p>
            <p style={{ fontSize: "0.85rem", color: "#64748B", margin: 0 }}>
              or click to browse securely
            </p>
          </div>
          <div
            style={{
              marginTop: "0.4rem",
              padding: "0.7rem 1.3rem",
              background: "#0F172A",
              color: "#FFFFFF",
              borderRadius: "12px",
              fontSize: "0.85rem",
              fontWeight: 600,
              display: "flex",
              alignItems: "center",
              gap: "0.4rem",
            }}
          >
            <Camera size={16} />
            Choose file
          </div>
        </div>
      </label>
    )}

    {error && (
      <div style={styles.error}>
        <AlertCircle size={16} />
        <p>{error}</p>
      </div>
    )}
  </div>
);

const OCRUploadSystem: React.FC = () => {
  const [documentType, setDocumentType] = useState<DocumentType>("id");
  const [frontFile, setFrontFile] = useState<UploadedFile | null>(null);
  const [backFile, setBackFile] = useState<UploadedFile | null>(null);
  const [passportFile, setPassportFile] = useState<UploadedFile | null>(null);
  const [errors, setErrors] = useState<Errors>({});
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const simulateOCR = (file: File): Promise<UploadedFile> =>
    new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        setTimeout(() => {
          resolve({
            file,
            preview: event.target?.result as string,
            confidence: Math.floor(Math.random() * 10) + 90,
            extractedData: {
              name: "Jane Cooper",
              number: "DOC-" + Math.random().toString().slice(2, 10),
              expiry: "2030-06-15",
            },
          });
        }, 1400);
      };
      reader.readAsDataURL(file);
    });

  const handleFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "front" | "back" | "passport"
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    const uploadedFile = await simulateOCR(file);
    setIsProcessing(false);

    if (type === "front") setFrontFile(uploadedFile);
    if (type === "back") setBackFile(uploadedFile);
    if (type === "passport") setPassportFile(uploadedFile);
  };

  const removeFile = (type: "front" | "back" | "passport") => {
    if (type === "front") setFrontFile(null);
    if (type === "back") setBackFile(null);
    if (type === "passport") setPassportFile(null);
  };

  const validateForm = (): boolean => {
    const newErrors: Errors = {};
    if (documentType === "id") {
      if (!frontFile) newErrors.front = "Front side is required";
      if (!backFile) newErrors.back = "Back side is required";
    } else if (!passportFile) {
      newErrors.passport = "Passport photo is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

    const formData = {
      documentType,
      frontFile: frontFile?.file,
      backFile: backFile?.file,
      passportFile: passportFile?.file,
    };

    console.log("Form submitted:", formData);
    alert("Form submitted successfully! Check console for data.");
  };

  return (
    <div style={styles.container}>
      {isProcessing && (
        <div style={styles.overlay}>
          <div style={styles.modal}>
            <Loader2
              size={48}
              color="#2563EB"
              style={{ animation: "spin 1s linear infinite" }}
            />
            <p
              style={{
                fontSize: "1.125rem",
                fontWeight: "600",
                color: "#1F2937",
              }}
            >
              Processing document...
            </p>
            <p style={{ fontSize: "0.875rem", color: "#6B7280" }}>
              Extracting data with OCR
            </p>
          </div>
        </div>
      )}

      {previewImage && (
        <div style={styles.overlay} onClick={() => setPreviewImage(null)}>
          <div
            style={{ position: "relative", maxWidth: "90%", maxHeight: "90vh" }}
          >
            <button
              onClick={() => setPreviewImage(null)}
              style={{
                position: "absolute",
                top: "-3rem",
                right: 0,
                padding: "0.5rem",
                background: "white",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
              }}
              type="button"
            >
              <X size={24} />
            </button>
            <img
              src={previewImage}
              alt="Preview"
              style={{
                maxWidth: "100%",
                maxHeight: "85vh",
                borderRadius: "12px",
                boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
              }}
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}

      <div style={styles.formWrapper}>
        <div style={styles.formHeader}>
          <div>
            <h1
              style={{
                margin: 0,
                fontSize: "1.5rem",
                color: "#0F172A",
                fontWeight: 700,
              }}
            >
              Document check
            </h1>
            <p style={{ color: "#64748B", margin: 0 }}>
              Choose the document you need to verify and drop the files. That’s
              it.
            </p>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.35rem",
              color: "#059669",
              fontWeight: 600,
            }}
          >
            <ShieldCheck size={18} />
            Encrypted upload
          </div>
        </div>

        <div>
          <label style={styles.label}>Document type</label>
          <div style={styles.docSwitch}>
            <button
              type="button"
              onClick={() => setDocumentType("id")}
              style={styles.docButton(documentType === "id")}
            >
              <div style={styles.iconBox(documentType === "id")}>
                <CreditCard
                  size={26}
                  color={documentType === "id" ? "#1D4ED8" : "#94A3B8"}
                />
              </div>
              <div style={{ textAlign: "left" }}>
                <span
                  style={{
                    display: "block",
                    fontWeight: 700,
                    color: documentType === "id" ? "#111827" : "#6B7280",
                  }}
                >
                  ID Document
                </span>
                <small style={{ color: "#94A3B8" }}>Front + back</small>
              </div>
              {documentType === "id" && (
                <CheckCircle2
                  size={18}
                  color="#22C55E"
                  style={{ position: "absolute", top: 10, right: 12 }}
                />
              )}
            </button>

            <button
              type="button"
              onClick={() => setDocumentType("passport")}
              style={styles.docButton(documentType === "passport")}
            >
              <div style={styles.iconBox(documentType === "passport")}>
                <FileText
                  size={26}
                  color={documentType === "passport" ? "#1D4ED8" : "#94A3B8"}
                />
              </div>
              <div style={{ textAlign: "left" }}>
                <span
                  style={{
                    display: "block",
                    fontWeight: 700,
                    color: documentType === "passport" ? "#111827" : "#6B7280",
                  }}
                >
                  Passport
                </span>
                <small style={{ color: "#94A3B8" }}>Photo page</small>
              </div>
              {documentType === "passport" && (
                <CheckCircle2
                  size={18}
                  color="#22C55E"
                  style={{ position: "absolute", top: 10, right: 12 }}
                />
              )}
            </button>
          </div>
        </div>

        <p style={{ color: "#94A3B8", margin: 0 }}>
          • Use bright, even lighting • Upload clear scans • Keep documents
          within 10MB
        </p>

        {documentType === "id" ? (
          <div>
            <h3
              style={{
                marginBottom: "0.5rem",
                fontSize: "1.05rem",
                color: "#0F172A",
              }}
            >
              Upload national ID
            </h3>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
                gap: "1.25rem",
              }}
            >
              <FileUploadBox
                label="Front side *"
                uploadedFile={frontFile}
                onChange={(e) => handleFileUpload(e, "front")}
                onRemove={() => removeFile("front")}
                onPreview={(src) => setPreviewImage(src)}
                error={errors.front}
              />
              <FileUploadBox
                label="Back side *"
                uploadedFile={backFile}
                onChange={(e) => handleFileUpload(e, "back")}
                onRemove={() => removeFile("back")}
                onPreview={(src) => setPreviewImage(src)}
                error={errors.back}
              />
            </div>
          </div>
        ) : (
          <div>
            <h3
              style={{
                marginBottom: "0.5rem",
                fontSize: "1.05rem",
                color: "#0F172A",
              }}
            >
              Upload passport
            </h3>
            <FileUploadBox
              label="Passport photo *"
              uploadedFile={passportFile}
              onChange={(e) => handleFileUpload(e, "passport")}
              onRemove={() => removeFile("passport")}
              onPreview={(src) => setPreviewImage(src)}
              error={errors.passport}
            />
          </div>
        )}

        <div style={styles.buttonRow}>
          <button
            type="button"
            style={styles.button(false)}
            onClick={() => {
              setFrontFile(null);
              setBackFile(null);
              setPassportFile(null);
              setErrors({});
            }}
          >
            Reset
          </button>
          <button type="button" style={styles.button(true)} onClick={handleSubmit}>
            Submit
          </button>
        </div>

        <div style={styles.footerNote}>
          <ShieldCheck size={18} color="#10B981" />
          Files auto-delete after review. AES-256 at rest.
        </div>
      </div>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default OCRUploadSystem;
