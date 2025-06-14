"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Bold,
  Italic,
  Plus,
  Divide,
  Superscript,
  Subscript,
  Square,
  Check,
  ImageIcon,
  Copy,
  ArrowLeft,
  FileQuestion,
} from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
} from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

// Mock data for questions
const mockQuestions : Question[] = [
  {
    _id: "q1",
    ordinal_number: 1,
    content: "Số lớn nhất có một chữ số là số nào?",
    question_type: "MULTIPLE_CHOICE",
    options: [
      {
        ordinal_number: 1,
        content: "8",
        is_correct: false,
      },
      {
        ordinal_number: 2,
        content: "9",
        is_correct: true,
      },
      {
        ordinal_number: 3,
        content: "10",
        is_correct: false,
      },
      {
        ordinal_number: 4,
        content: "0",
        is_correct: false,
      },
    ],
    blank_answer: null,
    solution: "Số lớn nhất có một chữ số là 9.",
    guide: "Các số có một chữ số là từ 0 đến 9.",
    terms: ["số", "chữ số"],
    images: [],
  },
  {
    _id: "q2",
    ordinal_number: 1,
    content: "Điền số thích hợp vào chỗ trống: 1, 2, 3, ..., 5",
    question_type: "FILL_IN_THE_BLANK",
    options: null,
    blank_answer: "4",
    solution: "Dãy số tự nhiên tăng dần: 1, 2, 3, 4, 5",
    guide: "Hãy đếm các số theo thứ tự tăng dần.",
    terms: ["dãy số", "số tự nhiên"],
    images: [],
  },
]

interface Option {
  ordinal_number: number
  content: string
  is_correct: boolean
}

interface Question {
  _id: string
  ordinal_number: number
  content: string
  question_type: "MULTIPLE_CHOICE" | "FILL_IN_THE_BLANK"
  options: Option[] | null
  blank_answer: string | null
  solution: string
  guide: string
  terms: string[]
  images: UploadedImage[]
}

interface UploadedImage {
  id: string
  file: File | null
  url: string
  name: string
  tag: string
}

