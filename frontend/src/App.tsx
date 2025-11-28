import React, { useEffect, useRef, useState } from "react";
import {
  AlertCircle,
  Calendar,
  Camera,
  CheckCircle2,
  ChevronDown,
  CreditCard,
  Eye,
  FileText,
  Loader2,
  ShieldCheck,
  Upload,
  X,
} from "lucide-react";
import { processOCRFile } from "./utils/api";

type DocumentType = "id" | "passport";

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

interface Errors {
  firstName?: string;
  lastName?: string;
  dateOfBirth?: string;
  citizenship?: string;
  uin?: string;
  privacy?: string;
  terms?: string;
  front?: string;
  back?: string;
  passport?: string;
}

const countries = [
  "Belarus",
  "United States",
  "United Kingdom",
  "Canada",
  "Germany",
  "France",
  "Italy",
  "Spain",
  "Poland",
  "Ukraine",
  "Russia",
  "Lithuania",
  "Latvia",
  "Estonia",
  "Other",
];

const getInputClasses = (hasError: boolean) =>
  `w-full rounded-2xl border px-4 py-3 text-base font-medium transition focus:outline-none focus:ring-4 ${
    hasError
      ? "border-rose-300 bg-rose-50 text-rose-900 focus:border-rose-500 focus:ring-rose-100"
      : "border-slate-200 bg-slate-50 text-slate-900 focus:border-slate-900 focus:ring-slate-100"
  }`;

