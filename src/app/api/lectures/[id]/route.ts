import { NextResponse } from "next/server"

// Mock data for lectures
const mockLectures = [
  {
    _id: "1",
    level_id: "1",
    topic_id: "1",
    name: "Số và chữ số",
    ordinal_number: 1,
    description: "Bài học về số và chữ số cho học sinh lớp 1",
    sections: [
      {
        ordinal_number: 1,
        name: "Lý thuyết Số và chữ số",
        content: "",
        url: "lectures/pdfs/Số và chữ số.pdf",
        section_type: "PDF",
        fileName: "Số và chữ số.pdf",
      },
    ],
  },
  {
    _id: "2",
    level_id: "1",
    topic_id: "2",
    name: "Phép cộng trong phạm vi 10",
    ordinal_number: 2,
    description: "Bài học về phép cộng trong phạm vi 10 cho học sinh lớp 1",
    sections: [
      {
        ordinal_number: 1,
        name: "Lý thuyết phép cộng",
        content: "",
        url: "lectures/pdfs/Phép cộng trong phạm vi 10.pdf",
        section_type: "PDF",
        fileName: "Phép cộng trong phạm vi 10.pdf",
      },
    ],
  },
  {
    _id: "3",
    level_id: "2",
    topic_id: "1",
    name: "Số và chữ số trong phạm vi 100",
    ordinal_number: 1,
    description: "Bài học về số và chữ số trong phạm vi 100 cho học sinh lớp 2",
    sections: [
      {
        ordinal_number: 1,
        name: "Lý thuyết Số và chữ số trong phạm vi 100",
        content: "",
        url: "lectures/pdfs/Số và chữ số trong phạm vi 100.pdf",
        section_type: "PDF",
        fileName: "Số và chữ số trong phạm vi 100.pdf",
      },
    ],
  },
]

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const id = params.id

  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  const lecture = mockLectures.find((lecture) => lecture._id === id)

  if (!lecture) {
    return NextResponse.json({ error: "Lecture not found" }, { status: 404 })
  }

  return NextResponse.json(lecture)
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const id = params.id
  const updatedLecture = await request.json()

  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  // In a real app, we would update the lecture in the database
  // For now, we'll just log it and return a success response
  console.log(`Updating lecture ${id}:`, updatedLecture)

  return NextResponse.json(updatedLecture)
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const id = params.id

  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  // In a real app, we would delete the lecture from the database
  // For now, we'll just log it and return a success response
  console.log(`Deleting lecture ${id}`)

  return NextResponse.json({ success: true })
}
