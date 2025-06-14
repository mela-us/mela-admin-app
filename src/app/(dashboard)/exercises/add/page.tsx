import { ExerciseForm } from "@/components/exercises/exercise-form"

// Mock function to get lectures (would be replaced with actual API call)
async function getLectures() {
  return [
    { id: "1", name: "Phép cộng trong phạm vi 10" },
    { id: "2", name: "Phép trừ trong phạm vi 10" },
    { id: "3", name: "Hình học cơ bản" },
    { id: "4", name: "Phân số" },
    { id: "5", name: "Đại lượng đo lường" },
  ]
}

export default async function AddExercisePage() {
  const lectures = await getLectures()

  return <ExerciseForm mode="add" lectures={lectures} />
}
