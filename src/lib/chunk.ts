const DEFAULT_CHUNK_SIZE = 1000;
const DEFAULT_OVERLAP = 150;

interface Chunk {
    content: string;
    chunkIndex: number;
    charCount: number;
}

export function chunkText(
    text: string,
    chunkSize: number = DEFAULT_CHUNK_SIZE,
    overlap: number = DEFAULT_OVERLAP
): Chunk[] {
    const segments = splitRecursively(text, chunkSize);

    const chunks: Chunk[] = [];
    let buffer = "";

    for (const segment of segments) {
        if ((buffer + segment).length > chunkSize && buffer.length > 0) {
            chunks.push(makeChunk(buffer, chunks.length));
            const tail = buffer.slice(-overlap);
            buffer = tail + segment;
        } else {
            buffer += segment;
        }
    }
    if (buffer.trim().length > 0) {
        chunks.push(makeChunk(buffer, chunks.length));
    }

    return chunks;
}

function makeChunk(content: string, index: number): Chunk {
    const trimmed = content.trim();
    return { content: trimmed, chunkIndex: index, charCount: trimmed.length };
}

function splitRecursively(text: string, chunkSize: number): string[] {
    const separators = ["\n\n", "\n", ". ", " "];
    return splitBySeparators(text, separators, chunkSize);
}

function splitBySeparators(text: string, separators: string[], chunkSize: number): string[] {
    if (text.length <= chunkSize) return [text];

    const [separator, ...rest] = separators;

    if (!separator) {
        const pieces: string[] = [];
        for (let i = 0; i < text.length; i += chunkSize) {
            pieces.push(text.slice(i, i + chunkSize));
        }
        return pieces;
    }

    const parts = text.split(separator);
    const result: string[] = [];

    for (const part of parts) {
        const piece = part + separator;
        if (piece.length > chunkSize) {
            result.push(...splitBySeparators(piece, rest, chunkSize));
        } else {
            result.push(piece);
        }
    }

    return result;
}