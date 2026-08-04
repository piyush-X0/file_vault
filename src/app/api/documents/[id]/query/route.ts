import { prisma } from "@/lib/prisma";
import { generateEmbeddings } from "@/lib/embed";
import { findRelevantChunks } from "@/lib/search";
import { generateAnswer } from "@/lib/answer";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    try {
        const body = await req.json();
        const question: string = body.question;

        if (!question || !question.trim()) {
            return NextResponse.json({ error: "Question is required" }, { status: 400 });
        }

        const document = await prisma.document.findUnique({
            where: { id },
            select: { embeddingStatus: true }
        });

        if (!document) {
            return NextResponse.json({ error: "Document not found" }, { status: 404 });
        }

        if (document.embeddingStatus !== "EMBEDDED") {
            return NextResponse.json({ error: "Document is not ready for querying yet" }, { status: 409 });
        }

        const [questionVector] = await generateEmbeddings([question]);

        const relevantChunks = await findRelevantChunks(id, questionVector, 5);

        const answer = await generateAnswer(
            question,
            relevantChunks.map((chunk) => chunk.content)
        );

        return NextResponse.json({
            answer,
            sources: relevantChunks.map((chunk) => ({ chunkIndex: chunk.chunkIndex }))
        });

    } catch (error) {
        console.log("[POST /api/documents/[id]/query]", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}