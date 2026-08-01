import { prisma } from "@/lib/prisma";
import { generateEmbeddings } from "@/lib/embed";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    let id: string | undefined;

    try {
        ({ id } = await params);

        const document = await prisma.document.findUnique({
            where: { id },
            select: { id: true, embeddingStatus: true }
        });

        if (!document) {
            return NextResponse.json({ error: "Document not found" }, { status: 404 });
        }

        if (document.embeddingStatus === "EMBEDDED") {
            return NextResponse.json({ status: "ALREADY_EMBEDDED" }, { status: 200 });
        }

        if (document.embeddingStatus === "PROCESSING") {
            return NextResponse.json({ error: "Embedding already in progress" }, { status: 409 });
        }

        const chunks = await prisma.documentChunk.findMany({
            where: { documentId: id },
            select: { id: true, content: true },
            orderBy: { chunkIndex: "asc" }
        });

        if (chunks.length === 0) {
            return NextResponse.json({ error: "Document has not been chunked yet" }, { status: 409 });
        }

        await prisma.document.update({
            where: { id },
            data: { embeddingStatus: "PROCESSING" }
        });

        const vectors = await generateEmbeddings(chunks.map((chunk) => chunk.content));

        const ids = chunks.map((chunk) => chunk.id);
        const vectorLiterals = vectors.map((v) => `[${v.join(",")}]`);

        await prisma.$executeRaw`
            UPDATE "DocumentChunk" AS dc
            SET embedding = v.embedding::vector
            FROM unnest(${ids}::text[], ${vectorLiterals}::text[]) AS v(id, embedding)
            WHERE dc.id = v.id
        `;

        await prisma.document.update({
            where: { id },
            data: { embeddingStatus: "EMBEDDED" }
        });

        return NextResponse.json({ status: "EMBEDDED", chunkCount: chunks.length });

    } catch (error) {
        console.log("[POST /api/documents/[id]/embed]", error);

        if (id) {
            await prisma.document.update({
                where: { id },
                data: {
                    embeddingStatus: "FAILED",
                    embeddingError: error instanceof Error ? error.message : "Unknown error"
                }
            }).catch(() => { });
        }

        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}