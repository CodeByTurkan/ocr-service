export type DocumentType = "id" | "passport";

export interface ExtractedData {
  name?: string;
  number?: string;
  expiry?: string;
}

export interface UploadedFile {
  file: File;
  preview: string;
  confidence?: number;
  extractedData?: ExtractedData;
}

export interface Errors {
  uin?: string;
  front?: string;
  back?: string;
  passport?: string;
}
