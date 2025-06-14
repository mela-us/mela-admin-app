"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { X, Plus, Trash2, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { MathEditor } from "./math-editor"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

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

type QuestionDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  question?: Question | null
  onSave: (question: Question) => void
  maxOrdinalNumber: number
}

type UploadedImage = {
  id: string
  file: File
  status: "pending" | "uploading" | "success" | "error"
  progress: number
  url?: string
  blobUrl?: string
  error?: string
}

export function QuestionDialog({ open, onOpenChange, question, onSave, maxOrdinalNumber }: QuestionDialogProps) {
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([])
  const [formData, setFormData] = useState<Question>({
    id: "",
    ordinalNumber: 1,
    content: "",
    questionType: "MULTIPLE_CHOICE",
    options: [
      { ordinalNumber: 1, content: "", isCorrect: true },
      { ordinalNumber: 2, content: "", isCorrect: false },
      { ordinalNumber: 3, content: "", isCorrect: false },
      { ordinalNumber: 4, content: "", isCorrect: false },
    ],
    blankAnswer: null,
    solution: "",
    guide: "",
    terms: [],
  })
  const [newTerm, setNewTerm] = useState("")
  const [activeTab, setActiveTab] = useState("content")

  useEffect(() => {
    setActiveTab("content")
    if (open && question) {
      setFormData(question)
    } else if (open) {
      // Reset form for new question
      setFormData({
        id: crypto.randomUUID(),
        ordinalNumber: maxOrdinalNumber + 1,
        content: "",
        questionType: "MULTIPLE_CHOICE",
        options: [
          { ordinalNumber: 1, content: "", isCorrect: true },
          { ordinalNumber: 2, content: "", isCorrect: false },
          { ordinalNumber: 3, content: "", isCorrect: false },
          { ordinalNumber: 4, content: "", isCorrect: false },
        ],
        blankAnswer: null,
        solution: "",
        guide: "",
        terms: [],
      })
    }
  }, [open, question, maxOrdinalNumber])

  const handleContentChange = (content: string) => {
    setFormData({ ...formData, content })
  }

  const handleSolutionChange = (solution: string) => {
    setFormData({ ...formData, solution })
  }

  const handleQuestionTypeChange = (type: QuestionType) => {
    if (type === formData.questionType) return

    if (type === "MULTIPLE_CHOICE") {
      setFormData({
        ...formData,
        questionType: type,
        options: [
          { ordinalNumber: 1, content: "", isCorrect: true },
          { ordinalNumber: 2, content: "", isCorrect: false },
          { ordinalNumber: 3, content: "", isCorrect: false },
          { ordinalNumber: 4, content: "", isCorrect: false },
        ],
        blankAnswer: null,
      })
    } else {
      setFormData({
        ...formData,
        questionType: type,
        options: [],
        blankAnswer: "",
      })
    }
  }

  const handleOptionContentChange = (ordinalNumber: number, content: string) => {
    const updatedOptions = formData.options.map((option) => (option.ordinalNumber === ordinalNumber ? { ...option, content } : option))
    setFormData({ ...formData, options: updatedOptions })
  }

  const handleCorrectOptionChange = (ordinalNumberStr: string) => {
    const ordinalNumber = Number(ordinalNumberStr); // Convert string to number
    const updatedOptions = formData.options.map((option) => ({
      ...option,
      isCorrect: option.ordinalNumber === ordinalNumber,
    }));
    setFormData({ ...formData, options: updatedOptions });
  };

  const handleBlankAnswerChange = (blankAnswer: string) => {
    setFormData({ ...formData, blankAnswer })
  }

  const handleGuideChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, guide: e.target.value })
  }

  const addOption = () => {
    const newOrdinalNumber = formData.options.length + 1

    setFormData({
      ...formData,
      options: [...formData.options, { ordinalNumber: newOrdinalNumber, content: "", isCorrect: false }],
    })
  }

  const removeOption = (ordinalNumber: number) => {
    // Don't allow removing if there are only 2 options
    if (formData.options.length <= 2) return

    // If removing the correct option, make the first remaining option correct
    const needNewCorrect = formData.options.find((o) => o.ordinalNumber === ordinalNumber)?.isCorrect

    const filteredOptions = formData.options.filter((option) => option.ordinalNumber !== ordinalNumber)

    // Reorder ordinal numbers
    const updatedOptions = filteredOptions.map((option, index) => ({
      ...option,
      ordinalNumber: index + 1,
      isCorrect: needNewCorrect && index === 0 ? true : option.isCorrect,
    }))

    setFormData({ ...formData, options: updatedOptions })
  }

  const addTerm = () => {
    if (!newTerm.trim()) return

    if (!formData.terms.includes(newTerm.trim())) {
      setFormData({
        ...formData,
        terms: [...formData.terms, newTerm.trim()],
      })
    }

    setNewTerm("")
  }

  const removeTerm = (term: string) => {
    setFormData({
      ...formData,
      terms: formData.terms.filter((t) => t !== term),
    })
  }

  const handleSave = () => {
    onSave(formData)
    onOpenChange(false)
  }

  return (
    <TooltipProvider>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-5xl h-[90vh] overflow-y-auto">
          <DialogHeader className="border-b pb-4 border-gray-300">
            <DialogTitle className="text-2xl font-semibold text-gray-800">
              {question ? "Chỉnh sửa câu hỏi" : "Thêm câu hỏi mới"}
            </DialogTitle>
            <DialogDescription className="mt-1 text-sm text-gray-500">
              Vui lòng nhập thông tin chi tiết cho câu hỏi bên dưới.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            <div className="grid grid-cols-4 gap-4">
              <div className="col-span-1">
                <Label htmlFor="ordinalNumber" className="font-medium">Số thứ tự</Label>
                <Select
                  value={formData.ordinalNumber.toString()}
                  onValueChange={(value) => setFormData({ ...formData, ordinalNumber: Number.parseInt(value) })}
                >
                  <SelectTrigger id="ordinalNumber" className="mt-1">
                    <SelectValue placeholder="Chọn thứ tự" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: maxOrdinalNumber + 1 }, (_, i) => i + 1).map((num) => (
                      <SelectItem key={num} value={num.toString()}>
                        {num}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="col-span-3">
                <Label htmlFor="questionType" className="font-medium">Loại câu hỏi</Label>
                <Select
                  value={formData.questionType}
                  onValueChange={(value) => handleQuestionTypeChange(value as QuestionType)}
                >
                  <SelectTrigger id="questionType" className="mt-1">
                    <SelectValue placeholder="Chọn loại câu hỏi" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="MULTIPLE_CHOICE">Trắc nghiệm</SelectItem>
                    <SelectItem value="FILL_IN_THE_BLANK">Điền khuyết</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid grid-cols-4 w-full bg-neutral-100 rounded-lg p-1">
                <TabsTrigger
                  value="content"
                  className="data-[state=active]:bg-violet-300/70 data-[state=active]:shadow rounded-md"
                >
                  Nội dung
                </TabsTrigger>
                <TabsTrigger
                  value="answer"
                  className="data-[state=active]:bg-violet-300/70 data-[state=active]:shadow rounded-md"
                >
                  Đáp án
                </TabsTrigger>
                <TabsTrigger
                  value="solution"
                  className="data-[state=active]:bg-violet-300/70 data-[state=active]:shadow rounded-md"
                >
                  Lời giải
                </TabsTrigger>
                <TabsTrigger
                  value="metadata"
                  className="data-[state=active]:bg-violet-300/70 data-[state=active]:shadow rounded-md"
                >
                  Bổ sung
                </TabsTrigger>
              </TabsList>

              <div className="mt-4 min-h-[35vh]">
                <TabsContent value="content" className="mt-0">
                  <div className="space-y-2">
                    <Label className="font-medium">Nội dung câu hỏi</Label>
                    <MathEditor
                      value={formData.content}
                      onChange={handleContentChange}
                      uploadedImages={uploadedImages}
                      setUploadedImages={setUploadedImages}
                      placeholder="Nhập nội dung câu hỏi..."
                      height="h-80"
                    />
                  </div>
                </TabsContent>

                <TabsContent value="answer" className="mt-0 min-h-[35vh]">
                  {formData.questionType === "MULTIPLE_CHOICE" ? (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between mb-2">
                        <Label className="font-medium">Các phương án trả lời</Label>
                        <Button type="button" variant="outline" size="sm" onClick={addOption} className="border-indigo-300 text-blue-500 hover:bg-blue-50 hover:text-blue-500">
                          <Plus className="h-4 w-4" />
                          Thêm lựa chọn
                        </Button>
                      </div>

                      <RadioGroup
                        value={formData.options.find((o) => o.isCorrect)?.ordinalNumber.toString() || ""}
                        onValueChange={handleCorrectOptionChange}
                        className="space-y-4"
                      >
                        {formData.options.map((option) => (
                          <div
                            key={option.ordinalNumber}
                            className="flex space-x-3 bg-gray-100 p-3 rounded-lg border"
                          >
                            {/* Radio */}
                            <RadioGroupItem
                              value={option.ordinalNumber.toString()}
                              id={`option-${option.ordinalNumber}`}
                              className="mt-2"
                            />

                            {/* Nội dung chính */}
                            <div className="flex-1 space-y-2">
                              {/* Dòng tiêu đề + badge + trash */}
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                  <Label
                                    htmlFor={`option-${option.ordinalNumber}`}
                                    className="text-sm font-medium"
                                  >
                                    Lựa chọn {option.ordinalNumber}
                                  </Label>
                                  {option.isCorrect && (
                                    <Badge className="bg-green-300 text-green-800 hover:bg-green-200">
                                      Đáp án
                                    </Badge>
                                  )}
                                </div>

                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => removeOption(option.ordinalNumber)}
                                  disabled={formData.options.length <= 2}
                                  className="h-8 w-8 rounded-full hover:bg-red-200 hover:text-red-700 text-red-500"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>

                              {/* Math editor bên dưới */}
                              <MathEditor
                                uploadedImages={uploadedImages}
                                setUploadedImages={setUploadedImages}
                                value={option.content}
                                onChange={(content) =>
                                  handleOptionContentChange(option.ordinalNumber, content)
                                }
                                placeholder={`Nhập nội dung phương án ${option.ordinalNumber}...`}
                                height="h-48"
                              />
                            </div>
                          </div>
                        ))}
                      </RadioGroup>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="flex items-center mb-2">
                        <Label htmlFor="blankAnswer" className="text-base font-medium">Đáp án điền khuyết</Label>
                      </div>
                      <Input
                        id="blankAnswer"
                        value={formData.blankAnswer || ""}
                        onChange={(e) => handleBlankAnswerChange(e.target.value)}
                        placeholder="Nhập đáp án..."
                        className="h-12"
                      />
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="solution" className="mt-0 min-h-[35vh]">
                  <div className="space-y-2">
                    <Label className="font-medium">Lời giải chi tiết</Label>
                    <MathEditor
                      uploadedImages={uploadedImages}
                      setUploadedImages={setUploadedImages}
                      value={formData.solution}
                      onChange={handleSolutionChange}
                      placeholder="Nhập lời giải chi tiết..."
                      height="h-80"
                    />
                  </div>
                </TabsContent>

                <TabsContent value="metadata" className="mt-0 min-h-[35vh]">
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="guide" className="font-medium">Gợi ý</Label>
                      <Input
                        id="guide"
                        value={formData.guide}
                        onChange={handleGuideChange}
                        placeholder="Nhập gợi ý cho câu hỏi..."
                        className="h-12"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="font-medium">Thuật ngữ liên quan</Label>
                      <div className="flex space-x-2">
                        <Input
                          value={newTerm}
                          onChange={(e) => setNewTerm(e.target.value)}
                          placeholder="Nhập thuật ngữ..."
                          className="h-12"
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault()
                              addTerm()
                            }
                          }}
                        />
                        <Button
                          type="button"
                          onClick={addTerm}
                          variant="secondary"
                          className="h-12 bg-blue-50 text-blue-600 hover:bg-blue-100 border border-blue-200"
                        >
                          Thêm
                        </Button>
                      </div>

                      <div className="flex flex-wrap gap-2 mt-4 p-4 bg-gray-100 rounded-lg border">
                        {formData.terms.map((term) => (
                          <Badge
                            key={term}
                            variant="secondary"
                            className="flex items-center gap-1 px-3 py-1.5 bg-violet-200 text-violet-700 border border-violet-400 hover:bg-violet-300"
                          >
                            {term}
                            <X
                              className="h-3 w-3 cursor-pointer ml-1 hover:text-red-500"
                              onClick={() => removeTerm(term)}
                            />
                          </Badge>
                        ))}
                        {formData.terms.length === 0 && (
                          <span className="text-sm text-muted-foreground flex items-center justify-center w-full h-7">
                            Chưa có thuật ngữ nào
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </div>
            </Tabs>
          </div>

          <DialogFooter className="border-t pt-4 border-gray-300 gap-2">
            <Button variant="outline" className="border-gray-500/50" onClick={() => onOpenChange(false)}>
              Hủy
            </Button>
            <Button onClick={handleSave} className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700">
              {question ? "Cập nhật câu hỏi" : "Lưu câu hỏi"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </TooltipProvider>
  )
}
