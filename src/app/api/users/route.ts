import { NextResponse } from "next/server"

export async function POST(request: Request) {
  const user = await request.json();

  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  // In a real app, we would save the user to the database
  // For now, we'll just log it and return a success response
  console.log("Creating new user:", user);

  // Generate a new ID for the lecture
  const newUser = {
    ...user,
    userId: Date.now().toString(),
  };

  return NextResponse.json(newUser, { status: 201 });
}
