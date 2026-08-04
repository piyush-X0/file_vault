import { prisma } from "@/lib/prisma";

export async function findRelevantChunks(documentId: string, queryVector: number[], topK: number = 5) {
    const vectorLiteral = `[${queryVector.join(",")}]`;

    const chunks = await prisma.$queryRaw<{ id: string; content: string; chunkIndex: number }[]>`
        SELECT id, content, "chunkIndex"
        FROM "DocumentChunk"
        WHERE "documentId" = ${documentId}
        ORDER BY embedding <=> ${vectorLiteral}::vector
        LIMIT ${topK}
    `;

    return chunks;
}