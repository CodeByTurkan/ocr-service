import { UploadedFile, ExtractedData } from "../types/document.types";

export const simulateOCR = (file: File): Promise<UploadedFile> => {
  return new Promise((resolve) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      // Simulate OCR processing delay
      setTimeout(() => {
        const extractedData: ExtractedData = {
          name: "John Doe",
          number: "ID-" + Math.random().toString().slice(2, 11),
          expiry: "2028-12-31",
        };

        resolve({
          file,
          preview: e.target?.result as string,
          confidence: Math.floor(Math.random() * 15) + 85,
          extractedData,
        });
      }, 1500);
    };

    reader.readAsDataURL(file);
  });
};
