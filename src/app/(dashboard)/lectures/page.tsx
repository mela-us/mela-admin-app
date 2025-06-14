import LectureList from "@/components/lectures/lecture-list"
import type { Level, Topic, Lecture } from "@/types/lecture"
import { BookOpen } from "lucide-react"

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

// Mock data for lectures
const mockLectures: Lecture[] = [
  {
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
  },
  {
    lectureId: "2",
    levelId: "1",
    topicId: "2",
    name: "Phép cộng trong phạm vi 10",
    ordinalNumber: 2,
    description: "Bài học về phép cộng trong phạm vi 10 cho học sinh lớp 1",
    sections: [
      {
        ordinalNumber: 1,
        name: "Lý thuyết phép cộng",
        content: "",
        url: "https://mela-storage-dev.s3.ap-southeast-1.amazonaws.com/lectures/pdfs/K1_HinhHoc_BieuDo.pdf",
        sectionType: "PDF",
      },
    ],
  },
  {
    lectureId: "3",
    levelId: "2",
    topicId: "1",
    name: "Số và chữ số trong phạm vi 100",
    ordinalNumber: 1,
    description: "Bài học về số và chữ số trong phạm vi 100 cho học sinh lớp 2",
    sections: [
      {
        ordinalNumber: 1,
        name: "Lý thuyết Số và chữ số trong phạm vi 100",
        content: "",
        url: "https://mela-storage-dev.s3.ap-southeast-1.amazonaws.com/lectures/pdfs/K1_HinhHoc_BieuDo.pdf",
        sectionType: "PDF",
      },
    ],
  },
]

async function getLectures(): Promise<Lecture[]> {
  // Sử dụng mock data trực tiếp
  return Promise.resolve(mockLectures)
}

export default async function LecturesPage() {
  const lectures = await getLectures()
  const levels = [{ levelId: "null", name: "Chưa có" }, ...mockLevels]
  const topics = [{ topicId: "null", name: "Chưa có" }, ...mockTopics]

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-green-600 to-teal-600 relative rounded-xl p-8 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-10 z-0"></div>
        <div className="relative z-10">
          <h1 className="text-3xl font-bold mb-2">Quản lý bài học</h1>
          <p className="text-blue-100 max-w-2xl">
            Quản lý các bài học lecture trong hệ thống MELA.
          </p>
        </div>
        <div className="absolute right-0 bottom-0 opacity-20">
          <BookOpen size={180} />
        </div>
      </div>
      <LectureList initialLectures={lectures} levels={levels} topics={topics} />
    </div>
  )
}
