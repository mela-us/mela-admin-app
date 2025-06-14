"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChevronLeft, Save, Loader2, X } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import type { Level, Topic, Lecture, Section, PresignedUrlResponse } from "@/types/lecture"
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
import SectionList from "./section-list"

interface Props {
  mode: "add" | "edit"
  initialData?: Lecture
  levels: Level[]
  topics: Topic[]
}

export default function LectureForm({ mode, initialData, levels, topics }: Props) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isExitDialogOpen, setIsExitDialogOpen] = useState(false)
  const [totalUploads, setTotalUploads] = useState(0)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [completedUploads, setCompletedUploads] = useState(0)
  const [formData, setFormData] = useState<{
    name: string
    levelId: string
    topicId: string
    ordinalNumber: number
    description: string
    sections: Section[]
  }>({
    name: "",
    levelId: "",
    topicId: "",
    ordinalNumber: 1,
    description: "",
    sections: [],
  })
  const [originalFormData, setOriginalFormData] = useState<any>(null)

  // Reset form when component mounts
  useEffect(() => {
    if (mode === "edit" && initialData) {
      setFormData({
        name: initialData.name,
        levelId: initialData.levelId,
        topicId: initialData.topicId,
        ordinalNumber: initialData.ordinalNumber,
        description: initialData.description,
        sections: initialData.sections.map((section) => ({
          ...section,
          fileName: section.url ? section.url.split('/').pop() : "",
          file: null,
          isNewFile: false,
          uploadProgress: undefined,
        })),
      })
      setOriginalFormData(
        JSON.parse(
          JSON.stringify({
            name: initialData.name,
            levelId: initialData.levelId,
            topicId: initialData.topicId,
            ordinalNumber: initialData.ordinalNumber,
            description: initialData.description,
            sections: initialData.sections.map((section) => ({
              ...section,
              fileName: section.url ? section.url.split('/').pop() : "",
              file: null,
              isNewFile: false,
              uploadProgress: undefined,
            })),
          }),
        ),
      )
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
        levelId: "",
        topicId: "",
        ordinalNumber: 1,
        description: "",
        sections: [],
      })
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleSectionChange = (sections: Section[]) => {
    setFormData({
      ...formData,
      sections,
    })
  }

  // Function to extract image URLs from content
  // const extractImageUrls = (content: string | null): string[] => {
  //   if (!content) return []
  //   const imgRegex = /<img src='([^']+)'>/g
  //   const urls: string[] = []
  //   let match
  //   while ((match = imgRegex.exec(content)) !== null) {
  //     urls.push(match[1])
  //   }
  //   return urls
  // }

  // Function to get presigned URL for file upload
  const getPresignedUrl = async (fileName: string, contentType: string): Promise<PresignedUrlResponse> => {
    try {
      const response = await fetch("/api/upload/presigned", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ fileName, contentType }),
      })

      if (!response.ok) {
        throw new Error("Failed to get presigned URL")
      }

      return await response.json()
    } catch (error) {
      console.error("Error getting presigned URL:", error)
      throw error
    }
  }

  // Function to upload file using presigned URL
  const uploadFileWithPresignedUrl = async (presignedUrl: string, file: File): Promise<void> => {
    try {
      // In a real implementation, you would upload the file to the presigned URL
      // For now, we'll just simulate it
      console.log(`Uploading file ${file.name} to ${presignedUrl}`)

      // Simulate upload delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      console.log(`File ${file.name} uploaded successfully`)

      // Update progress
      setCompletedUploads((prev) => {
        const newCompleted = prev + 1
        setUploadProgress(Math.round((newCompleted / totalUploads) * 100))
        return newCompleted
      })
    } catch (error) {
      console.error("Error uploading file:", error)
      throw error
    }
  }

  const validateForm = () => {
    if (!formData.name.trim()) {
      toast({
        title: "Lỗi",
        description: "Vui lòng nhập tên bài học",
        variant: "error",
      })
      return false
    }

    if (!formData.levelId) {
      toast({
        title: "Lỗi",
        description: "Vui lòng chọn cấp độ",
        variant: "error",
      })
      return false
    }

    if (!formData.topicId) {
      toast({
        title: "Lỗi",
        description: "Vui lòng chọn chủ đề",
        variant: "error",
      })
      return false
    }

    if (formData.sections.length === 0) {
      toast({
        title: "Lỗi",
        description: "Vui lòng thêm ít nhất một section",
        variant: "error",
      })
      return false
    }

    // Validate each section
    for (const section of formData.sections) {
      if (!section.name.trim()) {
        toast({
          title: "Lỗi",
          description: "Vui lòng nhập tên cho tất cả các section",
          variant: "error",
        })
        return false
      }

      if (section.sectionType === "PDF" && !section.url) {
        toast({
          title: "Lỗi",
          description: `Vui lòng tải lên tệp PDF cho phần "${section.name}"`,
          variant: "error",
        })
        return false
      }
    }

    return true
  }

  const handleSubmit = async () => {
    // Validate form
    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    try {
      // Count total uploads needed
      let uploads = 0

      // Count PDF files
      uploads += formData.sections.filter((s) => s.sectionType === "PDF" && s.file && s.isNewFile).length

      setTotalUploads(uploads)
      setCompletedUploads(0)
      setUploadProgress(0)

      // Process all sections to upload files and update content
      const processedSections = [...formData.sections]

      for (let i = 0; i < processedSections.length; i++) {
        const section = processedSections[i]

        // Handle PDF files
        if (section.sectionType === "PDF" && section.file && section.isNewFile) {
          const fileName = `lectures/pdfs/${Date.now()}-${section.file.name}`

          // Get presigned URL
          console.log(`Getting presigned URL for ${fileName}`)
          const { presignedUrl, fileUrl } = await getPresignedUrl(fileName, section.file.type)
          // Upload file
          await uploadFileWithPresignedUrl(presignedUrl, section.file)

          // Update section with new URL
          processedSections[i] = {
            ...section,
            url: fileUrl,
            file: null,
            isNewFile: false,
          }
        }
      }

      // Now save the lecture with processed sections
      const url = mode === "add" ? "/api/lectures" : `/api/lectures/${initialData?.lectureId}`
      const method = mode === "add" ? "POST" : "PUT"

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          sections: processedSections.map((section) => ({
            ordinalNumber: section.ordinalNumber,
            name: section.name,
            sectionType: section.sectionType,
            content: section.content,
            url: section.url
          })),
        }),
      })

      if (!response.ok) {
        throw new Error(`Failed to ${mode} lecture`)
      }

      toast({
        title: "Thành công",
        description: mode === "add" ? "Đã thêm bài học mới" : "Đã cập nhật bài học",
        variant: "success",
      })

      router.push("/lectures")
      router.refresh()
    } catch (error) {
      console.error(`Error ${mode === "add" ? "adding" : "updating"} lecture:`, error)
      toast({
        title: "Lỗi",
        description: `Không thể ${mode === "add" ? "thêm" : "cập nhật"} bài học. Vui lòng thử lại.`,
        variant: "error",
      })
    } finally {
      setIsSubmitting(false)
      setUploadProgress(0)
    }
  }

  const handleExit = () => {
    const hasChanges =
      mode === "edit"
        ? JSON.stringify(formData) !== JSON.stringify(originalFormData)
        : formData.name ||
        formData.description ||
        formData.levelId ||
        formData.topicId ||
        formData.sections.length > 0

    if (hasChanges) {
      setIsExitDialogOpen(true)
    } else {
      router.push("/lectures")
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-10">
        {/* Back button */}
        <Button
          onClick={handleExit}
          size="sm"
          variant="ghost"
          className="group flex items-center gap-1 border border-indigo-300 bg-white hover:bg-indigo-50 text-indigo-600 px-3 py-1 rounded-md transition-all"
        >
          <ChevronLeft className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform duration-200" />
        </Button>
        {/* Title */}
        <h2 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-indigo-700 to-blue-500 bg-clip-text text-transparent ml-2">
          {mode === "add" ? "Thêm bài học mới" : "Chỉnh sửa bài học"}
        </h2>
      </div>

      {/* Lecture Details */}
      <div className="space-y-8">
        <Card className="border-indigo-200 shadow-lg bg-gradient-to-b from-white to-indigo-50/20">
          <CardHeader className="bg-indigo-200/50 border-b border-indigo-200">
            <CardTitle className="text-xl font-bold text-gray-700/90">Thông tin bài học</CardTitle>
            <CardDescription className="text-gray-700/80">
              {mode === "add" ? "Nhập thông tin cơ bản của bài học" : "Chỉnh sửa thông tin cơ bản của bài học"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
            {/* Lecture Name */}
            <div className="grid gap-2">
              <Label htmlFor="name" className="text-sm font-semibold text-indigo-900">
                Tên bài học
              </Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Nhập tên bài học"
                className="border-indigo-300 bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 rounded-md px-4 py-2 text-indigo-900 placeholder-indigo-400/70 transition-all duration-200"
              />
            </div>

            {/* Level, Topic, Ordinal Number - Single Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Level */}
              <div className="grid gap-2">
                <Label htmlFor="levelId" className="text-sm font-semibold text-indigo-900">
                  Cấp độ
                </Label>
                <Select value={formData.levelId} onValueChange={(value) => handleSelectChange("levelId", value)}>
                  <SelectTrigger className="border-indigo-300 bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 rounded-md text-indigo-900">
                    <SelectValue placeholder="Chọn cấp độ" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-indigo-200">
                    <SelectItem value="level_default" className="text-indigo-900 hover:bg-indigo-50">Chọn cấp độ</SelectItem>
                    {levels
                      .filter((level) => level.levelId !== "null")
                      .map((level) => (
                        <SelectItem key={level.levelId} value={level.levelId} className="text-indigo-900 hover:bg-indigo-50">
                          {level.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Topic */}
              <div className="grid gap-2">
                <Label htmlFor="topicId" className="text-sm font-semibold text-indigo-900">
                  Chủ đề
                </Label>
                <Select value={formData.topicId} onValueChange={(value) => handleSelectChange("topicId", value)}>
                  <SelectTrigger className="border-indigo-300 bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 rounded-md text-indigo-900">
                    <SelectValue placeholder="Chọn chủ đề" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-indigo-200">
                    <SelectItem value="topic_default" className="text-indigo-900 hover:bg-indigo-50">Chọn chủ đề</SelectItem>
                    {topics
                      .filter((topic) => topic.topicId !== "null")
                      .map((topic) => (
                        <SelectItem key={topic.topicId} value={topic.topicId} className="text-indigo-900 hover:bg-indigo-50">
                          {topic.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Ordinal Number */}
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
                  required
                />
              </div>
            </div>

            {/* Description - Full Row */}
            <div className="grid gap-2">
              <Label htmlFor="description" className="text-sm font-semibold text-indigo-900">
                Mô tả
              </Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Nhập mô tả bài học"
                className="border-indigo-300 bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 rounded-md px-4 py-2 text-indigo-900 placeholder-indigo-400/70 transition-all duration-200"
                rows={2}
              />
            </div>
          </CardContent>
        </Card>

        <SectionList sections={formData.sections} onChange={handleSectionChange} />

        <div className="flex justify-end gap-3 mt-6">
          {/* Nút Hủy với hiệu ứng hover mềm mại */}
          <Button
            type="button"
            variant="outline"
            onClick={handleExit}
            className="px-5 py-2 border-2 border-gray-300 hover:bg-gray-100 transition-colors duration-200 font-medium rounded-lg focus:ring-2 focus:ring-gray-300 focus:ring-offset-2"
          >
            <X className="mr-2 h-4 w-4" />
            Hủy
          </Button>

          {/* Nút Lưu với gradient và hiệu ứng loading */}
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
              className={`px-5 py-2 rounded-lg font-medium shadow-md transition-all duration-200
                  ${isSubmitting ? 'bg-indigo-500' : 'bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700'}
                  text-white focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-80`}
          >
            {isSubmitting ? (
              <div className="flex items-center">
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                <span>
                  {uploadProgress > 0
                    ? "Đang tải lên..."
                    : "Đang lưu..."}
                </span>
              </div>
            ) : (
              <div className="flex items-center">
                <Save className="mr-2 h-5 w-5" />
                <span>{mode === "add" ? "Lưu bài học" : "Lưu thay đổi"}</span>
              </div>
            )}
          </Button>
        </div>
      </div>

      <AlertDialog open={isExitDialogOpen} onOpenChange={setIsExitDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận hủy</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn hủy? {mode === "add" ? "Tất cả thông tin đã nhập" : "Tất cả thay đổi"} sẽ bị mất và
              không thể khôi phục.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Tiếp tục chỉnh sửa</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                resetForm()
                router.push("/lectures")
              }}
            >
              Hủy và thoát
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
