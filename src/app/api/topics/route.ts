import { fetchWithAuth } from "@/app/lib/helpers";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const data = await request.json();

  if (!data.name || !data.imageUrl) {
    return NextResponse.json(
      { error: "Tên và hình ảnh là bắt buộc" },
      { status: 400 }
    );
  }

  const newTopic = {
    topicId: Date.now().toString(),
    name: data.name,
    imageUrl: data.imageUrl
  };

  // In a real app, we would save this to a database
  // For now, we'll just return the new topic
  // fetchWithAuth

  return NextResponse.json({ topic: newTopic });
}
