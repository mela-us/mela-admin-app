import { type NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    // In a real app, this would create a new exercise in the database
    console.log("POST /api/exercises:\n", JSON.stringify(data, null, 2))

    // Mock response
    return NextResponse.json(
      {
        id: crypto.randomUUID(),
        ...data,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error("Error in POST /api/exercises-improve:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
