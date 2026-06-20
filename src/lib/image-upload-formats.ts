/** Formatos aceitos para foto de prova / simulado */

export const ACCEPTED_IMAGE_EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp", ".heic", ".heif"] as const;

export const ACCEPTED_IMAGE_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/heic",
  "image/heif",
] as const;

export const ACCEPTED_IMAGE_INPUT = "image/jpeg,image/png,image/webp,image/heic,image/heif,.jpg,.jpeg,.png,.webp,.heic,.heif";

export const MAX_IMAGE_BYTES = 8 * 1024 * 1024; // 8 MB
export const MAX_IMAGES = 4;

export function isAcceptedImageFile(file: File): boolean {
  const ext = file.name.includes(".")
    ? `.${file.name.split(".").pop()!.toLowerCase()}`
    : "";

  if (ACCEPTED_IMAGE_EXTENSIONS.includes(ext as (typeof ACCEPTED_IMAGE_EXTENSIONS)[number])) {
    return true;
  }

  if (file.type.startsWith("image/")) {
    return true;
  }

  return ACCEPTED_IMAGE_MIME_TYPES.includes(
    file.type as (typeof ACCEPTED_IMAGE_MIME_TYPES)[number]
  );
}
