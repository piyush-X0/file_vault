const DEFAULT_CHUNK_SIZE = 1000;
const DEFAULT_OVERLAP = 150;

interface Chunk {
    content: string;
    chunkIndex: number;
    charCount: number;
}

function snapToWordBoundary(text: string, position: number): number {
    if (position <= 0 || text[position - 1] === " " || text[position - 1] === "\n") {
        return position;
    }
    let i = position;
    while (i < text.length && text[i] !== " " && text[i] !== "\n") {
        i++;
    }
    return i;
}

export function chunkText(
    text: string,
    chunkSize: number = DEFAULT_CHUNK_SIZE,
    overlap: number = DEFAULT_OVERLAP
): Chunk[] {
    if (!text || chunkSize <= 0) return [];

    const chunks: Chunk[] = [];
    const separators = ["\n\n", "\n", ". ", " "];

    let currentPosition = 0;
    while (currentPosition < text.length) {
        let endPosition = currentPosition + chunkSize;

        if (endPosition >= text.length) {
            endPosition = text.length;
        } else {
            const windowText = text.slice(currentPosition, endPosition);
            let foundSeparator = false;
            for (const sep of separators) {
                const lastIndex = windowText.lastIndexOf(sep);
                if (lastIndex !== -1 && lastIndex > 0) {
                    endPosition = currentPosition + lastIndex + sep.length;
                    foundSeparator = true;
                    break;
                }
            }
            if (!foundSeparator) {
                endPosition = currentPosition + chunkSize;
            }
        }

        const content = text.slice(currentPosition, endPosition);
        chunks.push({
            content: content.trim(),
            chunkIndex: chunks.length,
            charCount: content.trim().length
        });

        const nextStart = endPosition - overlap;
        if (nextStart <= currentPosition) {
            currentPosition = endPosition;
        } else {
            currentPosition = snapToWordBoundary(text, nextStart);
        }

        if (text.length - currentPosition <= overlap) {
            break;
        }
    }

    return chunks;
}