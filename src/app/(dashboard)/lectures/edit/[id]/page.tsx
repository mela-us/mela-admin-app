import type { Level, Topic, Lecture } from "@/types/lecture"
import LectureForm from "@/components/lectures/lecture-form"

// Mock data for levels and topics
const mockLevels: Level[] = [
  { levelId: "1", name: "Lớp 1" },
  { levelId: "2", name: "Lớp 2" },
  { levelId: "3", name: "Lớp 3" },
  { levelId: "4", name: "Lớp 4" },
  { levelId: "5", name: "Lớp 5" },
]

const mockTopics: Topic[] = [
  { topicId: "1", name: "Số học" },
  { topicId: "2", name: "Đại số" },
  { topicId: "3", name: "Hình học" },
  { topicId: "4", name: "Xác suất thống kê" },
  { topicId: "5", name: "Giải tích" },
]

async function getLecture(id: string): Promise<Lecture> {
  // In a real app, we would fetch from an API
  // For now, we'll use the API route we created
  // const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/lectures/${id}`, {
  //   cache: "no-store",
  // })

  // if (!res.ok) {
  //   throw new Error("Failed to fetch lecture")
  // }

  // return res.json()
  return {
    lectureId: "1",
    levelId: "1",
    topicId: "1",
    name: "Số và chữ số",
    ordinalNumber: 1,
    description: "Bài học về số và chữ số cho học sinh lớp 1",
    sections: [
      {
        ordinalNumber: 1,
        name: "Lý thuyết Số và chữ số",
        content: "",
        url: "https://mela-storage-dev.s3.ap-southeast-1.amazonaws.com/lectures/pdfs/K1_HinhHoc_BieuDo.pdf",
        sectionType: "PDF",
      },
    ],
  }
}

export default async function EditLecturePage({ params }: { params: { id: string } }) {
  const { id } = await params

  let lecture: Lecture

  try {
    lecture = await getLecture(id)
  } catch (error) {
    throw Error("Không load được lecture")
  }

  const levels = [{ levelId: "null", name: "Chưa có" }, ...mockLevels]
  const topics = [{ topicId: "null", name: "Chưa có" }, ...mockTopics]

  return <LectureForm mode="edit" initialData={lecture} levels={levels} topics={topics} />
}
