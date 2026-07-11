import { prisma } from "@/lib/prisma";
import { r2Client, BUCKET_NAME } from "@/lib/r2";
import { NextRequest, NextResponse } from "next/server";
import { HeadObjectCommand } from "@aws-sdk/client-s3";


export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;

        const document = await prisma.document.findUnique({
            where: { id },
            select: { id: true, r2key: true, uploadStatus: true }
        });

        if (!document) {
            return NextResponse.json({ error: "Documents not Found !" }, { status: 404 });
        }
        if (document.uploadStatus === "UPLOADED") {
            return NextResponse.json({ status: "UPLOADED" });
        }
        try {
            await r2Client.send(
                new HeadObjectCommand({ Bucket: BUCKET_NAME, Key: document.r2key })
            )
        }
        catch (headerror) {
            await prisma.document.update({
                where: { id },
                data: { uploadStatus: "FAILED" }
            });
            return NextResponse.json(
                { error: "File not found in  storage ", status: "FAILED" },
                { status: 422 })
        }
        const updated = await prisma.document.update({
            where: { id },
            data: { uploadStatus: "UPLOADED" },
        })
        return NextResponse.json({ status: updated.uploadStatus });
    }
    catch (error) {
        console.log("[POST api/documents/[id]/confirm]", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}