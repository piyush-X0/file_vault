import { confirmUpload } from "@/lib/confirmupload";
import { NextRequest, NextResponse } from "next/server";


export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {

    try {


        const { id } = await params;

        const result = await confirmUpload(id);

        if (!result.ok) {
            if (result.reason === "NOT_FOUND") {
                return NextResponse.json({ error: "Document not found " }, { status: 404 });
            }
            return NextResponse.json({ error: "Document not exists in storage ", status: "FAILED" }, { status: 422 });
        }

        return NextResponse.json({ status: result.status });
    }

    catch (error) {
        console.log("[POST api/documents/[id]/confirm] ", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}