export default function EditQuestionPage({ params }: { params: { id: string } }) {
  const { id } = params
  const router = useRouter()
  const searchParams = useSearchParams()
  const exerciseId = searchParams.get("exerciseId")
  const isPreview = searchParams.get("preview") === "true"
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isExitDialogOpen, setIsExitDialogOpen] = useState(false)
  const [contentTab, setContentTab] = useState("edit")
  const [solutionTab, setSolutionTab] = useState("edit")
  const [originalQuestion, setOriginalQuestion] = useState<Question | null>(null)
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    content: true,
    options: true,
    solution: !isPreview,
    hints: !isPreview,
  })

  const [question, setQuestion] = useState<Question>({
    _id: "",
    ordinal_number: 1,
    content: "",
    question_type: "MULTIPLE_CHOICE",
    options: [],
    blank_answer: null,
    solution: "",
    guide: "",
    terms: [],
    images: [],
  })

  useEffect(() => {
    const fetchQuestion = async () => {
      setIsLoading(true)
      try {
        if (!exerciseId && !isPreview) {
          toast({
            title: "Lỗi",
            description: "Thiếu thông tin bài tập",
            variant: "destructive",
          })
          router.push("/dashboard/exercises")
          return
        }

        // In a real app, fetch from your API
        // For now use mock data
        const foundQuestion = mockQuestions.find((q) => q._id === id)

        if (foundQuestion) {
          // Add images array if not present
          const questionWithImages = {
            ...foundQuestion,
            images: foundQuestion.images || [],
          }

          setQuestion(questionWithImages)
          setOriginalQuestion(JSON.parse(JSON.stringify(questionWithImages)))
        } else {
          toast({
            title: "Lỗi",
            description: "Không tìm thấy câu hỏi",
            variant: "destructive",
          })
          router.push(`/dashboard/exercises/edit/${exerciseId}`)
        }
      } catch (error) {
        console.error("Error fetching question:", error)
        toast({
          title: "Lỗi",
          description: "Không thể tải thông tin câu hỏi",
          variant: "destructive",
        })
        router.push(`/dashboard/exercises/edit/${exerciseId}`)
      } finally {
        setIsLoading(false)
      }
    }

    fetchQuestion()
  }, [id, exerciseId, router, isPreview])

  const toggleSection = (section: string) => {
    setOpenSections({
      ...openSections,
      [section]: !openSections[section],
    })
  }

  const handleQuestionTypeChange = (value: "MULTIPLE_CHOICE" | "FILL_IN_THE_BLANK") => {
    if (value === "MULTIPLE_CHOICE") {
      setQuestion({
        ...question,
        question_type: value,
        options: [
          { ordinal_number: 1, content: "", is_correct: true },
          { ordinal_number: 2, content: "", is_correct: false },
          { ordinal_number: 3, content: "", is_correct: false },
          { ordinal_number: 4, content: "", is_correct: false },
        ],
        blank_answer: null,
      })
    } else {
      setQuestion({
        ...question,
        question_type: value,
        options: null,
        blank_answer: "",
      })
    }
  }

  const handleContentChange = (field: keyof Question, value: string) => {
    setQuestion({
      ...question,
      [field]: value,
    })
  }

  const handleTermsChange = (termsString: string) => {
    const terms = termsString
      .split(",")
      .map((term) => term.trim())
      .filter(Boolean)

    setQuestion({
      ...question,
      terms,
    })
  }

  const handleOptionChange = (optionIndex: number, field: keyof Option, value: any) => {
    if (question.options) {
      const updatedOptions = [...question.options]

      if (field === "is_correct" && value === true) {
        // Set all other options to false
        updatedOptions.forEach((option, idx) => {
          option.is_correct = idx === optionIndex
        })
      } else {
        updatedOptions[optionIndex] = {
          ...updatedOptions[optionIndex],
          [field]: value,
        }
      }

      setQuestion({
        ...question,
        options: updatedOptions,
      })
    }
  }

  const handleAddOption = () => {
    if (question.options) {
      const newOption: Option = {
        ordinal_number: question.options.length + 1,
        content: "",
        is_correct: false,
      }

      setQuestion({
        ...question,
        options: [...question.options, newOption],
      })
    }
  }

  const handleRemoveOption = (optionIndex: number) => {
    if (question.options) {
      if (question.options.length <= 2) {
        toast({
          title: "Không thể xóa",
          description: "Phải có ít nhất 2 lựa chọn cho câu hỏi trắc nghiệm",
          variant: "destructive",
        })
        return
      }

      const updatedOptions = [...question.options]
      updatedOptions.splice(optionIndex, 1)

      // Update ordinal numbers
      const reorderedOptions = updatedOptions.map((option, idx) => ({
        ...option,
        ordinal_number: idx + 1,
      }))

      // Ensure at least one option is correct
      if (!reorderedOptions.some((option) => option.is_correct) && reorderedOptions.length > 0) {
        reorderedOptions[0].is_correct = true
      }

      setQuestion({
        ...question,
        options: reorderedOptions,
      })
    }
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      const imageId = `img-${Date.now()}`
      const imageUrl = URL.createObjectURL(file)
      const imageName = file.name
      const imageTag = `<img src="${imageName}"></img>`

      // Add to uploaded images
      const newImage = {
        id: imageId,
        file,
        url: imageUrl,
        name: imageName,
        tag: imageTag,
      }

      setQuestion({
        ...question,
        images: [...question.images, newImage],
      })

      toast({
        title: "Thành công",
        description: `Đã tải lên hình ảnh: ${file.name}`,
      })

      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }
  }

  const handleDeleteImage = (id: string) => {
    // Check if image is used in any content
    const isUsed =
      question.content.includes(`<img src="${question.images.find((img) => img.id === id)?.name}"></img>`) ||
      question.solution.includes(`<img src="${question.images.find((img) => img.id === id)?.name}"></img>`) ||
      (question.options &&
        question.options.some((opt) =>
          opt.content.includes(`<img src="${question.images.find((img) => img.id === id)?.name}"></img>`),
        ))

    if (isUsed) {
      toast({
        title: "Không thể xóa",
        description: "Hình ảnh đang được sử dụng trong nội dung câu hỏi hoặc lời giải",
        variant: "destructive",
      })
      return
    }

    setQuestion({
      ...question,
      images: question.images.filter((img) => img.id !== id),
    })

    toast({
      title: "Thành công",
      description: "Đã xóa hình ảnh",
    })
  }

  const copyImageTag = (tag: string) => {
    navigator.clipboard.writeText(tag)
    toast({
      title: "Đã sao chép",
      description: "Đã sao chép thẻ hình ảnh vào clipboard",
    })
  }

  const insertTag = (field: keyof Question, tag: string) => {
    setQuestion({
      ...question,
      [field]: question[field] + tag,
    })
  }

  const insertImageTag = (field: keyof Question, imageId: string) => {
    const image = question.images.find((img) => img.id === imageId)
    if (image) {
      insertTag(field, image.tag)
    }
  }

  const insertOptionImageTag = (optionIndex: number, imageId: string) => {
    const image = question.images.find((img) => img.id === imageId)
    if (image && question.options) {
      const updatedOptions = [...question.options]
      updatedOptions[optionIndex] = {
        ...updatedOptions[optionIndex],
        content: updatedOptions[optionIndex].content + image.tag,
      }

      setQuestion({
        ...question,
        options: updatedOptions,
      })
    }
  }

  const insertLatex = (field: keyof Question, latexType: string) => {
    let latexTemplate = ""

    switch (latexType) {
      case "fraction":
        latexTemplate = "<latex>\\frac{a}{b}</latex>"
        break
      case "superscript":
        latexTemplate = "<latex>a^{b}</latex>"
        break
      case "subscript":
        latexTemplate = "<latex>a_{b}</latex>"
        break
      case "sqrt":
        latexTemplate = "<latex>\\sqrt{a}</latex>"
        break
      case "square":
        latexTemplate = "<latex>a^2</latex>"
        break
      case "division":
        latexTemplate = "<latex>a \\div b</latex>"
        break
      default:
        latexTemplate = "<latex></latex>"
    }

    insertTag(field, latexTemplate)
  }

  const insertLatexToOption = (optionIndex: number, latexType: string) => {
    let latexTemplate = ""

    switch (latexType) {
      case "fraction":
        latexTemplate = "<latex>\\frac{a}{b}</latex>"
        break
      case "superscript":
        latexTemplate = "<latex>a^{b}</latex>"
        break
      case "subscript":
        latexTemplate = "<latex>a_{b}</latex>"
        break
      case "sqrt":
        latexTemplate = "<latex>\\sqrt{a}</latex>"
        break
      case "square":
        latexTemplate = "<latex>a^2</latex>"
        break
      case "division":
        latexTemplate = "<latex>a \\div b</latex>"
        break
      default:
        latexTemplate = "<latex></latex>"
    }

    if (question.options) {
      const updatedOptions = [...question.options]
      updatedOptions[optionIndex] = {
        ...updatedOptions[optionIndex],
        content: updatedOptions[optionIndex].content + latexTemplate,
      }

      setQuestion({
        ...question,
        options: updatedOptions,
      })
    }
  }

  const insertFormat = (field: keyof Question, formatType: string) => {
    let formatTemplate = ""

    switch (formatType) {
      case "bold":
        formatTemplate = "<b>văn bản đậm</b>"
        break
      case "italic":
        formatTemplate = "<i>văn bản nghiêng</i>"
        break
      case "linebreak":
        formatTemplate = "<br>"
        break
      default:
        formatTemplate = ""
    }

    insertTag(field, formatTemplate)
  }

  const insertFormatToOption = (optionIndex: number, formatType: string) => {
    let formatTemplate = ""

    switch (formatType) {
      case "bold":
        formatTemplate = "<b>văn bản đậm</b>"
        break
      case "italic":
        formatTemplate = "<i>văn bản nghiêng</i>"
        break
      case "linebreak":
        formatTemplate = "<br>"
        break
      default:
        formatTemplate = ""
    }

    if (question.options) {
      const updatedOptions = [...question.options]
      updatedOptions[optionIndex] = {
        ...updatedOptions[optionIndex],
        content: updatedOptions[optionIndex].content + formatTemplate,
      }

      setQuestion({
        ...question,
        options: updatedOptions,
      })
    }
  }

  const handleSave = async () => {
    setIsSubmitting(true)

    try {
      // In a real application, you would:
      // 1. Upload images and get their permanent URLs
      // 2. Submit the question data to your API

      // For now, we'll just simulate success
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "Thành công",
        description: "Đã cập nhật câu hỏi",
        variant: "default",
      })

      // Return to exercise edit
      router.push(`/dashboard/exercises/edit/${exerciseId}`)
    } catch (error) {
      console.error("Error updating question:", error)
      toast({
        title: "Lỗi",
        description: "Không thể cập nhật câu hỏi. Vui lòng thử lại.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleExit = () => {
    if (JSON.stringify(question) !== JSON.stringify(originalQuestion)) {
      setIsExitDialogOpen(true)
    } else {
      router.push(`/dashboard/exercises/edit/${exerciseId}`)
    }
  }

  const renderContentPreview = (content: string) => {
    // First, replace image tags with actual images
    let html = content.replace(/<img src="(.*?)"><\/img>/g, (match, imageName) => {
      const image = question.images.find((img) => img.name === imageName)
      if (image) {
        return `<img src="${image.url}" alt="${image.name}" class="max-h-40 object-contain my-2" />`
      }
      return match
    })

    // Then, replace LaTeX with rendered HTML
    html = html.replace(/<latex>(.*?)<\/latex>/g, (match, latex) => {
      // Here we'd ideally use a proper LaTeX renderer like KaTeX
      // For now, we'll style it differently to simulate proper rendering

      // Some basic replacements for common math notations
      let renderedLatex = latex

      // Fractions
      if (latex.includes("\\frac")) {
        renderedLatex = latex.replace(
          /\\frac\{(.*?)\}\{(.*?)\}/g,
          '<span class="inline-block text-center"><span class="block border-b border-black">$1</span><span class="block">$2</span></span>',
        )
      }

      // Superscripts
      if (latex.includes("^")) {
        renderedLatex = latex.replace(/(\w+)\^\{(.*?)\}/g, "$1<sup>$2</sup>")
      }

      // Subscripts
      if (latex.includes("_")) {
        renderedLatex = latex.replace(/(\w+)_\{(.*?)\}/g, "$1<sub>$2</sub>")
      }

      // Square root
      if (latex.includes("\\sqrt")) {
        renderedLatex = latex.replace(/\\sqrt\{(.*?)\}/g, "√($1)")
      }

      // Division
      if (latex.includes("\\div")) {
        renderedLatex = latex.replace(/\\div/g, "÷")
      }

      return `<span class="bg-blue-100 px-2 py-1 rounded font-medium">${renderedLatex}</span>`
    })

    return html
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2">Đang tải...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header with Breadcrumb */}
      <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-10 z-0"></div>
        <div className="relative z-10">
          <Breadcrumb className="mb-4">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/dashboard" className="text-white/80 hover:text-white">
                  Dashboard
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="text-white/50" />
              <BreadcrumbItem>
                <BreadcrumbLink href="/dashboard/exercises" className="text-white/80 hover:text-white">
                  Bài luyện tập
                </BreadcrumbLink>
              </BreadcrumbItem>
              {exerciseId && (
                <>
                  <BreadcrumbSeparator className="text-white/50" />
                  <BreadcrumbItem>
                    <BreadcrumbLink
                      href={`/dashboard/exercises/edit/${exerciseId}`}
                      className="text-white/80 hover:text-white"
                    >
                      Chỉnh sửa bài luyện tập
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                </>
              )}
              <BreadcrumbSeparator className="text-white/50" />
              <BreadcrumbItem>
                <BreadcrumbLink className="text-white font-semibold">
                  {isPreview ? "Xem trước câu hỏi" : "Chỉnh sửa câu hỏi"}
                </BreadcrumbLink>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full bg-white/20 text-white hover:bg-white/30"
              onClick={handleExit}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-3xl font-bold">{isPreview ? "Xem trước câu hỏi" : "Chỉnh sửa câu hỏi"}</h1>
          </div>
        </div>
        <div className="absolute right-0 bottom-0 opacity-20">
          <FileQuestion size={180} />
        </div>
      </div>

      <div className="space-y-6">
        {/* Question Content Section */}
        <Card className="border-primary/20 shadow-md overflow-hidden">
          <CardHeader
            className="bg-blue-50 cursor-pointer flex flex-row items-center"
            onClick={() => toggleSection("content")}
          >
            <div className="flex-1">
              <CardTitle className="text-blue-700">Nội dung câu hỏi</CardTitle>
              <CardDescription>Chỉnh sửa nội dung và loại câu hỏi</CardDescription>
            </div>
            <Badge variant={openSections.content ? "secondary" : "outline"}>
              {openSections.content ? "Đang mở" : "Đã đóng"}
            </Badge>
          </CardHeader>

          {openSections.content && (
            <CardContent className="p-6 space-y-6">
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label className="text-base font-semibold">Loại câu hỏi</Label>
                  <Select
                    value={question.question_type}
                    onValueChange={(value: "MULTIPLE_CHOICE" | "FILL_IN_THE_BLANK") => handleQuestionTypeChange(value)}
                    disabled={isPreview}
                  >
                    <SelectTrigger className="border-input/60">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="MULTIPLE_CHOICE">Trắc nghiệm</SelectItem>
                      <SelectItem value="FILL_IN_THE_BLANK">Điền vào chỗ trống</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2">
                  <Label className="text-base font-semibold">Nội dung câu hỏi</Label>
                  {!isPreview && (
                    <div className="flex flex-wrap gap-1 mb-2 p-2 bg-gray-50 rounded-md">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => insertLatex("content", "fraction")}
                      >
                        <Divide className="h-4 w-4 mr-1" /> Phân số
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => insertLatex("content", "superscript")}
                      >
                        <Superscript className="h-4 w-4 mr-1" /> Số mũ
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => insertLatex("content", "subscript")}
                      >
                        <Subscript className="h-4 w-4 mr-1" /> Chỉ số
                      </Button>
                      <Button type="button" variant="outline" size="sm" onClick={() => insertLatex("content", "sqrt")}>
                        <Square className="h-4 w-4 mr-1" /> Căn bậc hai
                      </Button>
                      <Button type="button" variant="outline" size="sm" onClick={() => insertFormat("content", "bold")}>
                        <Bold className="h-4 w-4 mr-1" /> Đậm
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => insertFormat("content", "italic")}
                      >
                        <Italic className="h-4 w-4 mr-1" /> Nghiêng
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => insertFormat("content", "linebreak")}
                      >
                        <Plus className="h-4 w-4 mr-1" /> Xuống dòng
                      </Button>
                      <Button type="button" variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>
                        <ImageIcon className="h-4 w-4 mr-1" /> Tải ảnh
                      </Button>
                      <Input
                        type="file"
                        ref={fileInputRef}
                        className="hidden"
                        accept="image/*"
                        onChange={handleImageUpload}
                      />
                    </div>
                  )}

                  <Tabs value={isPreview ? "preview" : contentTab} onValueChange={setContentTab} className="w-full">
                    {!isPreview && (
                      <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="edit">Chỉnh sửa</TabsTrigger>
                        <TabsTrigger value="preview">Xem trước</TabsTrigger>
                        <TabsTrigger value="images">Hình ảnh ({question.images.length})</TabsTrigger>
                      </TabsList>
                    )}

                    {!isPreview && (
                      <TabsContent value="edit">
                        <Textarea
                          value={question.content}
                          onChange={(e) => handleContentChange("content", e.target.value)}
                          placeholder="Nhập nội dung câu hỏi..."
                          rows={4}
                          className="font-mono border-input/60"
                        />
                      </TabsContent>
                    )}

                    <TabsContent value="preview">
                      <div
                        className="p-4 border rounded-md min-h-[100px] prose max-w-none"
                        dangerouslySetInnerHTML={{ __html: renderContentPreview(question.content) }}
                      />
                    </TabsContent>

                    {!isPreview && (
                      <TabsContent value="images">
                        {question.images.length === 0 ? (
                          <div className="p-4 border rounded-md min-h-[100px] flex items-center justify-center">
                            <div className="text-center">
                              <ImageIcon className="h-10 w-10 text-muted-foreground/70 mx-auto mb-2" />
                              <p className="text-muted-foreground">Chưa có hình ảnh nào</p>
                              <Button variant="outline" className="mt-2" onClick={() => fileInputRef.current?.click()}>
                                <ImageIcon className="h-4 w-4 mr-1" /> Tải lên hình ảnh
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <div className="p-4 border rounded-md min-h-[100px]">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                              {question.images.map((image) => (
                                <div key={image.id} className="border rounded-md p-3 space-y-2 bg-white shadow-sm">
                                  <div className="relative h-24 w-full bg-muted/20 rounded-md overflow-hidden">
                                    <img
                                      src={image.url || "/placeholder.svg"}
                                      alt={image.name}
                                      className="absolute inset-0 h-full w-full object-contain"
                                    />
                                  </div>
                                  <div className="text-xs truncate font-medium">{image.name}</div>
                                  <div className="text-xs bg-gray-100 p-1 rounded font-mono break-all">{image.tag}</div>
                                  <div className="flex justify-between gap-2">
                                    <Button
                                      variant="secondary"
                                      size="sm"
                                      className="text-xs h-7 flex-1"
                                      onClick={() => insertImageTag("content", image.id)}
                                    >
                                      Chèn
                                    </Button>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className="text-xs h-7 w-7 p-0"
                                      onClick={() => copyImageTag(image.tag)}
                                    >
                                      <Copy className="h-3 w-3" />
                                    </Button>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className="text-xs h-7 flex-1 text-red-500"
                                      onClick={() => handleDeleteImage(image.id)}
                                    >
                                      Xóa
                                    </Button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </TabsContent>
                    )}
                  </Tabs>
                </div>
              </div>
            </CardContent>
          )}
        </Card>

        {/* Multiple Choice Options */}
        {question.question_type === "MULTIPLE_CHOICE" && question.options && (
          <Card className="border-green-100 shadow-md overflow-hidden">
            <CardHeader
              className="bg-green-50 cursor-pointer flex flex-row items-center"
              onClick={() => toggleSection("options")}
            >
              <div className="flex-1">
                <CardTitle className="text-green-700">Các lựa chọn</CardTitle>
                <CardDescription>Quản lý các lựa chọn cho câu hỏi trắc nghiệm</CardDescription>
              </div>
              <Badge variant={openSections.options ? "secondary" : "outline"}>
                {openSections.options ? "Đang mở" : "Đã đóng"}
              </Badge>
            </CardHeader>

            {openSections.options && (
              <CardContent className="p-6 space-y-6">
                {!isPreview && (
                  <div className="flex justify-between items-center">
                    <Label className="text-base font-semibold">Danh sách lựa chọn</Label>
                    <Button type="button" variant="outline" size="sm" onClick={handleAddOption}>
                      <Plus className="h-4 w-4 mr-1" /> Thêm lựa chọn
                    </Button>
                  </div>
                )}

                <RadioGroup
                  value={question.options.findIndex((opt) => opt.is_correct).toString()}
                  onValueChange={(value) => {
                    if (!isPreview) {
                      const optionIndex = Number.parseInt(value)
                      handleOptionChange(optionIndex, "is_correct", true)
                    }
                  }}
                  className="space-y-4"
                  disabled={isPreview}
                >
                  {question.options.map((option, optionIndex) => (
                    <div
                      key={optionIndex}
                      className={`p-4 rounded-lg border ${
                        option.is_correct ? "border-green-500 bg-green-50/70" : "border-muted"
                      }`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2">
                          <RadioGroupItem
                            value={optionIndex.toString()}
                            id={`option-${optionIndex}`}
                            className="text-green-600"
                            disabled={isPreview}
                          />
                          <Label
                            htmlFor={`option-${optionIndex}`}
                            className={`font-medium ${option.is_correct ? "text-green-700" : "text-muted-foreground"}`}
                          >
                            Lựa chọn {option.ordinal_number}{" "}
                            {option.is_correct && (
                              <span className="text-green-600 ml-2">
                                <Check className="h-4 w-4 inline" /> Đáp án đúng
                              </span>
                            )}
                          </Label>
                        </div>
                        {!isPreview && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveOption(optionIndex)}
                            className="text-red-500 hover:text-red-700"
                            disabled={question.options != null && question.options.length <= 2}
                          >
                            Xóa
                          </Button>
                        )}
                      </div>

                      <div className="ml-6">
                        {!isPreview ? (
                          <Accordion type="single" collapsible className="w-full">
                            <AccordionItem value="edit" className="border-none">
                              <AccordionTrigger className="py-2">Chỉnh sửa nội dung</AccordionTrigger>
                              <AccordionContent>
                                <div className="flex flex-wrap gap-1 mb-2 p-2 bg-gray-50 rounded-md">
                                  <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => insertLatexToOption(optionIndex, "fraction")}
                                  >
                                    <Divide className="h-4 w-4 mr-1" /> Phân số
                                  </Button>
                                  <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => insertFormatToOption(optionIndex, "bold")}
                                  >
                                    <Bold className="h-4 w-4 mr-1" /> Đậm
                                  </Button>
                                  <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => insertFormatToOption(optionIndex, "italic")}
                                  >
                                    <Italic className="h-4 w-4 mr-1" /> Nghiêng
                                  </Button>
                                  {question.images.length > 0 && (
                                    <select
                                      title="Chèn hình ảnh"
                                      className="h-8 px-2 rounded text-sm border border-input"
                                      onChange={(e) => {
                                        if (e.target.value) {
                                          insertOptionImageTag(optionIndex, e.target.value)
                                          e.target.value = ""
                                        }
                                      }}
                                    >
                                      <option value="">Chèn hình ảnh</option>
                                      {question.images.map((img) => (
                                        <option key={img.id} value={img.id}>
                                          {img.name}
                                        </option>
                                      ))}
                                    </select>
                                  )}
                                </div>

                                <Tabs defaultValue="edit" className="w-full">
                                  <TabsList className="grid w-full grid-cols-2">
                                    <TabsTrigger value="edit">Chỉnh sửa</TabsTrigger>
                                    <TabsTrigger value="preview">Xem trước</TabsTrigger>
                                  </TabsList>
                                  <TabsContent value="edit">
                                    <Textarea
                                      value={option.content}
                                      onChange={(e) => handleOptionChange(optionIndex, "content", e.target.value)}
                                      placeholder="Nhập nội dung lựa chọn..."
                                      rows={2}
                                      className="font-mono border-input/60"
                                    />
                                  </TabsContent>
                                  <TabsContent value="preview">
                                    <div
                                      className="p-2 border rounded-md min-h-[50px] prose max-w-none"
                                      dangerouslySetInnerHTML={{
                                        __html: renderContentPreview(option.content),
                                      }}
                                    />
                                  </TabsContent>
                                </Tabs>
                              </AccordionContent>
                            </AccordionItem>
                          </Accordion>
                        ) : (
                          <div
                            className="p-2 border rounded-md min-h-[50px] prose max-w-none"
                            dangerouslySetInnerHTML={{
                              __html: renderContentPreview(option.content),
                            }}
                          />
                        )}
                      </div>
                    </div>
                  ))}
                </RadioGroup>
              </CardContent>
            )}
          </Card>
        )}

        {/* Fill in the Blank Answer */}
        {question.question_type === "FILL_IN_THE_BLANK" && (
          <Card className="border-green-100 shadow-md overflow-hidden">
            <CardHeader className="bg-green-50">
              <CardTitle className="text-green-700">Đáp án</CardTitle>
              <CardDescription>Đáp án cho câu hỏi điền vào chỗ trống</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid gap-2">
                <Label>Đáp án đúng</Label>
                <Input
                  value={question.blank_answer || ""}
                  onChange={(e) => handleContentChange("blank_answer", e.target.value)}
                  placeholder="Nhập đáp án cho câu hỏi điền vào chỗ trống"
                  className="border-input/60"
                  disabled={isPreview}
                />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Solution */}
        <Card className="border-primary/20 shadow-md overflow-hidden">
          <CardHeader
            className="bg-purple-50 cursor-pointer flex flex-row items-center"
            onClick={() => toggleSection("solution")}
          >
            <div className="flex-1">
              <CardTitle className="text-purple-700">Lời giải</CardTitle>
              <CardDescription>Giải thích chi tiết cho câu hỏi</CardDescription>
            </div>
            <Badge variant={openSections.solution ? "secondary" : "outline"}>
              {openSections.solution ? "Đang mở" : "Đã đóng"}
            </Badge>
          </CardHeader>

          {openSections.solution && (
            <CardContent className="p-6 space-y-4">
              {!isPreview && (
                <div className="flex flex-wrap gap-1 mb-2 p-2 bg-gray-50 rounded-md">
                  <Button type="button" variant="outline" size="sm" onClick={() => insertLatex("solution", "fraction")}>
                    <Divide className="h-4 w-4 mr-1" /> Phân số
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => insertLatex("solution", "superscript")}
                  >
                    <Superscript className="h-4 w-4 mr-1" /> Số mũ
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => insertLatex("solution", "subscript")}
                  >
                    <Subscript className="h-4 w-4 mr-1" /> Chỉ số
                  </Button>
                  <Button type="button" variant="outline" size="sm" onClick={() => insertLatex("solution", "sqrt")}>
                    <Square className="h-4 w-4 mr-1" /> Căn bậc hai
                  </Button>
                  <Button type="button" variant="outline" size="sm" onClick={() => insertFormat("solution", "bold")}>
                    <Bold className="h-4 w-4 mr-1" /> Đậm
                  </Button>
                  <Button type="button" variant="outline" size="sm" onClick={() => insertFormat("solution", "italic")}>
                    <Italic className="h-4 w-4 mr-1" /> Nghiêng
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => insertFormat("solution", "linebreak")}
                  >
                    <Plus className="h-4 w-4 mr-1" /> Xuống dòng
                  </Button>
                  {question.images.length > 0 && (
                    <select
                      title="Chọn hình ảnh"
                      className="h-8 px-2 rounded text-sm border border-input"
                      onChange={(e) => {
                        if (e.target.value) {
                          insertImageTag("solution", e.target.value)
                          e.target.value = ""
                        }
                      }}
                    >
                      <option value="">Chèn hình ảnh</option>
                      {question.images.map((img) => (
                        <option key={img.id} value={img.id}>
                          {img.name}
                        </option>
                      ))}
                    </select>
                  )}
                </div>
              )}

              <Tabs value={isPreview ? "preview" : solutionTab} onValueChange={setSolutionTab} className="w-full">
                {!isPreview && (
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="edit">Chỉnh sửa</TabsTrigger>
                    <TabsTrigger value="preview">Xem trước</TabsTrigger>
                  </TabsList>
                )}
                {!isPreview && (
                  <TabsContent value="edit">
                    <Textarea
                      value={question.solution}
                      onChange={(e) => handleContentChange("solution", e.target.value)}
                      placeholder="Nhập lời giải cho câu hỏi..."
                      rows={4}
                      className="font-mono border-input/60"
                    />
                  </TabsContent>
                )}
                <TabsContent value="preview">
                  <div
                    className="p-4 border rounded-md min-h-[100px] prose max-w-none"
                    dangerouslySetInnerHTML={{ __html: renderContentPreview(question.solution) }}
                  />
                </TabsContent>
              </Tabs>
            </CardContent>
          )}
        </Card>

        {/* Hints and Terms */}
        <Card className="border-primary/20 shadow-md overflow-hidden">
          <CardHeader
            className="bg-yellow-50 cursor-pointer flex flex-row items-center"
            onClick={() => toggleSection("hints")}
          >
            <div className="flex-1">
              <CardTitle className="text-yellow-700">Gợi ý và Thuật ngữ</CardTitle>
              <CardDescription>Thông tin bổ sung cho câu hỏi</CardDescription>
            </div>
            <Badge variant={openSections.hints ? "secondary" : "outline"}>
              {openSections.hints ? "Đang mở" : "Đã đóng"}
            </Badge>
          </CardHeader>

          {openSections.hints && (
            <CardContent className="p-6 space-y-6">
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label className="text-base font-semibold">Gợi ý</Label>
                  <Textarea
                    value={question.guide}
                    onChange={(e) => handleContentChange("guide", e.target.value)}
                    placeholder="Nhập gợi ý cho câu hỏi..."
                    rows={2}
                    className="border-input/60"
                    disabled={isPreview}
                  />
                </div>

                <div className="grid gap-2">
                  <Label className="text-base font-semibold">Thuật ngữ</Label>
                  <Input
                    value={question.terms.join(", ")}
                    onChange={(e) => handleTermsChange(e.target.value)}
                    placeholder="Nhập các thuật ngữ, phân cách bằng dấu phẩy"
                    className="border-input/60"
                    disabled={isPreview}
                  />
                </div>
              </div>
            </CardContent>
          )}
        </Card>
      </div>

      {!isPreview && (
        <div className="flex justify-end gap-2 sticky bottom-4 bg-white p-4 rounded-lg shadow-md border">
          <Button type="button" variant="outline" onClick={handleExit}>
            Hủy
          </Button>
          <Button onClick={handleSave} disabled={isSubmitting}>
            {isSubmitting ? "Đang lưu..." : "Lưu thay đổi"}
          </Button>
        </div>
      )}

      {isPreview && (
        <div className="flex justify-center sticky bottom-4 bg-white p-4 rounded-lg shadow-md border">
          <Button type="button" variant="default" onClick={handleExit}>
            <ArrowLeft className="h-4 w-4 mr-2" /> Quay lại
          </Button>
        </div>
      )}

      <AlertDialog open={isExitDialogOpen} onOpenChange={setIsExitDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận hủy</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn hủy? Tất cả thay đổi sẽ bị mất và không thể khôi phục.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Tiếp tục chỉnh sửa</AlertDialogCancel>
            <AlertDialogAction onClick={() => router.push(`/dashboard/exercises/edit/${exerciseId}`)}>
              Hủy và thoát
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

// "use client"

// import type React from "react"

// import { useState, useEffect, useRef } from "react"
// import { useRouter, useSearchParams } from "next/navigation"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Textarea } from "@/components/ui/textarea"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import {
//   ChevronLeft,
//   Bold,
//   Italic,
//   Plus,
//   Divide,
//   Superscript,
//   Subscript,
//   Square,
//   Check,
//   ImageIcon,
//   Save,
//   Copy,
// } from "lucide-react"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { toast } from "@/components/ui/use-toast"
// import {
//   AlertDialog,
//   AlertDialogAction,
//   AlertDialogCancel,
//   AlertDialogContent,
//   AlertDialogDescription,
//   AlertDialogFooter,
//   AlertDialogHeader,
//   AlertDialogTitle,
// } from "@/components/ui/alert-dialog"
// import { Badge } from "@/components/ui/badge"
// import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
// import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

// // Mock data for questions
// const mockQuestions = [
//   {
//     _id: "q1",
//     ordinal_number: 1,
//     content: "Số lớn nhất có một chữ số là số nào?",
//     question_type: "MULTIPLE_CHOICE",
//     options: [
//       {
//         ordinal_number: 1,
//         content: "8",
//         is_correct: false,
//       },
//       {
//         ordinal_number: 2,
//         content: "9",
//         is_correct: true,
//       },
//       {
//         ordinal_number: 3,
//         content: "10",
//         is_correct: false,
//       },
//       {
//         ordinal_number: 4,
//         content: "0",
//         is_correct: false,
//       },
//     ],
//     blank_answer: null,
//     solution: "Số lớn nhất có một chữ số là 9.",
//     guide: "Các số có một chữ số là từ 0 đến 9.",
//     terms: ["số", "chữ số"],
//     images: [],
//   },
//   {
//     _id: "q2",
//     ordinal_number: 1,
//     content: "Điền số thích hợp vào chỗ trống: 1, 2, 3, ..., 5",
//     question_type: "FILL_IN_THE_BLANK",
//     options: null,
//     blank_answer: "4",
//     solution: "Dãy số tự nhiên tăng dần: 1, 2, 3, 4, 5",
//     guide: "Hãy đếm các số theo thứ tự tăng dần.",
//     terms: ["dãy số", "số tự nhiên"],
//     images: [],
//   },
// ]

// interface Option {
//   ordinal_number: number
//   content: string
//   is_correct: boolean
// }

// interface Question {
//   _id: string
//   ordinal_number: number
//   content: string
//   question_type: "MULTIPLE_CHOICE" | "FILL_IN_THE_BLANK"
//   options: Option[] | null
//   blank_answer: string | null
//   solution: string
//   guide: string
//   terms: string[]
//   images: UploadedImage[]
// }

// interface UploadedImage {
//   id: string
//   file: File | null
//   url: string
//   name: string
//   tag: string
// }

// export default function EditQuestionPage({ params }: { params: { id: string } }) {
//   const { id } = params
//   const router = useRouter()
//   const searchParams = useSearchParams()
//   const exerciseId = searchParams.get("exerciseId")
//   const fileInputRef = useRef<HTMLInputElement>(null)

//   const [isLoading, setIsLoading] = useState(true)
//   const [isSubmitting, setIsSubmitting] = useState(false)
//   const [isExitDialogOpen, setIsExitDialogOpen] = useState(false)
//   const [contentTab, setContentTab] = useState("edit")
//   const [solutionTab, setSolutionTab] = useState("edit")
//   const [originalQuestion, setOriginalQuestion] = useState<Question | null>(null)
//   const [openSections, setOpenSections] = useState<Record<string, boolean>>({
//     content: true,
//     options: true,
//     solution: false,
//     hints: false,
//   })

//   const [question, setQuestion] = useState<Question>({
//     _id: "",
//     ordinal_number: 1,
//     content: "",
//     question_type: "MULTIPLE_CHOICE",
//     options: [],
//     blank_answer: null,
//     solution: "",
//     guide: "",
//     terms: [],
//     images: [],
//   })

//   useEffect(() => {
//     const fetchQuestion = async () => {
//       setIsLoading(true)
//       try {
//         if (!exerciseId) {
//           toast({
//             title: "Lỗi",
//             description: "Thiếu thông tin bài tập",
//             variant: "destructive",
//           })
//           router.push("/dashboard/exercises")
//           return
//         }

//         // In a real app, fetch from your API
//         // For now use mock data
//         const foundQuestion = mockQuestions.find((q) => q._id === id)

//         if (foundQuestion) {
//           // Add images array if not present
//           const questionWithImages = {
//             ...foundQuestion,
//             images: foundQuestion.images || [],
//           }

//           setQuestion(questionWithImages)
//           setOriginalQuestion(JSON.parse(JSON.stringify(questionWithImages)))
//         } else {
//           toast({
//             title: "Lỗi",
//             description: "Không tìm thấy câu hỏi",
//             variant: "destructive",
//           })
//           router.push(`/dashboard/exercises/edit/${exerciseId}`)
//         }
//       } catch (error) {
//         console.error("Error fetching question:", error)
//         toast({
//           title: "Lỗi",
//           description: "Không thể tải thông tin câu hỏi",
//           variant: "destructive",
//         })
//         router.push(`/dashboard/exercises/edit/${exerciseId}`)
//       } finally {
//         setIsLoading(false)
//       }
//     }

//     fetchQuestion()
//   }, [id, exerciseId, router])

//   const toggleSection = (section: string) => {
//     setOpenSections({
//       ...openSections,
//       [section]: !openSections[section],
//     })
//   }

//   const handleQuestionTypeChange = (value: "MULTIPLE_CHOICE" | "FILL_IN_THE_BLANK") => {
//     if (value === "MULTIPLE_CHOICE") {
//       setQuestion({
//         ...question,
//         question_type: value,
//         options: [
//           { ordinal_number: 1, content: "", is_correct: true },
//           { ordinal_number: 2, content: "", is_correct: false },
//           { ordinal_number: 3, content: "", is_correct: false },
//           { ordinal_number: 4, content: "", is_correct: false },
//         ],
//         blank_answer: null,
//       })
//     } else {
//       setQuestion({
//         ...question,
//         question_type: value,
//         options: null,
//         blank_answer: "",
//       })
//     }
//   }

//   const handleContentChange = (field: keyof Question, value: string) => {
//     setQuestion({
//       ...question,
//       [field]: value,
//     })
//   }

//   const handleTermsChange = (termsString: string) => {
//     const terms = termsString
//       .split(",")
//       .map((term) => term.trim())
//       .filter(Boolean)

//     setQuestion({
//       ...question,
//       terms,
//     })
//   }

//   const handleOptionChange = (optionIndex: number, field: keyof Option, value: any) => {
//     if (question.options) {
//       const updatedOptions = [...question.options]

//       if (field === "is_correct" && value === true) {
//         // Set all other options to false
//         updatedOptions.forEach((option, idx) => {
//           option.is_correct = idx === optionIndex
//         })
//       } else {
//         updatedOptions[optionIndex] = {
//           ...updatedOptions[optionIndex],
//           [field]: value,
//         }
//       }

//       setQuestion({
//         ...question,
//         options: updatedOptions,
//       })
//     }
//   }

//   const handleAddOption = () => {
//     if (question.options) {
//       const newOption: Option = {
//         ordinal_number: question.options.length + 1,
//         content: "",
//         is_correct: false,
//       }

//       setQuestion({
//         ...question,
//         options: [...question.options, newOption],
//       })
//     }
//   }

//   const handleRemoveOption = (optionIndex: number) => {
//     if (question.options) {
//       if (question.options.length <= 2) {
//         toast({
//           title: "Không thể xóa",
//           description: "Phải có ít nhất 2 lựa chọn cho câu hỏi trắc nghiệm",
//           variant: "destructive",
//         })
//         return
//       }

//       const updatedOptions = [...question.options]
//       updatedOptions.splice(optionIndex, 1)

//       // Update ordinal numbers
//       const reorderedOptions = updatedOptions.map((option, idx) => ({
//         ...option,
//         ordinal_number: idx + 1,
//       }))

//       // Ensure at least one option is correct
//       if (!reorderedOptions.some((option) => option.is_correct) && reorderedOptions.length > 0) {
//         reorderedOptions[0].is_correct = true
//       }

//       setQuestion({
//         ...question,
//         options: reorderedOptions,
//       })
//     }
//   }

//   const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files && e.target.files[0]) {
//       const file = e.target.files[0]
//       const imageId = `img-${Date.now()}`
//       const imageUrl = URL.createObjectURL(file)
//       const imageName = file.name
//       const imageTag = `<img src="${imageName}"></img>`

//       // Add to uploaded images
//       const newImage = {
//         id: imageId,
//         file,
//         url: imageUrl,
//         name: imageName,
//         tag: imageTag,
//       }

//       setQuestion({
//         ...question,
//         images: [...question.images, newImage],
//       })

//       toast({
//         title: "Thành công",
//         description: `Đã tải lên hình ảnh: ${file.name}`,
//       })

//       // Reset file input
//       if (fileInputRef.current) {
//         fileInputRef.current.value = ""
//       }
//     }
//   }

//   const handleDeleteImage = (id: string) => {
//     // Check if image is used in any content
//     const isUsed =
//       question.content.includes(`<img src="${question.images.find((img) => img.id === id)?.name}"></img>`) ||
//       question.solution.includes(`<img src="${question.images.find((img) => img.id === id)?.name}"></img>`) ||
//       (question.options &&
//         question.options.some((opt) =>
//           opt.content.includes(`<img src="${question.images.find((img) => img.id === id)?.name}"></img>`),
//         ))

//     if (isUsed) {
//       toast({
//         title: "Không thể xóa",
//         description: "Hình ảnh đang được sử dụng trong nội dung câu hỏi hoặc lời giải",
//         variant: "destructive",
//       })
//       return
//     }

//     setQuestion({
//       ...question,
//       images: question.images.filter((img) => img.id !== id),
//     })

//     toast({
//       title: "Thành công",
//       description: "Đã xóa hình ảnh",
//     })
//   }

//   const copyImageTag = (tag: string) => {
//     navigator.clipboard.writeText(tag)
//     toast({
//       title: "Đã sao chép",
//       description: "Đã sao chép thẻ hình ảnh vào clipboard",
//     })
//   }

//   const insertTag = (field: keyof Question, tag: string) => {
//     setQuestion({
//       ...question,
//       [field]: question[field] + tag,
//     })
//   }

//   const insertImageTag = (field: keyof Question, imageId: string) => {
//     const image = question.images.find((img) => img.id === imageId)
//     if (image) {
//       insertTag(field, image.tag)
//     }
//   }

//   const insertOptionImageTag = (optionIndex: number, imageId: string) => {
//     const image = question.images.find((img) => img.id === imageId)
//     if (image && question.options) {
//       const updatedOptions = [...question.options]
//       updatedOptions[optionIndex] = {
//         ...updatedOptions[optionIndex],
//         content: updatedOptions[optionIndex].content + image.tag,
//       }

//       setQuestion({
//         ...question,
//         options: updatedOptions,
//       })
//     }
//   }

//   const insertLatex = (field: keyof Question, latexType: string) => {
//     let latexTemplate = ""

//     switch (latexType) {
//       case "fraction":
//         latexTemplate = "<latex>\\frac{a}{b}</latex>"
//         break
//       case "superscript":
//         latexTemplate = "<latex>a^{b}</latex>"
//         break
//       case "subscript":
//         latexTemplate = "<latex>a_{b}</latex>"
//         break
//       case "sqrt":
//         latexTemplate = "<latex>\\sqrt{a}</latex>"
//         break
//       case "square":
//         latexTemplate = "<latex>a^2</latex>"
//         break
//       case "division":
//         latexTemplate = "<latex>a \\div b</latex>"
//         break
//       default:
//         latexTemplate = "<latex></latex>"
//     }

//     insertTag(field, latexTemplate)
//   }

//   const insertLatexToOption = (optionIndex: number, latexType: string) => {
//     let latexTemplate = ""

//     switch (latexType) {
//       case "fraction":
//         latexTemplate = "<latex>\\frac{a}{b}</latex>"
//         break
//       case "superscript":
//         latexTemplate = "<latex>a^{b}</latex>"
//         break
//       case "subscript":
//         latexTemplate = "<latex>a_{b}</latex>"
//         break
//       case "sqrt":
//         latexTemplate = "<latex>\\sqrt{a}</latex>"
//         break
//       case "square":
//         latexTemplate = "<latex>a^2</latex>"
//         break
//       case "division":
//         latexTemplate = "<latex>a \\div b</latex>"
//         break
//       default:
//         latexTemplate = "<latex></latex>"
//     }

//     if (question.options) {
//       const updatedOptions = [...question.options]
//       updatedOptions[optionIndex] = {
//         ...updatedOptions[optionIndex],
//         content: updatedOptions[optionIndex].content + latexTemplate,
//       }

//       setQuestion({
//         ...question,
//         options: updatedOptions,
//       })
//     }
//   }

//   const insertFormat = (field: keyof Question, formatType: string) => {
//     let formatTemplate = ""

//     switch (formatType) {
//       case "bold":
//         formatTemplate = "<b>văn bản đậm</b>"
//         break
//       case "italic":
//         formatTemplate = "<i>văn bản nghiêng</i>"
//         break
//       case "linebreak":
//         formatTemplate = "<br>"
//         break
//       default:
//         formatTemplate = ""
//     }

//     insertTag(field, formatTemplate)
//   }

//   const insertFormatToOption = (optionIndex: number, formatType: string) => {
//     let formatTemplate = ""

//     switch (formatType) {
//       case "bold":
//         formatTemplate = "<b>văn bản đậm</b>"
//         break
//       case "italic":
//         formatTemplate = "<i>văn bản nghiêng</i>"
//         break
//       case "linebreak":
//         formatTemplate = "<br>"
//         break
//       default:
//         formatTemplate = ""
//     }

//     if (question.options) {
//       const updatedOptions = [...question.options]
//       updatedOptions[optionIndex] = {
//         ...updatedOptions[optionIndex],
//         content: updatedOptions[optionIndex].content + formatTemplate,
//       }

//       setQuestion({
//         ...question,
//         options: updatedOptions,
//       })
//     }
//   }

//   const handleSave = async () => {
//     setIsSubmitting(true)

//     try {
//       // In a real application, you would:
//       // 1. Upload images and get their permanent URLs
//       // 2. Submit the question data to your
//       // 1. Upload images and get their permanent URLs
//       // 2. Submit the question data to your API

//       // For now, we'll just simulate success
//       await new Promise((resolve) => setTimeout(resolve, 1000))

//       toast({
//         title: "Thành công",
//         description: "Đã cập nhật câu hỏi",
//         variant: "default",
//       })

//       // Return to exercise edit
//       router.push(`/dashboard/exercises/edit/${exerciseId}`)
//     } catch (error) {
//       console.error("Error updating question:", error)
//       toast({
//         title: "Lỗi",
//         description: "Không thể cập nhật câu hỏi. Vui lòng thử lại.",
//         variant: "destructive",
//       })
//     } finally {
//       setIsSubmitting(false)
//     }
//   }

//   const handleExit = () => {
//     if (JSON.stringify(question) !== JSON.stringify(originalQuestion)) {
//       setIsExitDialogOpen(true)
//     } else {
//       router.push(`/dashboard/exercises/edit/${exerciseId}`)
//     }
//   }

//   const renderContentPreview = (content: string) => {
//     // First, replace image tags with actual images
//     let html = content.replace(/<img src="(.*?)"><\/img>/g, (match, imageName) => {
//       const image = question.images.find((img) => img.name === imageName)
//       if (image) {
//         return `<img src="${image.url}" alt="${image.name}" class="max-h-40 object-contain my-2" />`
//       }
//       return match
//     })

//     // Then, replace LaTeX with rendered HTML
//     html = html.replace(/<latex>(.*?)<\/latex>/g, (match, latex) => {
//       // Here we'd ideally use a proper LaTeX renderer like KaTeX
//       // For now, we'll style it differently to simulate proper rendering

//       // Some basic replacements for common math notations
//       let renderedLatex = latex

//       // Fractions
//       if (latex.includes("\\frac")) {
//         renderedLatex = latex.replace(
//           /\\frac\{(.*?)\}\{(.*?)\}/g,
//           '<span class="inline-block text-center"><span class="block border-b border-black">$1</span><span class="block">$2</span></span>',
//         )
//       }

//       // Superscripts
//       if (latex.includes("^")) {
//         renderedLatex = latex.replace(/(\w+)\^\{(.*?)\}/g, "$1<sup>$2</sup>")
//       }

//       // Subscripts
//       if (latex.includes("_")) {
//         renderedLatex = latex.replace(/(\w+)_\{(.*?)\}/g, "$1<sub>$2</sub>")
//       }

//       // Square root
//       if (latex.includes("\\sqrt")) {
//         renderedLatex = latex.replace(/\\sqrt\{(.*?)\}/g, "√($1)")
//       }

//       // Division
//       if (latex.includes("\\div")) {
//         renderedLatex = latex.replace(/\\div/g, "÷")
//       }

//       return `<span class="bg-blue-100 px-2 py-1 rounded font-medium">${renderedLatex}</span>`
//     })

//     return html
//   }

//   if (isLoading) {
//     return (
//       <div className="flex items-center justify-center h-[50vh]">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
//           <p className="mt-2">Đang tải...</p>
//         </div>
//       </div>
//     )
//   }

//   return (
//     <div className="space-y-6">
//       <div className="flex items-center justify-between bg-card p-4 rounded-lg shadow-sm sticky top-0 z-10">
//         <div className="flex items-center gap-2">
//           <Button variant="outline" size="icon" onClick={handleExit}>
//             <ChevronLeft className="h-4 w-4" />
//           </Button>
//           <h1 className="text-3xl font-bold">Chỉnh sửa câu hỏi</h1>
//         </div>
//         <Button onClick={handleSave} disabled={isSubmitting}>
//           <Save className="h-4 w-4 mr-2" />
//           {isSubmitting ? "Đang lưu..." : "Lưu thay đổi"}
//         </Button>
//       </div>

//       <div className="space-y-6">
//         {/* Question Content Section */}
//         <Card className="border-primary/20 shadow-md overflow-hidden">
//           <CardHeader
//             className="bg-blue-50 cursor-pointer flex flex-row items-center"
//             onClick={() => toggleSection("content")}
//           >
//             <div className="flex-1">
//               <CardTitle className="text-blue-700">Nội dung câu hỏi</CardTitle>
//               <CardDescription>Chỉnh sửa nội dung và loại câu hỏi</CardDescription>
//             </div>
//             <Badge variant={openSections.content ? "secondary" : "outline"}>
//               {openSections.content ? "Đang mở" : "Đã đóng"}
//             </Badge>
//           </CardHeader>

//           {openSections.content && (
//             <CardContent className="p-6 space-y-6">
//               <div className="grid gap-4">
//                 <div className="grid gap-2">
//                   <Label className="text-base font-semibold">Loại câu hỏi</Label>
//                   <Select
//                     value={question.question_type}
//                     onValueChange={(value: "MULTIPLE_CHOICE" | "FILL_IN_THE_BLANK") => handleQuestionTypeChange(value)}
//                   >
//                     <SelectTrigger className="border-input/60">
//                       <SelectValue />
//                     </SelectTrigger>
//                     <SelectContent>
//                       <SelectItem value="MULTIPLE_CHOICE">Trắc nghiệm</SelectItem>
//                       <SelectItem value="FILL_IN_THE_BLANK">Điền vào chỗ trống</SelectItem>
//                     </SelectContent>
//                   </Select>
//                 </div>

//                 <div className="grid gap-2">
//                   <Label className="text-base font-semibold">Nội dung câu hỏi</Label>
//                   <div className="flex flex-wrap gap-1 mb-2 p-2 bg-gray-50 rounded-md">
//                     <Button
//                       type="button"
//                       variant="outline"
//                       size="sm"
//                       onClick={() => insertLatex("content", "fraction")}
//                     >
//                       <Divide className="h-4 w-4 mr-1" /> Phân số
//                     </Button>
//                     <Button
//                       type="button"
//                       variant="outline"
//                       size="sm"
//                       onClick={() => insertLatex("content", "superscript")}
//                     >
//                       <Superscript className="h-4 w-4 mr-1" /> Số mũ
//                     </Button>
//                     <Button
//                       type="button"
//                       variant="outline"
//                       size="sm"
//                       onClick={() => insertLatex("content", "subscript")}
//                     >
//                       <Subscript className="h-4 w-4 mr-1" /> Chỉ số
//                     </Button>
//                     <Button type="button" variant="outline" size="sm" onClick={() => insertLatex("content", "sqrt")}>
//                       <Square className="h-4 w-4 mr-1" /> Căn bậc hai
//                     </Button>
//                     <Button type="button" variant="outline" size="sm" onClick={() => insertFormat("content", "bold")}>
//                       <Bold className="h-4 w-4 mr-1" /> Đậm
//                     </Button>
//                     <Button type="button" variant="outline" size="sm" onClick={() => insertFormat("content", "italic")}>
//                       <Italic className="h-4 w-4 mr-1" /> Nghiêng
//                     </Button>
//                     <Button
//                       type="button"
//                       variant="outline"
//                       size="sm"
//                       onClick={() => insertFormat("content", "linebreak")}
//                     >
//                       <Plus className="h-4 w-4 mr-1" /> Xuống dòng
//                     </Button>
//                     <Button type="button" variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>
//                       <ImageIcon className="h-4 w-4 mr-1" /> Tải ảnh
//                     </Button>
//                     <Input
//                       type="file"
//                       ref={fileInputRef}
//                       className="hidden"
//                       accept="image/*"
//                       onChange={handleImageUpload}
//                     />
//                   </div>

//                   <Tabs value={contentTab} onValueChange={setContentTab} className="w-full">
//                     <TabsList className="grid w-full grid-cols-3">
//                       <TabsTrigger value="edit">Chỉnh sửa</TabsTrigger>
//                       <TabsTrigger value="preview">Xem trước</TabsTrigger>
//                       <TabsTrigger value="images">Hình ảnh ({question.images.length})</TabsTrigger>
//                     </TabsList>

//                     <TabsContent value="edit">
//                       <Textarea
//                         value={question.content}
//                         onChange={(e) => handleContentChange("content", e.target.value)}
//                         placeholder="Nhập nội dung câu hỏi..."
//                         rows={4}
//                         className="font-mono border-input/60"
//                       />
//                     </TabsContent>

//                     <TabsContent value="preview">
//                       <div
//                         className="p-4 border rounded-md min-h-[100px] prose max-w-none"
//                         dangerouslySetInnerHTML={{ __html: renderContentPreview(question.content) }}
//                       />
//                     </TabsContent>

//                     <TabsContent value="images">
//                       {question.images.length === 0 ? (
//                         <div className="p-4 border rounded-md min-h-[100px] flex items-center justify-center">
//                           <div className="text-center">
//                             <ImageIcon className="h-10 w-10 text-muted-foreground/70 mx-auto mb-2" />
//                             <p className="text-muted-foreground">Chưa có hình ảnh nào</p>
//                             <Button variant="outline" className="mt-2" onClick={() => fileInputRef.current?.click()}>
//                               <ImageIcon className="h-4 w-4 mr-1" /> Tải lên hình ảnh
//                             </Button>
//                           </div>
//                         </div>
//                       ) : (
//                         <div className="p-4 border rounded-md min-h-[100px]">
//                           <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//                             {question.images.map((image) => (
//                               <div key={image.id} className="border rounded-md p-3 space-y-2 bg-white shadow-sm">
//                                 <div className="relative h-24 w-full bg-muted/20 rounded-md overflow-hidden">
//                                   <img
//                                     src={image.url || "/placeholder.svg"}
//                                     alt={image.name}
//                                     className="absolute inset-0 h-full w-full object-contain"
//                                   />
//                                 </div>
//                                 <div className="text-xs truncate font-medium">{image.name}</div>
//                                 <div className="text-xs bg-gray-100 p-1 rounded font-mono break-all">{image.tag}</div>
//                                 <div className="flex justify-between gap-2">
//                                   <Button
//                                     variant="secondary"
//                                     size="sm"
//                                     className="text-xs h-7 flex-1"
//                                     onClick={() => insertImageTag("content", image.id)}
//                                   >
//                                     Chèn
//                                   </Button>
//                                   <Button
//                                     variant="outline"
//                                     size="sm"
//                                     className="text-xs h-7 w-7 p-0"
//                                     onClick={() => copyImageTag(image.tag)}
//                                   >
//                                     <Copy className="h-3 w-3" />
//                                   </Button>
//                                   <Button
//                                     variant="outline"
//                                     size="sm"
//                                     className="text-xs h-7 flex-1 text-red-500"
//                                     onClick={() => handleDeleteImage(image.id)}
//                                   >
//                                     Xóa
//                                   </Button>
//                                 </div>
//                               </div>
//                             ))}
//                           </div>
//                         </div>
//                       )}
//                     </TabsContent>
//                   </Tabs>
//                 </div>
//               </div>
//             </CardContent>
//           )}
//         </Card>

//         {/* Multiple Choice Options */}
//         {question.question_type === "MULTIPLE_CHOICE" && question.options && (
//           <Card className="border-green-100 shadow-md overflow-hidden">
//             <CardHeader
//               className="bg-green-50 cursor-pointer flex flex-row items-center"
//               onClick={() => toggleSection("options")}
//             >
//               <div className="flex-1">
//                 <CardTitle className="text-green-700">Các lựa chọn</CardTitle>
//                 <CardDescription>Quản lý các lựa chọn cho câu hỏi trắc nghiệm</CardDescription>
//               </div>
//               <Badge variant={openSections.options ? "secondary" : "outline"}>
//                 {openSections.options ? "Đang mở" : "Đã đóng"}
//               </Badge>
//             </CardHeader>

//             {openSections.options && (
//               <CardContent className="p-6 space-y-6">
//                 <div className="flex justify-between items-center">
//                   <Label className="text-base font-semibold">Danh sách lựa chọn</Label>
//                   <Button type="button" variant="outline" size="sm" onClick={handleAddOption}>
//                     <Plus className="h-4 w-4 mr-1" /> Thêm lựa chọn
//                   </Button>
//                 </div>

//                 <RadioGroup
//                   value={question.options.findIndex((opt) => opt.is_correct).toString()}
//                   onValueChange={(value) => {
//                     const optionIndex = Number.parseInt(value)
//                     handleOptionChange(optionIndex, "is_correct", true)
//                   }}
//                   className="space-y-4"
//                 >
//                   {question.options.map((option, optionIndex) => (
//                     <div
//                       key={optionIndex}
//                       className={`p-4 rounded-lg border ${
//                         option.is_correct ? "border-green-500 bg-green-50/70" : "border-muted"
//                       }`}
//                     >
//                       <div className="flex justify-between items-start mb-2">
//                         <div className="flex items-center gap-2">
//                           <RadioGroupItem
//                             value={optionIndex.toString()}
//                             id={`option-${optionIndex}`}
//                             className="text-green-600"
//                           />
//                           <Label
//                             htmlFor={`option-${optionIndex}`}
//                             className={`font-medium ${option.is_correct ? "text-green-700" : "text-muted-foreground"}`}
//                           >
//                             Lựa chọn {option.ordinal_number}{" "}
//                             {option.is_correct && (
//                               <span className="text-green-600 ml-2">
//                                 <Check className="h-4 w-4 inline" /> Đáp án đúng
//                               </span>
//                             )}
//                           </Label>
//                         </div>
//                         <Button
//                           type="button"
//                           variant="ghost"
//                           size="sm"
//                           onClick={() => handleRemoveOption(optionIndex)}
//                           className="text-red-500 hover:text-red-700"
//                           disabled={question.options.length <= 2}
//                         >
//                           Xóa
//                         </Button>
//                       </div>

//                       <div className="ml-6">
//                         <Accordion type="single" collapsible className="w-full">
//                           <AccordionItem value="edit" className="border-none">
//                             <AccordionTrigger className="py-2">Chỉnh sửa nội dung</AccordionTrigger>
//                             <AccordionContent>
//                               <div className="flex flex-wrap gap-1 mb-2 p-2 bg-gray-50 rounded-md">
//                                 <Button
//                                   type="button"
//                                   variant="outline"
//                                   size="sm"
//                                   onClick={() => insertLatexToOption(optionIndex, "fraction")}
//                                 >
//                                   <Divide className="h-4 w-4 mr-1" /> Phân số
//                                 </Button>
//                                 <Button
//                                   type="button"
//                                   variant="outline"
//                                   size="sm"
//                                   onClick={() => insertFormatToOption(optionIndex, "bold")}
//                                 >
//                                   <Bold className="h-4 w-4 mr-1" /> Đậm
//                                 </Button>
//                                 <Button
//                                   type="button"
//                                   variant="outline"
//                                   size="sm"
//                                   onClick={() => insertFormatToOption(optionIndex, "italic")}
//                                 >
//                                   <Italic className="h-4 w-4 mr-1" /> Nghiêng
//                                 </Button>
//                                 {question.images.length > 0 && (
//                                   <select
//                                     className="h-8 px-2 rounded text-sm border border-input"
//                                     onChange={(e) => {
//                                       if (e.target.value) {
//                                         insertOptionImageTag(optionIndex, e.target.value)
//                                         e.target.value = ""
//                                       }
//                                     }}
//                                   >
//                                     <option value="">Chèn hình ảnh</option>
//                                     {question.images.map((img) => (
//                                       <option key={img.id} value={img.id}>
//                                         {img.name}
//                                       </option>
//                                     ))}
//                                   </select>
//                                 )}
//                               </div>

//                               <Tabs defaultValue="edit" className="w-full">
//                                 <TabsList className="grid w-full grid-cols-2">
//                                   <TabsTrigger value="edit">Chỉnh sửa</TabsTrigger>
//                                   <TabsTrigger value="preview">Xem trước</TabsTrigger>
//                                 </TabsList>
//                                 <TabsContent value="edit">
//                                   <Textarea
//                                     value={option.content}
//                                     onChange={(e) => handleOptionChange(optionIndex, "content", e.target.value)}
//                                     placeholder="Nhập nội dung lựa chọn..."
//                                     rows={2}
//                                     className="font-mono border-input/60"
//                                   />
//                                 </TabsContent>
//                                 <TabsContent value="preview">
//                                   <div
//                                     className="p-2 border rounded-md min-h-[50px] prose max-w-none"
//                                     dangerouslySetInnerHTML={{
//                                       __html: renderContentPreview(option.content),
//                                     }}
//                                   />
//                                 </TabsContent>
//                               </Tabs>
//                             </AccordionContent>
//                           </AccordionItem>
//                         </Accordion>
//                       </div>
//                     </div>
//                   ))}
//                 </RadioGroup>
//               </CardContent>
//             )}
//           </Card>
//         )}

//         {/* Fill in the Blank Answer */}
//         {question.question_type === "FILL_IN_THE_BLANK" && (
//           <Card className="border-green-100 shadow-md overflow-hidden">
//             <CardHeader className="bg-green-50">
//               <CardTitle className="text-green-700">Đáp án</CardTitle>
//               <CardDescription>Đáp án cho câu hỏi điền vào chỗ trống</CardDescription>
//             </CardHeader>
//             <CardContent className="p-6">
//               <div className="grid gap-2">
//                 <Label>Đáp án đúng</Label>
//                 <Input
//                   value={question.blank_answer || ""}
//                   onChange={(e) => handleContentChange("blank_answer", e.target.value)}
//                   placeholder="Nhập đáp án cho câu hỏi điền vào chỗ trống"
//                   className="border-input/60"
//                 />
//               </div>
//             </CardContent>
//           </Card>
//         )}

//         {/* Solution */}
//         <Card className="border-primary/20 shadow-md overflow-hidden">
//           <CardHeader
//             className="bg-purple-50 cursor-pointer flex flex-row items-center"
//             onClick={() => toggleSection("solution")}
//           >
//             <div className="flex-1">
//               <CardTitle className="text-purple-700">Lời giải</CardTitle>
//               <CardDescription>Giải thích chi tiết cho câu hỏi</CardDescription>
//             </div>
//             <Badge variant={openSections.solution ? "secondary" : "outline"}>
//               {openSections.solution ? "Đang mở" : "Đã đóng"}
//             </Badge>
//           </CardHeader>

//           {openSections.solution && (
//             <CardContent className="p-6 space-y-4">
//               <div className="flex flex-wrap gap-1 mb-2 p-2 bg-gray-50 rounded-md">
//                 <Button type="button" variant="outline" size="sm" onClick={() => insertLatex("solution", "fraction")}>
//                   <Divide className="h-4 w-4 mr-1" /> Phân số
//                 </Button>
//                 <Button
//                   type="button"
//                   variant="outline"
//                   size="sm"
//                   onClick={() => insertLatex("solution", "superscript")}
//                 >
//                   <Superscript className="h-4 w-4 mr-1" /> Số mũ
//                 </Button>
//                 <Button type="button" variant="outline" size="sm" onClick={() => insertLatex("solution", "subscript")}>
//                   <Subscript className="h-4 w-4 mr-1" /> Chỉ số
//                 </Button>
//                 <Button type="button" variant="outline" size="sm" onClick={() => insertLatex("solution", "sqrt")}>
//                   <Square className="h-4 w-4 mr-1" /> Căn bậc hai
//                 </Button>
//                 <Button type="button" variant="outline" size="sm" onClick={() => insertFormat("solution", "bold")}>
//                   <Bold className="h-4 w-4 mr-1" /> Đậm
//                 </Button>
//                 <Button type="button" variant="outline" size="sm" onClick={() => insertFormat("solution", "italic")}>
//                   <Italic className="h-4 w-4 mr-1" /> Nghiêng
//                 </Button>
//                 <Button type="button" variant="outline" size="sm" onClick={() => insertFormat("solution", "linebreak")}>
//                   <Plus className="h-4 w-4 mr-1" /> Xuống dòng
//                 </Button>
//                 {question.images.length > 0 && (
//                   <select
//                     className="h-8 px-2 rounded text-sm border border-input"
//                     onChange={(e) => {
//                       if (e.target.value) {
//                         insertImageTag("solution", e.target.value)
//                         e.target.value = ""
//                       }
//                     }}
//                   >
//                     <option value="">Chèn hình ảnh</option>
//                     {question.images.map((img) => (
//                       <option key={img.id} value={img.id}>
//                         {img.name}
//                       </option>
//                     ))}
//                   </select>
//                 )}
//               </div>

//               <Tabs value={solutionTab} onValueChange={setSolutionTab} className="w-full">
//                 <TabsList className="grid w-full grid-cols-2">
//                   <TabsTrigger value="edit">Chỉnh sửa</TabsTrigger>
//                   <TabsTrigger value="preview">Xem trước</TabsTrigger>
//                 </TabsList>
//                 <TabsContent value="edit">
//                   <Textarea
//                     value={question.solution}
//                     onChange={(e) => handleContentChange("solution", e.target.value)}
//                     placeholder="Nhập lời giải cho câu hỏi..."
//                     rows={4}
//                     className="font-mono border-input/60"
//                   />
//                 </TabsContent>
//                 <TabsContent value="preview">
//                   <div
//                     className="p-4 border rounded-md min-h-[100px] prose max-w-none"
//                     dangerouslySetInnerHTML={{ __html: renderContentPreview(question.solution) }}
//                   />
//                 </TabsContent>
//               </Tabs>
//             </CardContent>
//           )}
//         </Card>

//         {/* Hints and Terms */}
//         <Card className="border-primary/20 shadow-md overflow-hidden">
//           <CardHeader
//             className="bg-yellow-50 cursor-pointer flex flex-row items-center"
//             onClick={() => toggleSection("hints")}
//           >
//             <div className="flex-1">
//               <CardTitle className="text-yellow-700">Gợi ý và Thuật ngữ</CardTitle>
//               <CardDescription>Thông tin bổ sung cho câu hỏi</CardDescription>
//             </div>
//             <Badge variant={openSections.hints ? "secondary" : "outline"}>
//               {openSections.hints ? "Đang mở" : "Đã đóng"}
//             </Badge>
//           </CardHeader>

//           {openSections.hints && (
//             <CardContent className="p-6 space-y-6">
//               <div className="grid gap-4">
//                 <div className="grid gap-2">
//                   <Label className="text-base font-semibold">Gợi ý</Label>
//                   <Textarea
//                     value={question.guide}
//                     onChange={(e) => handleContentChange("guide", e.target.value)}
//                     placeholder="Nhập gợi ý cho câu hỏi..."
//                     rows={2}
//                     className="border-input/60"
//                   />
//                 </div>

//                 <div className="grid gap-2">
//                   <Label className="text-base font-semibold">Thuật ngữ</Label>
//                   <Input
//                     value={question.terms.join(", ")}
//                     onChange={(e) => handleTermsChange(e.target.value)}
//                     placeholder="Nhập các thuật ngữ, phân cách bằng dấu phẩy"
//                     className="border-input/60"
//                   />
//                 </div>
//               </div>
//             </CardContent>
//           )}
//         </Card>
//       </div>

//       <div className="flex justify-end gap-2 sticky bottom-4 bg-white p-4 rounded-lg shadow-md border">
//         <Button type="button" variant="outline" onClick={handleExit}>
//           Hủy
//         </Button>
//         <Button onClick={handleSave} disabled={isSubmitting}>
//           {isSubmitting ? "Đang lưu..." : "Lưu thay đổi"}
//         </Button>
//       </div>

//       <AlertDialog open={isExitDialogOpen} onOpenChange={setIsExitDialogOpen}>
//         <AlertDialogContent>
//           <AlertDialogHeader>
//             <AlertDialogTitle>Xác nhận hủy</AlertDialogTitle>
//             <AlertDialogDescription>
//               Bạn có chắc chắn muốn hủy? Tất cả thay đổi sẽ bị mất và không thể khôi phục.
//             </AlertDialogDescription>
//           </AlertDialogHeader>
//           <AlertDialogFooter>
//             <AlertDialogCancel>Tiếp tục chỉnh sửa</AlertDialogCancel>
//             <AlertDialogAction onClick={() => router.push(`/dashboard/exercises/edit/${exerciseId}`)}>
//               Hủy và thoát
//             </AlertDialogAction>
//           </AlertDialogFooter>
//         </AlertDialogContent>
//       </AlertDialog>
//     </div>
//   )
// }
