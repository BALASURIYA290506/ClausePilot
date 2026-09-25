import { NextRequest, NextResponse } from "next/server";
import { extractPdfDocument } from "@/lib/pdf/extractor";

export const dynamic = "force-dynamic";
export const maxDuration = 60; // 60s timeout for large PDF documents

const MAX_ALLOWED_FILE_SIZE = 25 * 1024 * 1024; // 25MB

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { success: false, error: "Please upload a PDF file." },
        { status: 400 }
      );
    }

    if (file.size > MAX_ALLOWED_FILE_SIZE) {
      return NextResponse.json(
        {
          success: false,
          error: "The file exceeds the maximum allowed size limit of 25MB.",
        },
        { status: 400 }
      );
    }

    // Convert file to buffer for page-aware extraction
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const documentData = await extractPdfDocument(buffer, file.name);

    return NextResponse.json({
      success: true,
      data: documentData,
    });
  } catch (err: any) {
    const errorMessage =
      err?.message || "Failed to process the PDF document. Please ensure it is a valid, readable PDF.";
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}
