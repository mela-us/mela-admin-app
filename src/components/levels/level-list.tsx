"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Plus, ListFilter, Grid, ArrowDownAZ, ArrowUpZA, Layers } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import LevelCard from "./level-card"
import LevelDialog from "./level-dialog"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { motion } from "framer-motion"
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

interface Level {
  levelId: string
  name: string
  imageUrl: string
}

interface Props {
  data: Level[]
}

export default function LevelList({ data }: Props) {
  const [levels, setLevels] = useState<Level[]>(data)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [currentLevel, setCurrentLevel] = useState<Level | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const { toast } = useToast()

  const handleAddLevel = async ({ name, filename, file }: { name: string; filename: string; file: File; }) => {
    try {
      if (!filename) {
        throw new Error("Yêu cầu phải có ảnh");
      }
      // Step 1: Get presigned URL
      const presignedResponse = await fetch("/api/levels/presigned-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ filename }),
      });
      const { presignedUrl, imageUrl } = await presignedResponse.json();
      if (!presignedResponse.ok) {
        throw new Error("Không thể lấy URL tạm thời");
      }

      // Step 2: Simulate uploading file to S3
      // In a real app: await fetch(presignedUrl, { method: "PUT", body: file });
      console.log(`Uploading ${filename} to ${presignedUrl}`);

      // Step 3: Call API to add level
      const response = await fetch("/api/levels", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, imageUrl }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Không thể thêm cấp độ");
      }

      setLevels([...levels, data.level]);
      // setIsAddDialogOpen(false);

      toast({
        title: "Thành công",
        description: "Đã thêm cấp độ mới",
        variant: "success"
      });
    } catch (error) {
      console.error("Error adding level:", error);
      toast({
        title: "Lỗi",
        description: error instanceof Error ? error.message : "Không thể thêm cấp độ mới",
        variant: "error",
      });
    }
  }

  const handleEditLevel = async ({ levelId, name, filename, file }: { levelId: string; name: string; filename: string; file: File; }) => {
    try {
      let imageUrl = null
      if (file != null) {
        if (!filename) {
          throw new Error("Yêu cầu phải có ảnh");
        }
        // Step 1: Get presigned URL
        const presignedResponse = await fetch("/api/levels/presigned-url", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ filename }),
        });
        const data = await presignedResponse.json();
        imageUrl = data.imageUrl
        if (!presignedResponse.ok) {
          throw new Error("Không thể lấy URL tạm thời");
        }

        // Step 2: Simulate uploading file to S3
        // In a real app: await fetch(presignedUrl, { method: "PUT", body: file });
        console.log(`Uploading ${filename} to ${data.presignedUrl}`);
      }

      // Step 3: Call API to update level
      const response = await fetch(`/api/levels/${levelId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, imageUrl }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Không thể cập nhật cấp độ");
      }

      setLevels(levels.map((l) => (l.levelId === levelId ? data.level : l)));
      // setIsEditDialogOpen(false);
      setCurrentLevel(null);

      toast({
        title: "Thành công",
        description: "Đã cập nhật cấp độ",
        variant: "success",
      });
    } catch (error) {
      console.error("Error updating level:", error);
      toast({
        title: "Lỗi",
        description: error instanceof Error ? error.message : "Không thể cập nhật cấp độ",
        variant: "error",
      });
    }
  }

  const handleDeleteLevel = async (id: string) => {
    try {
      const response = await fetch(`/api/levels/${id}`, {
        method: "DELETE",
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Không thể xóa cấp độ")
      }

      setLevels(levels.filter((level) => level.levelId !== id))

      toast({
        title: "Thành công",
        description: "Đã xóa cấp độ",
        variant: "success",
      })
    } catch (error) {
      console.error("Error deleting level:", error)
      toast({
        title: "Lỗi",
        description: error instanceof Error ? error.message : "Không thể xóa cấp độ",
        variant: "error",
      })
    }
  }

  const openEditDialog = (level: Level) => {
    setCurrentLevel(level)
    setIsEditDialogOpen(true)
  }

  const handleSort = (type: 'asc' | 'desc') => {
    const sortedLevels = [...levels].sort((a, b) => {
      if (type === 'asc') {
        return a.name.localeCompare(b.name)
      } else {
        return b.name.localeCompare(a.name)
      }
    })
    setLevels(sortedLevels)
  }

  // Filter levels based on search term
  const filteredLevels = levels.filter(level =>
    level.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const MotionLevelCard = motion(LevelCard)

  // Animation variants
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:justify-between md:items-center">
        <h2 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-indigo-700 to-blue-500 bg-clip-text text-transparent flex items-center gap-2">
          <Layers className="h-6 w-6 text-indigo-500" />
          Danh sách cấp độ
        </h2>
        <Button
          onClick={() => setIsAddDialogOpen(true)}
          className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-medium px-5 py-2.5 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-300/50"
        >
          <Plus className="mr-2 h-5 w-5" /> Thêm mới
        </Button>
      </div>

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        {/* Search bar */}
        <div className="relative w-full md:w-72">
          <Input
            type="text"
            placeholder="Tìm kiếm cấp độ..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-4 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <svg
            className="absolute right-3 top-2.5 h-5 w-5 text-gray-400"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
              clipRule="evenodd"
            />
          </svg>
        </div>

        {/* View and sort options */}
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1 bg-gray-100 rounded-lg p-1">
            <Button
              variant={viewMode === "grid" ? "default" : "ghost"}
              size="icon"
              className="h-8 w-8"
              onClick={() => setViewMode("grid")}
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "ghost"}
              size="icon"
              className="h-8 w-8"
              onClick={() => setViewMode("list")}
            >
              <ListFilter className="h-4 w-4" />
            </Button>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-9 px-3">
                <ListFilter className="mr-2 h-4 w-4" />
                Sắp xếp
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuGroup>
                <DropdownMenuItem onClick={() => handleSort('asc')}>
                  <ArrowDownAZ className="mr-2 h-4 w-4" />
                  <span>Tên A-Z</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleSort('desc')}>
                  <ArrowUpZA className="mr-2 h-4 w-4" />
                  <span>Tên Z-A</span>
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {filteredLevels.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-10 bg-gray-50 rounded-lg border border-gray-200">
          <div className="text-gray-400 mb-3">
            <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900">Không tìm thấy cấp độ</h3>
          <p className="text-gray-500 text-center mt-1">Không có kết quả phù hợp với tìm kiếm của bạn.</p>
        </div>
      ) : viewMode === "grid" ? (
        <motion.div
          className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-6"
          variants={container}
          initial="hidden"
          animate="show"
        >
          {filteredLevels.map((level) => (
            <MotionLevelCard
              key={level.levelId}
              level={level}
              onEdit={() => openEditDialog(level)}
              onDelete={handleDeleteLevel}
              variants={item}
            />
          ))}
        </motion.div>
      ) : (
        <motion.div
          className="flex flex-col gap-3"
          variants={container}
          initial="hidden"
          animate="show"
        >
          {filteredLevels.map((level) => (
            <motion.div
              key={level.levelId}
              className="flex items-center p-3 bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
              variants={item}
            >
              <div className="flex-shrink-0 h-16 w-16 mr-4 rounded-md overflow-hidden bg-gray-100">
                <img src={level.imageUrl} alt={level.name} className="h-full w-full object-cover" />
              </div>
              <div className="flex-grow">
                <h3 className="text-lg font-semibold text-gray-900">{level.name}</h3>
                <p className="text-sm text-gray-500">ID: {level.levelId.substring(0, 8)}...</p>
              </div>
              <div className="flex space-x-2">
                <Button size="sm" variant="outline" onClick={() => openEditDialog(level)}>
                  Chỉnh sửa
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      size="sm"
                      variant="destructive"
                      className="text-white"
                    >
                      Xóa
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="rounded-lg">
                    <AlertDialogHeader>
                      <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
                      <AlertDialogDescription>
                        Bạn có chắc chắn muốn xóa cấp độ "{level.name}"? Hành động này không thể hoàn tác và có thể ảnh hưởng đến các bài học và bài luyện tập liên quan.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel className="hover:bg-gray-100">Hủy</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleDeleteLevel(level.levelId)}
                        className="bg-red-600 hover:bg-red-700 text-white"
                      >
                        Xóa
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>

              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Add Level Dialog */}
      <LevelDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onSave={handleAddLevel}
        title="Thêm cấp độ mới"
        confirmText="Thêm mới"
      />

      {/* Edit Level Dialog */}
      <LevelDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        onSave={handleEditLevel}
        title="Chỉnh sửa cấp độ"
        confirmText="Lưu thay đổi"
        initialData={currentLevel}
      />
    </div>
  )
}
