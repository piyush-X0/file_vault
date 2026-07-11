import mammoth from "mammoth";

export async function ExtractText(buffer: Buffer, mimetype: string): Promise<string> {
    let rawText: string;

    switch (mimetype) {
        case "application/pdf": {
            const pdfParseModule = await (import("pdf-parse")) as any;
            const pdfParse = pdfParseModule.default || pdfParseModule;
            const data = await pdfParse(buffer);
            rawText = data.text;
            break;
        }
        case "application/vnd.openxmlformats-officedocument.wordprocessingml.document": {
            const { value } = await mammoth.extractRawText({ buffer });
            rawText = value;
            break;
        }
        case "text/plain":
        case "text/markdown": {
            rawText = buffer.toString("utf-8");
            break;
        }
        default: throw Error(`Unsupported mimetpye for extraction: ${mimetype}`);
    }
    if (!rawText.trim()) {
        throw new Error("Extraction produced no text ( possibly  a scanned/image-only file ) ")
    }
    return rawText.replace(/\u0000/g, "");
}