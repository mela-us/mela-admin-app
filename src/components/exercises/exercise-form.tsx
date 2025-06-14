"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChevronLeft, Save, Loader2, X, Plus, Trash2, Edit, ArrowUp, ArrowDown, CirclePlus } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge"
import { QuestionDialog } from "./question-dialog"
import { useToast } from "@/components/ui/use-toast"

type Lecture = {
  id: string
  name: string
}

type QuestionType = "MULTIPLE_CHOICE" | "FILL_IN_THE_BLANK"

type Option = {
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

interface Props {
  mode: "add" | "edit"
  initialData?: Exercise
  lectures: Lecture[]
}

export function ExerciseForm({ mode, initialData, lectures }: Props) {
  const router = useRouter()
  const [selectLectures, setSelectLecture] = useState<Lecture[]>(lectures)
  const [formData, setFormData] = useState<Exercise>({
    name: "",
    ordinalNumber: 1,
    lectureId: "",
    questions: [],
  })
  const [originalFormData, setOriginalFormData] = useState<Exercise | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isExitDialogOpen, setIsExitDialogOpen] = useState(false)
  const [isQuestionDialogOpen, setIsQuestionDialogOpen] = useState(false)
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null)

  // Initialize form data
  useEffect(() => {
    if (mode === "edit" && initialData) {
      const data = {
        id: initialData.id,
        name: initialData.name,
        ordinalNumber: initialData.ordinalNumber,
        lectureId: initialData.lectureId,
        questions: initialData.questions.map((q) => ({ ...q })),
      }
      setFormData(data)
      setOriginalFormData(JSON.parse(JSON.stringify(data)))
    } else {
      resetForm()
    }
  }, [mode, initialData])

  const resetForm = () => {
    if (mode === "edit" && originalFormData) {
      setFormData(JSON.parse(JSON.stringify(originalFormData)))
    } else {
      setFormData({
        name: "",
        ordinalNumber: 1,
        lectureId: "",
        questions: [],
      })
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: name === "ordinalNumber" ? parseInt(value) || 1 : value,
    })
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleAddQuestion = () => {
    setCurrentQuestion(null)
    setIsQuestionDialogOpen(true)
  }

  const handleEditQuestion = (question: Question) => {
    setCurrentQuestion(question)
    setIsQuestionDialogOpen(true)
  }

  const handleSaveQuestion = (question: Question) => {
    let updatedQuestions: Question[]
    if (currentQuestion) {
      // Edit existing question
      updatedQuestions = formData.questions.map((q) => (q.id === question.id ? question : q))
    } else {
      // Add new question
      updatedQuestions = [...formData.questions, question]
    }

    // Reorder questions
    updatedQuestions = updatedQuestions
      .sort((a, b) => a.ordinalNumber - b.ordinalNumber)
      .map((q, index) => ({ ...q, ordinalNumber: index + 1 }))

    setFormData({ ...formData, questions: updatedQuestions })
    setIsQuestionDialogOpen(false)
  }

  const handleDeleteQuestion = (id: string) => {
    const updatedQuestions = formData.questions
      .filter((q) => q.id !== id)
      .map((q, index) => ({ ...q, ordinalNumber: index + 1 }))
    setFormData({ ...formData, questions: updatedQuestions })
  }

  const handleMoveQuestion = (id: string, direction: "up" | "down") => {
    const index = formData.questions.findIndex((q) => q.id === id)
    if (direction === "up" && index === 0) return
    if (direction === "down" && index === formData.questions.length - 1) return

    const newIndex = direction === "up" ? index - 1 : index + 1
    const updatedQuestions = [...formData.questions]
    const [movedQuestion] = updatedQuestions.splice(index, 1)
    updatedQuestions.splice(newIndex, 0, movedQuestion)

    // Update ordinal numbers
    const reorderedQuestions = updatedQuestions.map((q, i) => ({
      ...q,
      ordinalNumber: i + 1,
    }))

    setFormData({ ...formData, questions: reorderedQuestions })
  }

  const validateForm = () => {
    if (!formData.name.trim()) {
      toast({
        title: "Lỗi",
        description: "Vui lòng nhập tên bài luyện tập",
        variant: "error",
      })
      return false
    }

    if (!formData.lectureId) {
      toast({
        title: "Lỗi",
        description: "Vui lòng chọn bài học",
        variant: "error",
      })
      return false
    }

    if (formData.questions.length === 0) {
      toast({
        title: "Lỗi",
        description: "Vui lòng thêm ít nhất một câu hỏi",
        variant: "error",
      })
      return false
    }

    for (const question of formData.questions) {
      if (!question.content.trim()) {
        toast({
          title: "Lỗi",
          description: `Vui lòng nhập nội dung cho câu hỏi số ${question.ordinalNumber}`,
          variant: "error",
        })
        return false
      }
      if (question.questionType === "MULTIPLE_CHOICE" && question.options.length < 2) {
        toast({
          title: "Lỗi",
          description: `Câu hỏi số ${question.ordinalNumber} cần ít nhất 2 đáp án`,
          variant: "error",
        })
        return false
      }
      if (question.questionType === "FILL_IN_THE_BLANK" && !question.blankAnswer?.trim()) {
        toast({
          title: "Lỗi",
          description: `Vui lòng nhập đáp án cho câu hỏi số ${question.ordinalNumber}`,
          variant: "error",
        })
        return false
      }
    }

    return true
  }

  const handleSubmit = async () => {
    if (!validateForm()) return

    setIsSubmitting(true)
    try {
      const url = mode === "add" ? "/api/exercises" : `/api/exercises/${initialData?.id}`
      const method = mode === "add" ? "POST" : "PUT"

      // Mock API call
      console.log(`${mode === "add" ? "Creating" : "Updating"} exercise:`, formData)
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })
      if (!response.ok) {
        throw new Error("Có lỗi xảy ra khi thao tác")
      }

      toast({
        title: "Thành công",
        description: mode === "add" ? "Đã thêm bài luyện tập mới" : "Đã cập nhật bài luyện tập",
        variant: "success",
      })

      router.push("/exercises")
      router.refresh()
    } catch (error) {
      console.error(`Error ${mode === "add" ? "adding" : "updating"} exercise:`, error)
      toast({
        title: "Lỗi",
        description: `Không thể ${mode === "add" ? "thêm" : "cập nhật"} bài luyện tập`,
        variant: "error",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleExit = () => {
    const hasChanges =
      mode === "edit"
        ? JSON.stringify(formData) !== JSON.stringify(originalFormData)
        : formData.name || formData.lectureId || formData.questions.length > 0

    if (hasChanges) {
      setIsExitDialogOpen(true)
    } else {
      router.push("/exercises")
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-10">
        <Button
          onClick={handleExit}
          size="sm"
          variant="ghost"
          className="group flex items-center gap-1 border border-indigo-300 bg-white hover:bg-indigo-50 text-indigo-600 px-3 py-1 rounded-md transition-all"
        >
          <ChevronLeft className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform duration-200" />
        </Button>
        <h2 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-indigo-700 to-blue-500 bg-clip-text text-transparent ml-2">
          {mode === "add" ? "Thêm bài luyện tập mới" : "Chỉnh sửa bài luyện tập"}
        </h2>
      </div>

      {/* Form */}
      <div className="space-y-8">
        <Card className="border-indigo-200 shadow-lg bg-gradient-to-b from-white to-indigo-50/20">
          <CardHeader className="bg-indigo-200/50 border-b border-indigo-200">
            <CardTitle className="text-xl font-bold text-gray-700/90">Thông tin bài luyện tập</CardTitle>
            <CardDescription className="text-gray-700/80">
              {mode === "add" ? "Nhập thông tin cơ bản của bài luyện tập" : "Chỉnh sửa thông tin bài luyện tập"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
            <div className="grid gap-2">
              <Label htmlFor="name" className="text-sm font-semibold text-indigo-900">
                Tên bài luyện tập
              </Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Nhập tên bài luyện tập"
                className="border-indigo-300 bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 rounded-md px-4 py-2 text-indigo-900 placeholder-indigo-400/70 transition-all duration-200"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="lectureId" className="text-sm font-semibold text-indigo-900">
                  Bài học
                </Label>
                <Select
                  value={formData.lectureId}
                  onValueChange={(value) => handleSelectChange("lectureId", value)}
                >
                  <SelectTrigger
                    id="lectureId"
                    className="border-indigo-300 bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 rounded-md text-indigo-900"
                  >
                    <SelectValue placeholder="Chọn bài học" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-indigo-200">
                    {selectLectures.map((lecture) => (
                      <SelectItem
                        key={lecture.id}
                        value={lecture.id}
                        className="text-indigo-900 hover:bg-indigo-50"
                      >
                        {lecture.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="ordinalNumber" className="text-sm font-semibold text-indigo-900">
                  Thứ tự
                </Label>
                <Input
                  id="ordinalNumber"
                  name="ordinalNumber"
                  type="number"
                  min="1"
                  value={formData.ordinalNumber}
                  onChange={handleInputChange}
                  className="border-indigo-300 bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 rounded-md px-4 py-2 text-indigo-900 placeholder-indigo-400/70 transition-all duration-200"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-indigo-200 shadow-lg bg-gradient-to-b from-white to-indigo-50/20">
          <CardHeader className="bg-indigo-200/50 border-b border-indigo-200 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-xl font-bold text-gray-700/90">Danh sách câu hỏi</CardTitle>
              <CardDescription className="text-gray-700/80">
                Thêm và quản lý các câu hỏi trong bài luyện tập
              </CardDescription>
            </div>
            <Button
              type="button"
              onClick={handleAddQuestion}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-4 py-2 rounded-md shadow transition-all duration-200"
            >
              <CirclePlus className="h-4 w-4 mr-2" />
              Thêm câu hỏi
            </Button>
          </CardHeader>
          <CardContent className="pt-6">
            {formData.questions.length === 0 ? (
              <p className="text-indigo-600/70 text-sm">Chưa có câu hỏi nào. Nhấn "Thêm câu hỏi" để bắt đầu.</p>
            ) : (
              <div className="space-y-4">
                {formData.questions.map((question) => (
                  <Card
                    key={question.id}
                    className="border-indigo-200 bg-white shadow-sm hover:shadow-md transition-shadow"
                  >
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 py-3">
                      <div className="flex items-center">
                        <Badge className="mr-2 bg-indigo-500 hover:bg-indigo-600">
                          Câu {question.ordinalNumber}
                        </Badge>
                        <Badge
                          variant="outline"
                          className="border-indigo-300 text-indigo-700 hover:bg-indigo-50"
                        >
                          {question.questionType === "MULTIPLE_CHOICE" ? "Trắc nghiệm" : "Điền khuyết"}
                        </Badge>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => handleMoveQuestion(question.id, "up")}
                          disabled={question.ordinalNumber === 1}
                          className="h-8 w-8 text-indigo-600 hover:bg-indigo-50"
                        >
                          <ArrowUp className="h-4 w-4" />
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => handleMoveQuestion(question.id, "down")}
                          disabled={question.ordinalNumber === formData.questions.length}
                          className="h-8 w-8 text-indigo-600 hover:bg-indigo-50"
                        >
                          <ArrowDown className="h-4 w-4" />
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEditQuestion(question)}
                          className="h-8 w-8 text-indigo-600 hover:bg-indigo-50"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent className="rounded-lg">
                            <AlertDialogHeader>
                              <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
                              <AlertDialogDescription>
                                Bạn có chắc chắn muốn xóa câu hỏi này? Hành động này không thể hoàn tác.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel className="hover:bg-gray-100">Hủy</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDeleteQuestion(question.id)}
                                className="bg-red-600 hover:bg-red-700 text-white"
                              >
                                Xóa
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0 pb-3">
                      <div className="text-sm border-l-4 border-indigo-200 pl-3 py-1 mt-1 text-indigo-900">
                        {question.content ? (
                          question.content.length > 70
                            ? question.content.substring(0, 70) + "..."
                            : question.content
                        ) : (
                          <span className="italic text-gray-400">Hãy thêm nội dung câu hỏi...</span>
                        )}
                      </div>
                      {question.questionType === "MULTIPLE_CHOICE" && (
                        <div className="mt-3 grid grid-cols-2 gap-2">
                          {question.options.map((option) => (
                            <div
                              key={option.ordinalNumber}
                              className={`flex items-center rounded-md border p-2 text-xs ${option.isCorrect
                                ? "border-green-200 bg-green-50 text-green-700"
                                : "border-gray-200 bg-gray-50 text-gray-700"
                                }`}
                            >
                              <span className="font-medium">
                                {option.ordinalNumber}.
                                {option.isCorrect && <span className="ml-1 text-green-600">✓</span>}
                              </span>
                              <span className="ml-1 truncate">
                                {option.content.length > 50 ? `${option.content.substring(0, 50)}...` : option.content}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                      {question.questionType === "FILL_IN_THE_BLANK" && (
                        <div className="mt-3 grid grid-cols-1 gap-2">
                          <span
                            className={`flex items-center rounded-md border p-2 text-xs border-green-200 bg-green-50 ${question.blankAnswer ? "bg-indigo-100 text-green-700" : "bg-gray-100 italic text-gray-500"
                              }`}
                          >
                            <span className="font-medium">
                              {question.blankAnswer && <span className="ml-1 mr-2 text-green-600">✓</span>}
                            </span>
                            {question.blankAnswer
                              ? question.blankAnswer.length > 70
                                ? `${question.blankAnswer.substring(0, 70)}...`
                                : question.blankAnswer
                              : "Hãy thêm đáp án"}
                          </span>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <div className="flex justify-end gap-3 mt-6">
          <Button
            type="button"
            variant="outline"
            onClick={handleExit}
            className="px-5 py-2 border-2 border-gray-300 hover:bg-gray-100 transition-colors duration-200 font-medium rounded-lg focus:ring-2 focus:ring-gray-300 focus:ring-offset-2"
          >
            <X className="mr-2 h-4 w-4" />
            Hủy
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className={`px-5 py-2 rounded-lg font-medium shadow-md transition-all duration-200
              ${isSubmitting ? "bg-indigo-500" : "bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700"}
              text-white focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-80`}
          >
            {isSubmitting ? (
              <div className="flex items-center">
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                <span>Đang lưu...</span>
              </div>
            ) : (
              <div className="flex items-center">
                <Save className="mr-2 h-5 w-5" />
                <span>{mode === "add" ? "Lưu bài luyện tập" : "Lưu thay đổi"}</span>
              </div>
            )}
          </Button>
        </div>
      </div>

      <QuestionDialog
        open={isQuestionDialogOpen}
        onOpenChange={setIsQuestionDialogOpen}
        question={currentQuestion}
        onSave={handleSaveQuestion}
        maxOrdinalNumber={formData.questions.length}
      />

      <AlertDialog open={isExitDialogOpen} onOpenChange={setIsExitDialogOpen}>
        <AlertDialogContent className="rounded-lg">
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận hủy</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn hủy? {mode === "add" ? "Tất cả thông tin đã nhập" : "Tất cả thay đổi"} sẽ bị mất và
              không thể khôi phục.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="hover:bg-gray-100">Tiếp tục chỉnh sửa</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                resetForm()
                router.push("/exercises")
              }}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Hủy và thoát
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
