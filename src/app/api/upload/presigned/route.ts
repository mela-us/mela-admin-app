import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { fileName, contentType } = await request.json();

    // Trong thực tế, bạn sẽ gọi API để lấy presigned URL từ S3 hoặc dịch vụ lưu trữ khác
    // Ở đây chúng ta giả lập
    console.log(`Generating presigned URL for ${fileName} (${contentType})`);

    // Giả lập presigned URL và file URL
    const presignedUrl = `https://presigned-url.example.com/${fileName}`;
    const fileUrl = `https://mela-storage-dev.s3.ap-southeast-1.amazonaws.com/lectures/pdfs/K1_HinhHoc_BieuDo.pdf`;

    return NextResponse.json({ presignedUrl, fileUrl });
  } catch (error) {
    console.error("Error generating presigned URL:", error);
    return NextResponse.json(
      { error: "Failed to generate presigned URL" },
      { status: 500 }
    );
  }
}
