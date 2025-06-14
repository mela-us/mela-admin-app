import { Suspense } from "react"
import { ExerciseList } from "@/components/exercises/exercise-list"
import { BookOpen } from "lucide-react"

// Mock function to get lectures (would be replaced with actual API call)
async function getLectures() {
  // In a real app, this would be an API call
  return [
    { id: "1", name: "Phép cộng trong phạm vi 10" },
    { id: "2", name: "Phép trừ trong phạm vi 10" },
    { id: "3", name: "Hình học cơ bản" },
    { id: "4", name: "Phân số" },
    { id: "5", name: "Đại lượng đo lường" },
  ]
}

async function getExercises() {
  return [
    {
      id: "1",
      name: "Phép cộng trong phạm vi 5",
      ordinalNumber: 1,
      lectureId: "1",
      questionCount: 5,
    },
    {
      id: "2",
      name: "Phép cộng trong phạm vi 10",
      ordinalNumber: 2,
      lectureId: "1",
      questionCount: 8,
    },
    {
      id: "3",
      name: "Phép trừ đơn giản",
      ordinalNumber: 1,
      lectureId: "2",
      questionCount: 6,
    },
    {
      id: "4",
      name: "Hình tam giác",
      ordinalNumber: 1,
      lectureId: "3",
      questionCount: 4,
    },
    {
      id: "5",
      name: "Hình tứ giác",
      ordinalNumber: 2,
      lectureId: "3",
      questionCount: 7,
    },
  ]
}

export default async function ExercisesPage() {
  const lectures = await getLectures()
  const exercises = await getExercises()

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-green-600 to-teal-600 relative rounded-xl p-8 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-10 z-0"></div>
        <div className="relative z-10">
          <h1 className="text-3xl font-bold mb-2">Quản lý bài luyện tập</h1>
          <p className="text-blue-100 max-w-2xl">
            Quản lý các luyện tập exercise trong hệ thống MELA.
          </p>
        </div>
        <div className="absolute right-0 bottom-0 opacity-20">
          <BookOpen size={180} />
        </div>
      </div>

      <ExerciseList initialLectures={lectures} initialExercises={exercises} />
    </div>
  )
}
