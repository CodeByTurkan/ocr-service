import { UploadedFile } from "../types/document.types";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

/**
 * Upload file(s) to backend OCR service
 */
export const uploadOCR = async (
  files: File[]
): Promise<{ results: { filename: string; text: string }[] }> => {
  const formData = new FormData();
  files.forEach((file) => {
    formData.append("files", file);
  });

  const response = await fetch(`${API_BASE_URL}/client/ocr/upload-multiple`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`OCR upload failed: ${error}`);
  }

  return response.json();
};

/**
 * Process a single file through OCR and return formatted result
 */
export const processOCRFile = async (file: File): Promise<UploadedFile> => {
  // Create preview first
  const preview = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target?.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

  // Call backend API
  const { results } = await uploadOCR([file]);
  const ocrResult = results[0];

  // Parse extracted text to try to find structured data
  const extractedData = parseOCRText(ocrResult.text);

  return {
    file,
    preview,
    confidence: 95, // Backend doesn't return confidence, using default
    extractedData,
  };
};

/**
 * Parse OCR text to extract structured data (name, number, expiry)
 * This is a simple parser - can be enhanced based on actual document formats
 */
const parseOCRText = (text: string): {
  name?: string;
  number?: string;
  expiry?: string;
} => {
  const extracted: { name?: string; number?: string; expiry?: string } = {};

  // Try to find document number (common patterns: ID-XXX, DOC-XXX, alphanumeric)
  const numberMatch = text.match(
    /(?:ID|DOC|PASSPORT|PAS)[\s\-]?([A-Z0-9]{6,15})/i
  );
  if (numberMatch) {
    extracted.number = numberMatch[1].toUpperCase();
  }

  // Try to find expiry date (common formats: YYYY-MM-DD, DD/MM/YYYY, etc.)
  const expiryMatch = text.match(
    /(?:EXP|EXPIRY|VALID|VALID THRU)[\s:]+(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4}|\d{4}[\/\-]\d{1,2}[\/\-]\d{1,2})/i
  );
  if (expiryMatch) {
    extracted.expiry = expiryMatch[1];
  }

  // Try to find name (usually appears as "NAME:" or "HOLDER:" followed by text)
  const nameMatch = text.match(
    /(?:NAME|HOLDER|FULL NAME)[\s:]+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)+)/i
  );
  if (nameMatch) {
    extracted.name = nameMatch[1];
  }

  return extracted;
};

