import mammoth from "mammoth";

export class DocumentExtractError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "DocumentExtractError";
  }
}

function extension(fileName: string): string {
  const parts = fileName.split(".");
  return parts.length > 1 ? parts.pop()!.toLowerCase() : "";
}

async function extractPdf(buffer: Buffer): Promise<string> {
  const { PDFParse } = await import("pdf-parse");
  const parser = new PDFParse({ data: buffer });

  try {
    const data = await parser.getText();

    if (!data.text?.trim()) {
      throw new DocumentExtractError(
        "Não foi possível ler texto deste PDF. Pode ser um scan — cole o texto manualmente ou envie um PDF com texto selecionável."
      );
    }

    return data.text.trim();
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
