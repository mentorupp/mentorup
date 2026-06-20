import mammoth from "mammoth";
import { getData } from "pdf-parse/worker";
import {
  InvalidPDFException,
  PasswordException,
  PDFParse,
} from "pdf-parse";

export class DocumentExtractError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "DocumentExtractError";
  }
}

let pdfWorkerReady = false;

function ensurePdfWorker() {
  if (!pdfWorkerReady) {
    // Inline worker — funciona no Windows local e no Vercel (serverless).
    PDFParse.setWorker(getData());
    pdfWorkerReady = true;
  }
}

function extension(fileName: string): string {
  const parts = fileName.split(".");
  return parts.length > 1 ? parts.pop()!.toLowerCase() : "";
}

function mapPdfError(error: unknown): DocumentExtractError {
  if (error instanceof DocumentExtractError) {
    return error;
  }

  if (error instanceof PasswordException) {
    return new DocumentExtractError(
      "Este PDF está protegido por senha. Remova a senha no leitor de PDF ou cole o texto manualmente."
    );
  }

  if (error instanceof InvalidPDFException) {
    return new DocumentExtractError(
      "Arquivo PDF inválido ou corrompido. Tente exportar novamente ou cole o texto."
    );
  }

  const message = error instanceof Error ? error.message : String(error);

  if (/fake worker|workerSrc|GlobalWorkerOptions/i.test(message)) {
    return new DocumentExtractError(
      "Falha ao processar o PDF no servidor. Cole o texto manualmente ou tente um PDF exportado do Word/Google Docs."
    );
  }

  return new DocumentExtractError(
    "Não foi possível ler este PDF. Tente outro arquivo ou cole o texto manualmente."
  );
}

async function extractPdf(buffer: Buffer): Promise<string> {
  ensurePdfWorker();

  const parser = new PDFParse({ data: new Uint8Array(buffer) });

  try {
    const data = await parser.getText();

    if (!data.text?.trim()) {
      throw new DocumentExtractError(
        "Não foi possível ler texto deste PDF. Pode ser um scan — cole o texto manualmente ou envie um PDF com texto selecionável."
      );
    }

    return data.text.trim();
  } catch (error) {
    throw mapPdfError(error);
  } finally {
    await parser.destroy();
  }
}

async function extractDocx(buffer: Buffer): Promise<string> {
  const result = await mammoth.extractRawText({ buffer });

  if (!result.value?.trim()) {
    throw new DocumentExtractError(
      "O arquivo Word está vazio ou não pôde ser lido. Tente salvar como .docx ou cole o texto."
    );
  }

  return result.value.trim();
}

export async function extractTextFromBuffer(
  buffer: Buffer,
  fileName: string,
  mimeType?: string
): Promise<string> {
  const ext = extension(fileName);

  if (ext === "pdf" || mimeType === "application/pdf") {
    return extractPdf(buffer);
  }

  if (
    ext === "docx" ||
    mimeType ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ) {
    return extractDocx(buffer);
  }

  if (ext === "doc" || mimeType === "application/msword") {
    throw new DocumentExtractError(
      "Arquivos .doc antigos não são suportados. Salve como .docx ou PDF no Word e envie novamente."
    );
  }

  throw new DocumentExtractError(
    "Formato não aceito. Use PDF, Word (.docx) ou cole o texto."
  );
}

export async function extractTextFromFile(file: File): Promise<string> {
  const buffer = Buffer.from(await file.arrayBuffer());
  return extractTextFromBuffer(buffer, file.name, file.type);
}
