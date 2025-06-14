import { NextResponse } from "next/server";

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = await params;
  const data = await request.json();

  if (!data.name) {
    return NextResponse.json(
      { error: "Tên là bắt buộc" },
      { status: 400 }
    );
  }

  // call backend api return updated topic

  const updatedTopic = {
    topicId: id,
    name: data.name,
    imageUrl: data.imageUrl || "http://localhost:3000/assets/placeholder.svg",
  };

  // In a real app, we would update this in a database
  // For now, we'll just return the updated topic
  // fetchWithAuth

  return NextResponse.json({ topic: updatedTopic });
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = await params;

  // Simulate deleting a topic
  // In a real app, we would delete this from a database
  // fetchWithAuth

  return NextResponse.json({ success: true });
}
