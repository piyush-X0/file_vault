import { prisma } from "@/lib/prisma";
import { getFileBuffer } from "@/lib/r2";
import { ExtractText } from "@/lib/extract";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;

        const document = await prisma.document.findUnique({
            where: { id },
            select: { id: true, r2key: true, mimetype: true, uploadStatus: true, extractionStatus: true }
        });

        if (!document) {
            return NextResponse.json({ error: "Document not found" }, { status: 404 });
        }
        if (document.uploadStatus !== "UPLOADED") {
            return NextResponse.json({ error: "File not confirmed as uploaded yet" }, { status: 409 });
        }
        if (document.extractionStatus === "PROCESSING") {
            return NextResponse.json({ error: "Extraction already in progress" }, { status: 409 });
        }
        if (document.extractionStatus === "EXTRACTED") {
            return NextResponse.json({ status: "EXTRACTED", message: "Already extracted" }, { status: 200 });
        }

        await prisma.document.update({
            where: { id },
            data: { extractionStatus: "PROCESSING", extractionError: null }
        });

        try {
            const buffer = await getFileBuffer(document.r2key);
            const text = await ExtractText(buffer, document.mimetype);

            const updated = await prisma.document.update({
                where: { id },
                data: { extractedText: text, extractionStatus: "EXTRACTED", extractionError: null }
            });

            return NextResponse.json({ status: updated.extractedStatus, textLength: text.length });
        } catch (extractError) {
            const message = extractError instanceof Error ? extractError.message : "Unknown extraction error";

            await prisma.document.update({
                where: { id },
                data: { extractionStatus: "FAILED", extractionError: message }
            });

            console.log("[extract failed]", { documentId: id, error: message });
            return NextResponse.json({ error: "Extraction failed", detail: message }, { status: 422 });
        }
    } catch (error) {
        console.log("[POST /api/documents/[id]/extract]", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}