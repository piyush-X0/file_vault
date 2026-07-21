import { prisma } from "@/lib/prisma";
import { chunkText } from "@/lib/chunk";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;

        const document = await prisma.document.findUnique({
            where: { id },
            select: { id: true, extractionStatus: true, extractedText: true }
        });

        if (!document) {
            return NextResponse.json({ error: "Document not found" }, { status: 404 });
        }
        if (document.extractionStatus !== "EXTRACTED" || !document.extractedText) {
            return NextResponse.json({ error: "Document has not been extracted yet" }, { status: 409 });
        }

        const existingChunkCount = await prisma.documentChunk.count({ where: { documentId: id } });
        if (existingChunkCount > 0) {
            return NextResponse.json({ status: "ALREADY_CHUNKED", chunkCount: existingChunkCount }, { status: 200 });
        }

        const chunks = chunkText(document.extractedText);

        await prisma.documentChunk.createMany({
            data: chunks.map((chunk) => ({
                documentId: id,
                content: chunk.content,
                chunkIndex: chunk.chunkIndex,
                charCount: chunk.charCount
            }))
        });

        return NextResponse.json({ status: "CHUNKED", chunkCount: chunks.length });
    } catch (error) {
        console.log("[POST /api/documents/[id]/chunk]", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}