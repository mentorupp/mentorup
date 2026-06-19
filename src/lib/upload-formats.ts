/** Formatos aceitos em todos os uploads de material do aluno */

export const ACCEPTED_FILE_EXTENSIONS = [".pdf", ".doc", ".docx"] as const;

export const ACCEPTED_FILE_MIME_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
] as const;

export const ACCEPTED_FILE_INPUT =
  ".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document";

export const UPLOAD_FORMAT_LABEL = "PDF, Word (.doc/.docx) ou cole o texto";

export const UPLOAD_FORMAT_HINT =
  "Envie o material em PDF, Word ou cole diretamente no campo de texto — o padrão usado na faculdade.";

export const MAX_UPLOAD_BYTES = 15 * 1024 * 1024; // 15 MB

export function isAcceptedUploadFile(file: File): boolean {
  const ext = file.name.includes(".")
    ? `.${file.name.split(".").pop()!.toLowerCase()}`
    : "";

  if (ACCEPTED_FILE_EXTENSIONS.includes(ext as (typeof ACCEPTED_FILE_EXTENSIONS)[number])) {
    return true;
  }

  return ACCEPTED_FILE_MIME_TYPES.includes(
    file.type as (typeof ACCEPTED_FILE_MIME_TYPES)[number]
  );
}

export function uploadFormatError(): string {
  return "Formato não aceito. Envie PDF, Word (.doc ou .docx) ou cole o texto no campo abaixo.";
}
