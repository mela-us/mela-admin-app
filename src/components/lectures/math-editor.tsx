"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ImageIcon, FileText, Plus, Trash2 } from "lucide-react"
import type { UploadedImage } from "@/types/lecture"
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

interface MathEditorProps {
  initialValue: string
  onChange: (value: string) => void
  placeholder?: string
  height?: string
}

export default function MathEditor({
  initialValue = "",
  onChange,
  placeholder = "Nhập nội dung...",
  height = "200px",
}: MathEditorProps) {
  const [content, setContent] = useState(initialValue)
  const [previewHtml, setPreviewHtml] = useState("")
  const [selectedTab, setSelectedTab] = useState("edit")
  const [tempImages, setTempImages] = useState<UploadedImage[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    // Parse the initial content and load any images
    const imgRegex = /<img src='([^']+)'>/g
    let match
    const newTempImages = [...tempImages]

    while ((match = imgRegex.exec(initialValue)) !== null) {
      const imgSrc = match[1]
      // Only add if not already in tempImages
      if (!tempImages.some((img) => img.url === imgSrc)) {
        newTempImages.push({
          id: `img-${Date.now()}-${newTempImages.length}`,
          file: new File([], "placeholder.jpg"), // Placeholder file
          url: imgSrc,
          isNew: false,
        })
      }
    }

    if (newTempImages.length !== tempImages.length) {
      setTempImages(newTempImages)
    }

    // Generate preview HTML
    generatePreviewHtml(initialValue)
  }, [initialValue])

  const generatePreviewHtml = (text: string) => {
    // Replace LaTeX with rendered HTML
    const html = text
      .replace(/<latex>(.*?)<\/latex>/g, (match, latex) => {
        // In a real implementation, you would use a LaTeX renderer like KaTeX or MathJax
        // For now, we'll just style it differently
        return `<span class="bg-blue-100 px-1 rounded">${latex}</span>`
      })
      .replace(/<br>/g, "<br/>") // Ensure proper line breaks

    // Keep image tags as they are
    setPreviewHtml(html)
  }

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value
    setContent(newContent)
    onChange(newContent)
    generatePreviewHtml(newContent)
  }

  const handleInsertLatex = () => {
    const textarea = document.querySelector("textarea")
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const text = textarea.value
    const before = text.substring(0, start)
    const after = text.substring(end, text.length)
    const newText = `${before}<latex>\\frac{a}{b}</latex>${after}`

    setContent(newText)
    onChange(newText)
    generatePreviewHtml(newText)

    // Set cursor position after the inserted LaTeX
    setTimeout(() => {
      textarea.focus()
      const newCursorPos = start + "<latex>\\frac{a}{b}</latex>".length
      textarea.setSelectionRange(newCursorPos, newCursorPos)
    }, 0)
  }

  const handleInsertLineBreak = () => {
    const textarea = document.querySelector("textarea")
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const text = textarea.value
    const before = text.substring(0, start)
    const after = text.substring(end, text.length)
    const newText = `${before}<br>${after}`

    setContent(newText)
    onChange(newText)
    generatePreviewHtml(newText)

    // Set cursor position after the inserted line break
    setTimeout(() => {
      textarea.focus()
      const newCursorPos = start + "<br>".length
      textarea.setSelectionRange(newCursorPos, newCursorPos)
    }, 0)
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "Lỗi",
          description: "Kích thước file không được vượt quá 5MB",
          variant: "error",
        })
        return
      }

      // Validate file type
      if (!file.type.startsWith("image/")) {
        toast({
          title: "Lỗi",
          description: "Chỉ chấp nhận file hình ảnh",
          variant: "error",
        })
        return
      }

      const imageId = `img-${Date.now()}`
      const imageUrl = URL.createObjectURL(file)

      // Add to temporary images
      setTempImages([...tempImages, { id: imageId, file, url: imageUrl, isNew: true }])

      // Insert image tag at cursor position
      const textarea = document.querySelector("textarea")
      if (!textarea) return

      const start = textarea.selectionStart
      const end = textarea.selectionEnd
      const text = textarea.value
      const before = text.substring(0, start)
      const after = text.substring(end, text.length)
      const imgTag = `<img src='${imageUrl}'>`
      const newText = `${before}${imgTag}${after}`

      setContent(newText)
      onChange(newText)
      generatePreviewHtml(newText)

      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }

      console.log(`Image ${file.name} added to editor. Will need presigned URL when saving.`)
    }
  }

  const handleRemoveImage = (imageId: string) => {
    const imageToRemove = tempImages.find((img) => img.id === imageId)
    if (!imageToRemove) return

    // Remove image tag from content
    const imgTag = `<img src='${imageToRemove.url}'>`
    const newContent = content.replace(imgTag, "")

    setContent(newContent)
    onChange(newContent)
    generatePreviewHtml(newContent)

    // Remove from tempImages
    setTempImages(tempImages.filter((img) => img.id !== imageId))

    // Revoke object URL to prevent memory leaks
    if (imageToRemove.isNew) {
      URL.revokeObjectURL(imageToRemove.url)
    }

    console.log(`Image ${imageId} removed from editor.`)
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2 mb-2">
        <Button type="button" variant="outline" size="sm" onClick={handleInsertLatex}>
          <FileText className="h-4 w-4 mr-1" /> LaTeX
        </Button>
        <Button type="button" variant="outline" size="sm" onClick={handleInsertLineBreak}>
          <Plus className="h-4 w-4 mr-1" /> Xuống dòng
        </Button>
        <Button type="button" variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>
          <ImageIcon className="h-4 w-4 mr-1" /> Hình ảnh
        </Button>
        <Input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="mb-2">
          <TabsTrigger value="edit">Chỉnh sửa</TabsTrigger>
          <TabsTrigger value="preview">Xem trước</TabsTrigger>
        </TabsList>
        <TabsContent value="edit">
          <Textarea
            value={content}
            onChange={handleContentChange}
            placeholder={placeholder}
            className="font-mono"
            style={{ minHeight: height }}
          />
        </TabsContent>
        <TabsContent value="preview">
          <Card>
            <CardContent className="p-4" style={{ minHeight: height }}>
              <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: previewHtml }} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {tempImages.length > 0 && (
        <div className="mt-4">
          <Label>Hình ảnh đã chèn</Label>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 mt-2">
            {tempImages.map((img) => (
              <div key={img.id} className="relative group">
                <img
                  src={img.url || "/placeholder.svg"}
                  alt="Uploaded"
                  className="h-20 w-20 object-cover rounded border"
                />
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="destructive"
                      size="icon"
                      className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
                      <AlertDialogDescription>
                        Bạn có chắc chắn muốn xóa hình ảnh này? Hành động này không thể hoàn tác.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Hủy</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleRemoveImage(img.id)}
                        className="bg-red-500 hover:bg-red-600"
                      >
                        Xóa
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
