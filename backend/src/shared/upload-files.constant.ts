export const MAX_FILE_UPLOADS = 2;
export const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024;
export const ALLOWED_MIME_TYPES = new Set<string>(['image/jpeg', 'image/png']);

export const ALLOWED_EXTENSIONS = new Set<string>(['.jpg', '.jpeg', '.png']);

export function extractExtension(name: string): string | null {
  const idx = name.lastIndexOf('.');
  if (idx === -1) {
    return null;
  }
  return name.substring(idx).toLowerCase();
}

export function formatAllowedTypes(): string {
  return Array.from(ALLOWED_EXTENSIONS)
    .map((e) => e.replace('.', '').toUpperCase())
    .join(', ');
}

export function formatMaxSize(bytes: number): string {
  const mb = bytes / (1024 * 1024);
  if (Number.isInteger(mb)) {
    return `${mb} MB`;
  }
  return `${mb.toFixed(1)} MB`;
}
