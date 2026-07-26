import { snapToWordBoundary } from "./snapToWordBoundary";


export function snapToSentenceBoundary(text: string, position: number, searchLimit: number = 200): number {
    const before = text.slice(Math.max(0, position - 2), position);
    if (/[.!?]\s$/.test(before) || text[position - 1] === "\n") {
        return position;
    }

    const searchStart = Math.max(0, position - searchLimit);
    const window = text.slice(searchStart, position);
    const sentenceEnders = [". ", "! ", "? ", "\n"];

    let latestMatch = -1;
    for (const ender of sentenceEnders) {
        const idx = window.lastIndexOf(ender);
        if (idx !== -1) {
            const matchEnd = idx + ender.length;
            if (matchEnd > latestMatch) latestMatch = matchEnd;
        }
    }

    if (latestMatch !== -1) {
        return searchStart + latestMatch;
    }

    return snapToWordBoundary(text, position);
}