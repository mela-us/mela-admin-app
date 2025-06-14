import type { Level, Topic } from "@/types/lecture"
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

export default function AddLecturePage() {
  const levels = [{ levelId: "null", name: "Chưa có" }, ...mockLevels]
  const topics = [{ topicId: "null", name: "Chưa có" }, ...mockTopics]

  return <LectureForm mode="add" levels={levels} topics={topics} />
}
