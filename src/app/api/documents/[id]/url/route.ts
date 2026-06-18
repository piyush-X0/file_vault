import { NextRequest, NextResponse } from "next/server";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { prisma } from '@/lib/prisma';
import { r2Client, BUCKET_NAME } from "@/lib/r2";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const mode = req.nextUrl.searchParams.get("mode") // view || download

        if (!id) {
            return NextResponse.json({ error: " Document ID is Required " }, { status: 400 });
        }
        const documents = await prisma.document.findUnique({
            where: { id },
            select: { id: true, filename: true, mimetype: true, r2key: true, }
        })
        if (!documents) {
            return NextResponse.json({ error: "Document is not found" }, { status: 404 });
        }
        const command = new GetObjectCommand({
            Bucket: BUCKET_NAME,
            Key: documents.r2key,
            ResponseContentDisposition: mode === "download"
                ? `attachments ; filename="${documents.filename}"`
                : `inline ; filename="${documents.filename}"`,
            ResponseContentType: documents.mimetype
        });
        const presignedUrl = await getSignedUrl(r2Client, command, { expiresIn: 3600 }); // 1 hour
        return NextResponse.json({ url: presignedUrl });

    } catch (error) {
        console.log("GET api/documents/[url]/url ]", error);
        return NextResponse.json({ error: "Failed to generate URL" }, { status: 500 });
    }
}