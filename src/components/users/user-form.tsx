"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import type { User } from "@/types/user"
import { ChevronLeft, Save, Loader2, X, Camera } from "lucide-react"
import { Label } from "@/components/ui/label"
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

interface Props {
  mode: "add" | "edit"
  user?: User
  roles: { value: string; label: string }[]
}

interface PresignedUrlResponse {
  presignedUrl: string
  fileUrl: string
}


export default function UserForm({ mode, user, roles }: Props) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isExitDialogOpen, setIsExitDialogOpen] = useState(false)
  const [imagePreview, setImagePreview] = useState<string | null>(user?.imageUrl || null)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [formData, setFormData] = useState<{
    username: string
    fullName: string | null
    birthday: string | null
    userRole: string
    password: string | null
  }>({
    username: "",
    fullName: "",
    birthday: "",
    userRole: "USER",
    password: "",
  })
  const [originalFormData, setOriginalFormData] = useState<any>(null)
  const [originalImage, setOriginalImage] = useState<any>(null)

  useEffect(() => {
    if (mode === "edit" && user) {
      setFormData({
        username: user.username,
        fullName: user.fullName,
        birthday: user.birthday,
        userRole: user.userRole,
        password: ""
      })
      setImagePreview(user.imageUrl)
      setOriginalFormData(
        JSON.parse(
          JSON.stringify({
            username: user.username,
            fullName: user.fullName,
            birthday: user.birthday,
            userRole: user.userRole,
            password: ""
          })
        )
      )
      setOriginalImage(JSON.parse(JSON.stringify({
        imageUrl: user.imageUrl
      })))
    } else {
      resetForm()
    }
  }, [mode, user])

  const resetForm = () => {
    if (mode === "edit" && originalFormData) {
      setFormData(JSON.parse(JSON.stringify(originalFormData)))
      setImagePreview(JSON.parse(JSON.stringify(originalImage)))
    } else {
      setFormData({
        username: "",
        fullName: "",
        birthday: "",
        userRole: "USER",
        password: "",
      })
      setImagePreview(null)
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

  const uploadFileWithPresignedUrl = async (presignedUrl: string, file: File): Promise<void> => {
    try {
      console.log(`Uploading file ${file.name} to ${presignedUrl}`)

      await new Promise((resolve) => setTimeout(resolve, 1000))

      console.log(`File ${file.name} uploaded successfully`)
    } catch (error) {
      console.error("Error uploading file:", error)
      throw error
    }
  }

  const validateForm = () => {
    if (!formData.username.trim()) {
      toast({
        title: "Lỗi",
        description: "Vui lòng nhập username",
        variant: "error",
      })
      return false
    }

    if (mode === "add" && !formData.password?.trim()) {
      toast({
        title: "Lỗi",
        description: "Vui lòng nhập mật khẩu",
        variant: "error",
      })
      return false
    }

    if (!formData.userRole) {
      toast({
        title: "Lỗi",
        description: "Vui lòng chọn role",
        variant: "error",
      })
      return false
    }

    return true
  }

  // Handle image selection
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
      // if (file.type !== "application/img") {
      //   toast({
      //     title: "Lỗi",
      //     description: "Chỉ chấp nhận file ảnh",
      //     variant: "error",
      //   })
      //   return
      // }
      const tempUrl = URL.createObjectURL(file)

      setImageFile(file)
      setImagePreview(tempUrl)
    }
  }

  // Remove selected image
  const handleRemoveImage = () => {
    if (imageFile && imagePreview) {
      URL.revokeObjectURL(imagePreview)
    }
    setImagePreview(null)
    setImageFile(null)
  }

  // Form submission handler
  const handleSubmit = async () => {
    // Validate form
    if (!validateForm()) {
      return
    }
    setIsSubmitting(true)

    try {
      let imageUrl: string | null = null

      if (imageFile) {
        const fileName = `users/avatars/${Date.now()}-${imageFile.name}`
        const { presignedUrl, fileUrl } = await getPresignedUrl(fileName, imageFile.type)
        await uploadFileWithPresignedUrl(presignedUrl, imageFile)
        imageUrl = fileUrl
      } else if (imagePreview) {
        imageUrl = imagePreview
      } else {
        imageUrl = null
      }

      const url = mode === "add" ? "/api/users" : `/api/users/${user?.userId}`
      const method = mode === "add" ? "POST" : "PUT"

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          imageUrl
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => null)
        throw new Error(errorData?.message || "Thao tác không thành công")
      }

      toast({
        title: "Thành công",
        description: mode === "add" ? "Đã thêm người dùng mới" : "Đã cập nhật người dùng",
        variant: "success",
      })

      window.location.href = "/users"
      router.refresh()
    } catch (error: any) {
      console.error(`[Frontend] Error ${mode === "add" ? "creating" : "updating"} user:`, error)
      toast({
        title: "Lỗi",
        description: `Không thể ${mode === "add" ? "thêm" : "cập nhật"} người dùng. Vui lòng thử lại.`,
        variant: "error",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Handle back button
  const handleExit = () => {
    const hasChanges =
      mode === "edit"
        ? JSON.stringify(formData) !== JSON.stringify(originalFormData) && JSON.stringify(originalImage) !== JSON.stringify(imagePreview)
        : formData.username ||
        formData.fullName ||
        formData.birthday ||
        formData.userRole !== "USER" ||
        formData.password ||
        imagePreview

    if (hasChanges) {
      setIsExitDialogOpen(true)
    } else {
      router.push("/users")
    }
  }

  // Get user initials for avatar fallback
  const getUserInitials = (name?: string | null): string => {
    if (!name) return "U"
    return name
      .split(" ")
      .map(part => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2)
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
        <h2 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-indigo-700 to-blue-500 bg-clip-text text-transparent ml-2">
          {mode === "add" ? "Thêm người dùng mới" : "Chỉnh sửa người dùng"}
        </h2>
      </div>

      <Card className="border-indigo-200 shadow-lg bg-gradient-to-b from-white to-indigo-50/20">
        <CardHeader className="bg-indigo-200/50 border-b border-indigo-200">
          <CardTitle className="text-xl font-bold text-gray-700/90">
            {mode === "add" ? "Thông tin người dùng mới" : "Chỉnh sửa thông tin người dùng"}
          </CardTitle>
          <CardDescription className="text-gray-700/80">
            {mode === "add"
              ? "Nhập thông tin cơ bản để tạo người dùng mới"
              : "Cập nhật thông tin người dùng trong hệ thống"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          <div className="flex flex-col items-center justify-center pb-6 border-b border-indigo-100">
            <div className="relative group">
              <Avatar className="h-24 w-24 border-4 border-white shadow-md transition-transform duration-200 group-hover:scale-105">
                {imagePreview ? (
                  <AvatarImage src={imagePreview} alt="Avatar preview" className="object-cover" />
                ) : (
                  <AvatarFallback className="bg-indigo-100 text-indigo-600 text-xl font-semibold">
                    {getUserInitials(formData.fullName)}
                  </AvatarFallback>
                )}
              </Avatar>

              <div className="absolute -bottom-2 -right-2 flex space-x-1">
                <div className="relative">
                  <Input
                    id="image"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                  <Button
                    type="button"
                    size="icon"
                    className="h-8 w-8 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white shadow-md"
                    onClick={() => document.getElementById("image")?.click()}
                  >
                    <Camera className="h-4 w-4" />
                  </Button>
                </div>

                {imagePreview && (
                  <Button
                    type="button"
                    size="icon"
                    variant="outline"
                    className="h-8 w-8 rounded-full bg-white border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 shadow-md"
                    onClick={handleRemoveImage}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
            <p className="text-sm text-indigo-600 mt-4 font-medium">
              {imagePreview ? "Ảnh đại diện đã chọn" : "Tải lên ảnh đại diện"}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Định dạng: JPG, PNG. Kích thước tối đa: 5MB
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-6 gap-6">
            <div className="md:col-span-3">
              <Label htmlFor="username" className="text-sm font-semibold text-indigo-900">Tên đăng nhập</Label>
              <Input
                id="username"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                placeholder="example@gmail.com"
                className="border-indigo-300 bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 rounded-md px-4 py-2 text-indigo-900 placeholder-indigo-400/70 transition-all duration-200"
              />
            </div>

            <div className="lg:col-span-3">
              <Label htmlFor="password" className="text-sm font-semibold text-indigo-900">
                {mode === "add" ? "Mật khẩu" : "Mật khẩu mới"}
                {mode === "edit" && <span className="text-xs text-gray-500 ml-1">(để trống nếu không thay đổi)</span>}
              </Label>
              <Input
                id="password"
                name="password"
                type="password"
                onChange={handleInputChange}
                placeholder={mode === "add" ? "Nhập mật khẩu" : "Nhập mật khẩu mới"}
                className="border-indigo-300 bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 rounded-md px-4 py-2 text-indigo-900 placeholder-indigo-400/70 transition-all duration-200"
              />
            </div>

            <div className="lg:col-span-2">
              <Label htmlFor="fullName" className="text-sm font-semibold text-indigo-900">Họ và tên</Label>
              <Input
                id="fullName"
                name="fullName"
                value={formData.fullName || ""}
                onChange={handleInputChange}
                placeholder="Nhập họ và tên"
                className="border-indigo-300 bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 rounded-md px-4 py-2 text-indigo-900 placeholder-indigo-400/70 transition-all duration-200"
              />
            </div>

            <div className="lg:col-span-2">
              <Label htmlFor="birthday" className="text-sm font-semibold text-indigo-900">Ngày sinh</Label>
              <Input
                id="birthday"
                name="birthday"
                type="date"
                value={formData.birthday || ""}
                onChange={handleInputChange}
                className="border-indigo-300 bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 rounded-md px-4 py-2 text-indigo-900 transition-all duration-200"
              />
            </div>

            <div className="lg:col-span-2">
              <Label htmlFor="role" className="text-sm font-semibold text-indigo-900">Vai trò</Label>
              <Select
                name="role"
                value={formData.userRole}
                onValueChange={(value) => handleSelectChange("userRole", value)}
              >
                <SelectTrigger className="border-indigo-300 bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 rounded-md text-indigo-900">
                  <SelectValue placeholder="Chọn vai trò người dùng" />
                </SelectTrigger>
                <SelectContent className="bg-white border-indigo-200">
                  {roles.map((role) => (
                    <SelectItem key={role.value} value={role.value} className="text-indigo-900 hover:bg-indigo-50">
                      {role.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-indigo-100">
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
                  ${isSubmitting ? 'bg-indigo-500' : 'bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700'}
                  text-white focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-80`}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Đang lưu...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-5 w-5" />
                  {mode === "add" ? "Tạo người dùng" : "Lưu thay đổi"}
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      <AlertDialog open={isExitDialogOpen} onOpenChange={setIsExitDialogOpen}>
        <AlertDialogContent className="rounded-lg">
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận hủy</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn hủy? {mode === "add" ? "Tất cả thông tin đã nhập" : "Tất cả thay đổi"} sẽ bị mất và không thể khôi phục.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="hover:bg-gray-100 text-sm">Tiếp tục chỉnh sửa</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                resetForm()
                router.push("/users")
              }}
              className="bg-red-600 hover:bg-red-700 text-white text-sm"
            >
              Hủy và thoát
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
