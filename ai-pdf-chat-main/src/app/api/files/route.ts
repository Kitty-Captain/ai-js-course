import { NextResponse } from "next/server";
import pdf from "@cyber2024/pdf-parse-fixed";
import { createOrReadVectorStoreIndex } from "@/lib/vector-store";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const fileContents = await file.arrayBuffer();
    const parsedPdf = await pdf(Buffer.from(fileContents)); // Currently pdf-parser doesn't work. Need to find a workaround

    await createOrReadVectorStoreIndex(parsedPdf.text);

    return NextResponse.json(
      {
        message: "File Uploaded",
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.log('error', error);
    return NextResponse.json(
      {
        message: error.message,
      },
      {
        status: 500,
      }
    );
  }
}