const OCRUploadSystem: React.FC = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [citizenship, setCitizenship] = useState("");
  const [uin, setUin] = useState("");
  const [agreePrivacy, setAgreePrivacy] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [showCitizenshipDropdown, setShowCitizenshipDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!showCitizenshipDropdown) return;
    const handleClick = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowCitizenshipDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [showCitizenshipDropdown]);

  const [documentType, setDocumentType] = useState<DocumentType>("id");
  const [frontFile, setFrontFile] = useState<UploadedFile | null>(null);
  const [backFile, setBackFile] = useState<UploadedFile | null>(null);
  const [passportFile, setPassportFile] = useState<UploadedFile | null>(null);
  const [errors, setErrors] = useState<Errors>({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const handleFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "front" | "back" | "passport"
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    try {
      const uploadedFile = await processOCRFile(file);
      if (type === "front") {
        setFrontFile(uploadedFile);
        setErrors((prev) => ({ ...prev, front: undefined }));
      } else if (type === "back") {
        setBackFile(uploadedFile);
        setErrors((prev) => ({ ...prev, back: undefined }));
      } else {
        setPassportFile(uploadedFile);
        setErrors((prev) => ({ ...prev, passport: undefined }));
      }
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to process document";
      if (type === "front") {
        setErrors((prev) => ({ ...prev, front: message }));
      } else if (type === "back") {
        setErrors((prev) => ({ ...prev, back: message }));
      } else {
        setErrors((prev) => ({ ...prev, passport: message }));
      }
      alert(`Error: ${message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const removeFile = (type: "front" | "back" | "passport") => {
    if (type === "front") setFrontFile(null);
    if (type === "back") setBackFile(null);
    if (type === "passport") setPassportFile(null);
  };

  const validateForm = (): Errors => {
    const newErrors: Errors = {};
    if (!firstName.trim()) newErrors.firstName = "This field is required";
    if (!lastName.trim()) newErrors.lastName = "This field is required";
    if (!dateOfBirth.trim()) newErrors.dateOfBirth = "This field is required";
    if (!citizenship) newErrors.citizenship = "This field is required";
    if (!uin.trim()) newErrors.uin = "This field is required";
    if (!agreePrivacy) newErrors.privacy = "Please confirm to continue";
    if (!agreeTerms) newErrors.terms = "Please confirm to continue";

    if (documentType === "id") {
      if (!frontFile) newErrors.front = "Front side is required";
      if (!backFile) newErrors.back = "Back side is required";
    } else if (!passportFile) {
      newErrors.passport = "Passport photo is required";
    }

    return newErrors;
  };

  const handleSubmit = () => {
    const validationErrors = validateForm();
    setErrors(validationErrors);
    const errorKeys = Object.keys(validationErrors);
    if (errorKeys.length > 0) {
      const target = document.querySelector(
        `[data-error-key="${errorKeys[0]}"]`
      );
      target?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    const payload = {
      personalDetails: {
        firstName,
        lastName,
        dateOfBirth,
        citizenship,
        uin,
        documentType,
      },
      documents: {
        frontFile: frontFile?.file,
        backFile: backFile?.file,
        passportFile: passportFile?.file,
      },
      ocrData:
        documentType === "id"
          ? { front: frontFile?.extractedData, back: backFile?.extractedData }
          : { passport: passportFile?.extractedData },
    };

    console.log("Form submitted:", payload);
    alert(
      "Form submitted! Manual entries will now be compared with OCR results."
    );
  };

  const resetForm = () => {
    setFirstName("");
    setLastName("");
    setDateOfBirth("");
    setCitizenship("");
    setUin("");
    setAgreePrivacy(false);
    setAgreeTerms(false);
    setFrontFile(null);
    setBackFile(null);
    setPassportFile(null);
    setErrors({});
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      {isProcessing && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm">
          <div className="flex h-full items-center justify-center px-4">
            <div className="flex flex-col items-center gap-3 rounded-3xl bg-white p-10 text-center shadow-2xl">
              <Loader2 className="h-12 w-12 animate-spin text-slate-900" />
              <p className="text-lg font-semibold text-slate-900">
                Processing document...
              </p>
              <p className="text-sm text-slate-500">
                Extracting and validating your data with OCR
              </p>
            </div>
          </div>
        </div>
      )}

      {previewImage && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/70 backdrop-blur-sm"
          onClick={() => setPreviewImage(null)}
        >
          <div className="flex h-full items-center justify-center px-6">
            <div className="relative">
              <button
                type="button"
                onClick={() => setPreviewImage(null)}
                className="absolute -right-4 -top-4 rounded-full bg-white p-2 shadow-lg"
              >
                <X className="h-5 w-5 text-slate-900" />
              </button>
              <img
                src={previewImage}
                alt="Preview"
                className="max-h-[85vh] max-w-[90vw] rounded-3xl shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          </div>
        </div>
      )}

      <div className="mx-auto flex max-w-6xl flex-col gap-8">
        <section className="rounded-3xl bg-white p-8 shadow-lg shadow-slate-200 ring-1 ring-slate-100">
          <header className="mb-8 flex flex-col gap-2">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">
              Manual Input
            </p>
            <h1 className="text-3xl font-semibold text-slate-900">
              Personal Details
            </h1>
            <p className="text-base text-slate-500">
              Enter the data exactly as it appears on your identity document. Our
              OCR will verify that both sources match before submission.
            </p>
          </header>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="space-y-2" data-error-key="firstName">
              <label className="text-sm font-semibold text-slate-700">
                First Name
              </label>
              <input
                name="firstName"
                value={firstName}
                onChange={(e) => {
                  setFirstName(e.target.value);
                  setErrors((prev) => ({ ...prev, firstName: undefined }));
                }}
                placeholder="Type name"
                className={getInputClasses(!!errors.firstName)}
              />
              <HelperText message={errors.firstName} />
            </div>

            <div className="space-y-2" data-error-key="lastName">
              <label className="text-sm font-semibold text-slate-700">
                Last Name
              </label>
              <input
                name="lastName"
                value={lastName}
                onChange={(e) => {
                  setLastName(e.target.value);
                  setErrors((prev) => ({ ...prev, lastName: undefined }));
                }}
                placeholder="Type last name"
                className={getInputClasses(!!errors.lastName)}
              />
              <HelperText message={errors.lastName} />
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="space-y-2" data-error-key="dateOfBirth">
              <label className="text-sm font-semibold text-slate-700">
                Date of Birth
              </label>
              <div className="relative">
                <input
                  name="dateOfBirth"
                  value={dateOfBirth}
                  onChange={(e) => {
                    setDateOfBirth(e.target.value);
                    setErrors((prev) => ({ ...prev, dateOfBirth: undefined }));
                  }}
                  placeholder="DD/MM/YYYY"
                  className={getInputClasses(!!errors.dateOfBirth) + " pr-12"}
                />
                <Calendar className="absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
              </div>
              <HelperText message={errors.dateOfBirth} placeholder="Label" />
            </div>

            <div
              className="space-y-2"
              data-error-key="citizenship"
              ref={dropdownRef}
            >
              <label className="text-sm font-semibold text-slate-700">
                Citizenship
              </label>
              <button
                type="button"
                onClick={() => setShowCitizenshipDropdown((prev) => !prev)}
                className={`relative flex w-full items-center justify-between rounded-2xl border px-4 py-3 text-left text-base font-medium transition focus:outline-none focus:ring-4 ${
                  errors.citizenship
                    ? "border-rose-300 bg-rose-50 text-rose-900 focus:border-rose-500 focus:ring-rose-100"
                    : "border-slate-200 bg-slate-50 text-slate-900 focus:border-slate-900 focus:ring-slate-100"
                }`}
              >
                <span className={citizenship ? "text-slate-900" : "text-slate-400"}>
                  {citizenship || "Choose country"}
                </span>
                <ChevronDown className="h-5 w-5 text-slate-400" />
              </button>
              {showCitizenshipDropdown && (
                <div className="mt-2 max-h-60 w-full overflow-y-auto rounded-2xl border border-slate-200 bg-white shadow-lg">
                  {countries.map((country) => (
                    <button
                      key={country}
                      type="button"
                      className="w-full px-4 py-2 text-left text-sm text-slate-600 transition hover:bg-slate-50"
                      onClick={() => {
                        setCitizenship(country);
                        setErrors((prev) => ({ ...prev, citizenship: undefined }));
                        setShowCitizenshipDropdown(false);
                      }}
                    >
                      {country}
                    </button>
                  ))}
                </div>
              )}
              <HelperText message={errors.citizenship} />
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">
                Document Type
              </label>
              <div className="grid grid-cols-2 gap-3">
                {(["id", "passport"] as DocumentType[]).map((type) => {
                  const active = documentType === type;
                  const label = type === "id" ? "ID Document" : "Passport";
                  const Icon = type === "id" ? CreditCard : FileText;
                  return (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setDocumentType(type)}
                      className={`flex items-center gap-3 rounded-2xl border px-4 py-3 text-left text-base font-semibold transition ${
                        active
                          ? "border-slate-900 bg-slate-900 text-white shadow-lg"
                          : "border-slate-200 bg-white text-slate-700 hover:border-slate-400"
                      }`}
                    >
                      <span className={`rounded-xl p-2 ${active ? "bg-white/20" : "bg-slate-100"}`}>
                        <Icon className={`h-5 w-5 ${active ? "text-white" : "text-slate-500"}`} />
                      </span>
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="space-y-2" data-error-key="uin">
              <label className="text-sm font-semibold text-slate-700">
                Unique Identification Number (UIN)
              </label>
              <input
                name="uin"
                value={uin}
                onChange={(e) => {
                  setUin(e.target.value);
                  setErrors((prev) => ({ ...prev, uin: undefined }));
                }}
                placeholder="Type number"
                className={getInputClasses(!!errors.uin)}
              />
              <HelperText message={errors.uin} />
            </div>
          </div>
        </section>

        <section className="rounded-3xl bg-white p-8 shadow-lg shadow-slate-200 ring-1 ring-slate-100">
          <div className="flex flex-col gap-2 border-b border-slate-100 pb-6">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">
              Uploads
            </p>
            <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h2 className="text-3xl font-semibold text-slate-900">
                  Document Verification
                </h2>
                <p className="text-base text-slate-500">
                  Upload clear scans so we can compare OCR output with your manual
                  entries.
                </p>
              </div>
              <div className="flex items-center gap-2 text-sm font-medium text-emerald-600">
                <ShieldCheck className="h-4 w-4" />
                Bank-grade encryption
              </div>
            </div>
          </div>

          <p className="mt-6 text-sm text-slate-500">
            • Use bright, even lighting • Upload clear scans • Keep documents
            within 10MB
          </p>

          {documentType === "id" ? (
            <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
              <FileUploadBox
                label="Front side *"
                uploadedFile={frontFile}
                onChange={(e) => handleFileUpload(e, "front")}
                onRemove={() => removeFile("front")}
                onPreview={(src) => setPreviewImage(src)}
                error={errors.front}
                errorKey="front"
              />
              <FileUploadBox
                label="Back side *"
                uploadedFile={backFile}
                onChange={(e) => handleFileUpload(e, "back")}
                onRemove={() => removeFile("back")}
                onPreview={(src) => setPreviewImage(src)}
                error={errors.back}
                errorKey="back"
              />
            </div>
          ) : (
            <div className="mt-6">
              <FileUploadBox
                label="Passport photo *"
                uploadedFile={passportFile}
                onChange={(e) => handleFileUpload(e, "passport")}
                onRemove={() => removeFile("passport")}
                onPreview={(src) => setPreviewImage(src)}
                error={errors.passport}
                errorKey="passport"
              />
            </div>
          )}

          <div className="mt-8 space-y-4">
            <label className="flex items-start gap-3" data-error-key="privacy">
              <input
                type="checkbox"
                className="mt-1 h-5 w-5 rounded border-slate-300 text-slate-900 focus:ring-slate-200"
                checked={agreePrivacy}
                onChange={(e) => {
                  setAgreePrivacy(e.target.checked);
                  setErrors((prev) => ({ ...prev, privacy: undefined }));
                }}
              />
              <span className="text-sm text-slate-600">
                I agree to the processing of my personal data for the purpose of
                handling my inquiry and have read the{" "}
                <a href="#" className="font-semibold text-slate-900 underline">
                  Privacy Policy
                </a>
                .
                <HelperText message={errors.privacy} />
              </span>
            </label>

            <label className="flex items-start gap-3" data-error-key="terms">
              <input
                type="checkbox"
                className="mt-1 h-5 w-5 rounded border-slate-300 text-slate-900 focus:ring-slate-200"
                checked={agreeTerms}
                onChange={(e) => {
                  setAgreeTerms(e.target.checked);
                  setErrors((prev) => ({ ...prev, terms: undefined }));
                }}
              />
              <span className="text-sm text-slate-600">
                I agree to the processing of my personal data for the purpose of
                handling my inquiry and have read the{" "}
                <a href="#" className="font-semibold text-slate-900 underline">
                  Terms of Use
                </a>
                .
                <HelperText message={errors.terms} />
              </span>
            </label>
          </div>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <button
              type="button"
              onClick={resetForm}
              className="flex-1 rounded-2xl border border-slate-200 bg-white py-3 text-base font-semibold text-slate-900 transition hover:border-slate-400"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              className="flex-1 rounded-2xl bg-slate-900 py-3 text-base font-semibold text-white shadow-lg shadow-slate-300 transition hover:bg-slate-800"
            >
              Next
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};

const HelperText: React.FC<{ message?: string; placeholder?: string }> = ({
  message,
  placeholder = "This field is required",
}) => (
  <p
    className={`text-sm ${
      message ? "text-rose-500" : "text-slate-400"
    }`}
  >
    {message || placeholder}
  </p>
);

interface FileUploadBoxProps {
  label: string;
  uploadedFile: UploadedFile | null;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemove: () => void;
  onPreview: (src: string) => void;
  error?: string;
  errorKey: keyof Errors;
}

const FileUploadBox: React.FC<FileUploadBoxProps> = ({
  label,
  uploadedFile,
  onChange,
  onRemove,
  onPreview,
  error,
  errorKey,
}) => (
  <div className="space-y-2" data-error-key={errorKey}>
    <div className="flex items-center justify-between text-sm text-slate-500">
      <span className="font-semibold text-slate-900">{label}</span>
      {!uploadedFile && (
        <span className="text-xs uppercase tracking-wide">
          PNG • JPG • PDF • up to 10MB
        </span>
      )}
    </div>

    {uploadedFile ? (
      <div className="overflow-hidden rounded-2xl border border-emerald-200 bg-white shadow-sm">
        <div className="relative">
          <img
            src={uploadedFile.preview}
            alt="Preview"
            className="h-52 w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/40" />

          <div className="absolute right-4 top-4 flex gap-2">
            <button
              type="button"
              onClick={() => onPreview(uploadedFile.preview)}
              className="rounded-xl bg-white/90 p-2 shadow"
            >
              <Eye className="h-4 w-4 text-slate-900" />
            </button>
            <button
              type="button"
              onClick={onRemove}
              className="rounded-xl bg-white/90 p-2 shadow"
            >
              <X className="h-4 w-4 text-rose-500" />
            </button>
          </div>

          <div className="absolute bottom-4 left-4 flex flex-wrap gap-2">
            <span className="flex items-center gap-1 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-emerald-700">
              <ShieldCheck className="h-3.5 w-3.5" />
              {uploadedFile.confidence}% match
            </span>
            <span className="flex items-center gap-1 rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-slate-700">
              <Camera className="h-3.5 w-3.5" />
              AI scanned
            </span>
          </div>
        </div>

        {uploadedFile.extractedData && (
          <div className="grid grid-cols-1 gap-4 border-t border-emerald-100 bg-emerald-50/60 p-4 text-sm text-slate-700 md:grid-cols-3">
            <div>
              <p className="text-xs uppercase tracking-wide text-slate-400">
                Holder
              </p>
              <p className="font-semibold text-slate-900">
                {uploadedFile.extractedData.name || "—"}
              </p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-slate-400">
                Number
              </p>
              <p className="font-semibold text-slate-900">
                {uploadedFile.extractedData.number || "—"}
              </p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-slate-400">
                Valid thru
              </p>
              <p className="font-semibold text-slate-900">
                {uploadedFile.extractedData.expiry || "—"}
              </p>
            </div>
            <div className="col-span-full flex items-center gap-1 text-emerald-700">
              <CheckCircle2 className="h-4 w-4" />
              Data extracted successfully
            </div>
          </div>
        )}
      </div>
    ) : (
      <label className="flex min-h-[240px] flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-slate-300 bg-slate-50 text-center transition hover:border-slate-500">
        <input
          type="file"
          accept="image/*,.pdf"
          onChange={onChange}
          className="hidden"
        />
        <span className="rounded-full bg-slate-100 p-3">
          <Upload className="h-6 w-6 text-slate-500" />
        </span>
        <div>
          <p className="text-base font-semibold text-slate-900">
            Drag & drop to upload
          </p>
          <p className="text-sm text-slate-500">or click to browse securely</p>
        </div>
        <span className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow">
          <Camera className="mr-2 inline h-4 w-4" />
          Choose file
        </span>
      </label>
    )}

    {error && (
      <p className="mt-2 flex items-center gap-2 text-sm text-rose-500">
        <AlertCircle className="h-4 w-4" />
        {error}
      </p>
    )}
  </div>
);

export default OCRUploadSystem;