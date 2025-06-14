import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

export async function POST(request: Request) {
  try {
    const { filename } = await request.json();

    if (!filename) {
      return NextResponse.json(
        { error: "Tên tệp là bắt buộc" },
        { status: 400 }
      );
    }

    // Generate unique filename to avoid collisions
    const uniqueFilename = `${uuidv4()}-${filename}`;
    // Mock presigned URL and final image URL
    const presignedUrl = `https://mock-s3-presigned-url/${uniqueFilename}`;
    const imageUrl = `http://localhost:3000/assets/placeholder.svg`;
    // https://mock-s3-bucket/${uniqueFilename}

    return NextResponse.json({
      presignedUrl,
      imageUrl,
    });
  } catch (error) {
    console.error("Error generating presigned URL:", error);
    return NextResponse.json(
      { error: "Không thể tạo URL tạm thời" },
      { status: 500 }
    );
  }
}
