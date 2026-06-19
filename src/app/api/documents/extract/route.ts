import { NextResponse } from "next/server";
import { DocumentExtractError, extractTextFromBuffer } from "@/lib/extract-document-text";
import {
  isAcceptedUploadFile,
  MAX_UPLOAD_BYTES,
  uploadFormatError,
} from "@/lib/upload-formats";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "Nenhum arquivo enviado." }, { status: 400 });
    }

    if (!isAcceptedUploadFile(file)) {
      return NextResponse.json({ error: uploadFormatError() }, { status: 400 });
    }

    if (file.size > MAX_UPLOAD_BYTES) {
      return NextResponse.json(
        { error: "Arquivo muito grande. Máximo 15 MB." },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const text = await extractTextFromBuffer(buffer, file.name, file.type);

    if (text.length < 10) {
      return NextResponse.json(
        { error: "O arquivo não contém texto suficiente. Cole o conteúdo manualmente." },
        { status: 400 }
      );
    }

    return NextResponse.json({
      text,
      fileName: file.name,
      characters: text.length,
    });
  } catch (error) {
    if (error instanceof DocumentExtractError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    console.error("document extract:", error);
    return NextResponse.json(
      { error: "Erro ao ler o arquivo. Tente outro formato ou cole o texto." },
      { status: 500 }
    );
  }
}
