import { readFileSync } from "fs";
import { join } from "path";
import { NextResponse } from "next/server";

export async function GET() {
  const filePath = join(process.cwd(), "public", "resume", "Shyam_resume.pdf");
  const fileBuffer = readFileSync(filePath);

  return new NextResponse(fileBuffer, {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": 'inline; filename="Shyam_resume.pdf"',
      "Content-Length": fileBuffer.byteLength.toString(),
      "Cache-Control": "public, max-age=3600",
    },
  });
}
