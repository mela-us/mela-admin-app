import { ExerciseForm } from "@/components/exercises/exercise-form"

type QuestionType = "MULTIPLE_CHOICE" | "FILL_IN_THE_BLANK"

type Option = {
  id: string
  ordinalNumber: number
  content: string
  isCorrect: boolean
}

type Question = {
  id: string
  ordinalNumber: number
  content: string
  questionType: QuestionType
  options: Option[]
  blankAnswer: string | null
  solution: string
  guide: string
  terms: string[]
}

type Exercise = {
  id?: string
  name: string
  ordinalNumber: number
  lectureId: string
  questions: Question[]
}

async function getLectures() {
  return [
    { id: "1", name: "Phép cộng trong phạm vi 10" },
    { id: "2", name: "Phép trừ trong phạm vi 10" },
    { id: "3", name: "Hình học cơ bản" },
    { id: "4", name: "Phân số" },
    { id: "5", name: "Đại lượng đo lường" },
  ]
}

// Mock function to get exercise by ID
async function getExerciseById(id: string): Promise<Exercise> {
  return {
    id: "1",
    name: "Phép cộng trong phạm vi 5",
    ordinalNumber: 1,
    lectureId: "1",
    questions: [
      {
        id: "101",
        ordinalNumber: 1,
        content: "Tính tổng: 2 + 3 = ?",
        questionType: "MULTIPLE_CHOICE",
        options: [
          { id: "1001", ordinalNumber: 1, content: "4", isCorrect: false },
          { id: "1002", ordinalNumber: 2, content: "5", isCorrect: true },
          { id: "1003", ordinalNumber: 3, content: "6", isCorrect: false },
          { id: "1004", ordinalNumber: 4, content: "7", isCorrect: false },
        ],
        blankAnswer: null,
        solution: "Tổng của 2 và 3 là 5",
        guide: "Đếm từ 2 thêm 3 đơn vị",
        terms: ["phép cộng", "tổng"],
      },
      {
        id: "102",
        ordinalNumber: 2,
        content: "Điền vào chỗ trống: 1 + ... = 4",
        questionType: "FILL_IN_THE_BLANK",
        options: [],
        blankAnswer: "3",
        solution: "1 + 3 = 4",
        guide: "Tìm số cần thêm vào 1 để được 4",
        terms: ["phép cộng", "tổng"],
      },
    ],
  }
}

export default async function EditExercisePage({ params }: { params: { id: string } }) {
  params = await params
  const lectures = await getLectures()
  const exercise = await getExerciseById(params.id)

  return <ExerciseForm mode="edit" lectures={lectures} initialData={exercise} />
}
