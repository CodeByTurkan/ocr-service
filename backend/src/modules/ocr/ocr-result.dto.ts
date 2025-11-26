export interface OcrResult {
  description: string;
  boundingPoly?: {
    vertices: Array<{ x?: number; y?: number }>;
  };
}
