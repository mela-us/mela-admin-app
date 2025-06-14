"use client"

import { useState, useEffect, useMemo } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { toast } from "@/components/ui/use-toast"
import { useToast } from "@/components/ui/use-toast"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, Filter, Plus, ListFilter, ArrowDownAZ, ArrowUpZA, BookOpen, FileText, Eye, Pencil, Trash2, Loader2 } from "lucide-react"
import { useSearchParams } from 'next/navigation';

type Lecture = {
  id: string
  name: string
}

type Exercise = {
  id: string
  name: string
  ordinalNumber: number
  lectureId: string
  questionCount: number
}

type Props = {
  initialLectures: Lecture[]
  initialExercises: Exercise[]
}

export function ExerciseList({ initialLectures, initialExercises }: Props) {
  const searchParams = useSearchParams();
  const lectureParam = searchParams.get('lecture');

  const [lectures, setLectures] = useState<Lecture[]>(initialLectures)
  const [exercises, setExercises] = useState<Exercise[]>(initialExercises)
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc")
  const [deletedExerciseId, setDeletedExerciseId] = useState<string | null>(null)

  const [selectedLectureFilter, setSelectedLectureFilter] = useState<string>(lectureParam ? lectureParam : "all")
  const [searchQuery, setSearchQuery] = useState<string>("")

  const handleSort = (order: "asc" | "desc") => {
    setSortOrder(order)
    const sortedExercises = [...exercises].sort((a, b) => {
      if (order === "asc") {
        return a.name.localeCompare(b.name)
      } else {
        return b.name.localeCompare(a.name)
      }
    })
    setExercises(sortedExercises)
  }

  const filteredExercises = exercises.filter((exercise) => {
    const lectureMatch = selectedLectureFilter === "all" || exercise.lectureId === selectedLectureFilter
    const searchMatch = searchQuery === "" || exercise.name.toLowerCase().includes(searchQuery.toLowerCase())
    return lectureMatch && searchMatch
  })

  const handleDeleteExercise = async (id: string) => {
    try {
      setDeletedExerciseId(id)
      // call deleting
      const response = await fetch(`/api/exercises/${id}`, {
        method: "DELETE",
      })
      if (!response.ok) {
        throw new Error("Xoá exercise thất bại")
      }
      setExercises(exercises.filter((ex) => ex.id !== id))

      toast({
        title: "Thành công",
        description: "Đã xóa bài luyện tập",
      })
    } catch (error) {
      console.error("Error deleting exercise:", error)
      toast({
        title: "Lỗi",
        description: "Không thể xóa bài luyện tập",
        variant: "error",
      })
    } finally {
      setDeletedExerciseId(null)
    }
  }

  const getLectureName = (lectureId: string) => {
    const lecture = lectures.find((l) => l.id === lectureId)
    return lecture ? lecture.name : "Chưa có"
  }

  const activeFiltersCount = (selectedLectureFilter !== "all" ? 1 : 0) + (searchQuery !== "" ? 1 : 0)

  return (
    <div className="space-y-6">
      {/* Header with Title and Add button */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b">
        <div>
          <h2 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-indigo-700 to-blue-500 bg-clip-text text-transparent flex items-center gap-2">
            <FileText className="h-6 w-6 text-indigo-500" />
            Danh sách bài luyện tập
          </h2>
        </div>
        <Button
          asChild
          className="bg-gradient-to-r from-indigo-600 to-blue-500 hover:from-indigo-700 hover:to-blue-600 text-white font-medium px-5 py-2 rounded-lg shadow transition-all duration-200"
        >
          <Link href="/exercises/add">
            <Plus className="mr-2 h-4 w-4" /> Thêm mới
          </Link>
        </Button>
      </div>

      {/* Search and filter toolbar */}
      <div className="p-4 bg-white rounded-lg border border-gray-200 shadow-md">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          {/* Search bar */}
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Tìm kiếm bài luyện tập theo tên..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 w-full"
              aria-label="Tìm kiếm bài luyện tập"
            />
          </div>

          {/*physics: 4
          {/* Filter buttons group */}
          <div className="flex items-center gap-3 w-full md:w-auto justify-end">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-10 px-4 bg-white border-gray-200 text-gray-700 hover:bg-gray-50"
                >
                  <ListFilter className="mr-2 h-4 w-4 text-indigo-500" />
                  <span>Sắp xếp</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuGroup>
                  <DropdownMenuItem
                    onClick={() => handleSort("asc")}
                    className="cursor-pointer"
                  >
                    <ArrowDownAZ className="mr-2 h-4 w-4 text-indigo-500" />
                    <span>Tên A-Z</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleSort("desc")}
                    className="cursor-pointer"
                  >
                    <ArrowUpZA className="mr-2 h-4 w-4 text-indigo-500" />
                    <span>Tên Z-A</span>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button
              variant={isFilterOpen ? "secondary" : "outline"}
              className={`flex items-center gap-2 h-10 px-4 ${isFilterOpen
                ? "bg-indigo-200 text-indigo-900 border-indigo-500"
                : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50"
                }`}
              onClick={() => setIsFilterOpen(!isFilterOpen)}
            >
              <Filter
                className={`h-4 w-4 ${isFilterOpen ? "text-indigo-900" : "text-gray-500"}`}
              />
              Bộ lọc
              {activeFiltersCount > 0 && (
                <Badge className="ml-1 bg-indigo-100 text-indigo-700 hover:bg-indigo-200">
                  {activeFiltersCount}
                </Badge>
              )}
            </Button>
          </div>
        </div>

        {/* Filter panel */}
        {isFilterOpen && (
          <div className="mt-4 p-4 bg-white border border-gray-200 rounded-lg shadow-sm animate-in slide-in-from-top-2 duration-200">
            <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
              {/* Bộ lọc Bài học */}
              <div className="space-y-2">
                <Label htmlFor="lecture-filter" className="text-sm font-medium text-gray-700">
                  Bài học
                </Label>
                <Select value={selectedLectureFilter} onValueChange={setSelectedLectureFilter}>
                  <SelectTrigger id="lecture-filter" className="border-gray-200 bg-white">
                    <SelectValue placeholder="Chọn bài học" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả bài học</SelectItem>
                    {lectures.map((lecture) => (
                      <SelectItem key={lecture.id} value={lecture.id}>
                        {lecture.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Active filters summary */}
            <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
              <div className="text-sm text-gray-500">
                {activeFiltersCount > 0 ? (
                  <span>
                    Đang lọc:{" "}
                    {selectedLectureFilter !== "all" && (
                      <Badge
                        variant="outline"
                        className="bg-blue-50 text-blue-700 mr-2"
                      >
                        {lectures.find((l) => l.id === selectedLectureFilter)?.name || "Bài học"}
                      </Badge>
                    )}
                    {searchQuery !== "" && (
                      <Badge
                        variant="outline"
                        className="bg-green-50 text-green-700"
                      >
                        Tìm kiếm "{searchQuery}"
                      </Badge>
                    )}
                  </span>
                ) : (
                  <span>Không có bộ lọc nào được áp dụng</span>
                )}
              </div>

              {activeFiltersCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-500 hover:text-gray-700"
                  onClick={() => {
                    setSelectedLectureFilter("all")
                    setSearchQuery("")
                  }}
                >
                  Xóa bộ lọc
                </Button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Results count */}
      <div className="flex justify-between items-center">
        <div className="text-sm text-indigo-700/80 pl-2 mt-1">
          {isLoading ? (
            <span>Đang tải...</span>
          ) : filteredExercises.length > 0 ? (
            <span>
              Hiển thị <strong>{filteredExercises.length}</strong> bài luyện tập
            </span>
          ) : (
            <span>Không tìm thấy bài luyện tập nào phù hợp với điều kiện lọc</span>
          )}
        </div>
      </div>

      {/* Exercise Table */}
      {isLoading ? (
        <div className="flex justify-center items-center p-8">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
        </div>
      ) : filteredExercises.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center py-16 px-4 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
          <FileText className="h-16 w-16 text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-600 mb-1">Không có bài luyện tập nào</h3>
          <p className="text-gray-500 mb-4 max-w-md">
            Không tìm thấy bài luyện tập nào phù hợp. Hãy thử điều chỉnh bộ lọc hoặc thêm bài luyện tập mới.
          </p>
          <Button asChild className="bg-indigo-500 hover:bg-indigo-600 text-white font-medium px-5 py-2 rounded-lg shadow transition-all duration-200">
            <Link href="/exercises/add">Thêm mới</Link>
          </Button>
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-300 border-b hover:bg-gray-300 border-gray-200">
                  <TableHead className="py-3 font-medium text-gray-700">Tên bài luyện tập</TableHead>
                  <TableHead className="text-center py-3 font-medium text-gray-700">Bài học</TableHead>
                  <TableHead className="text-center py-3 font-medium text-gray-700">STT</TableHead>
                  <TableHead className="text-center py-3 font-medium text-gray-700">Số câu hỏi</TableHead>
                  <TableHead className="text-right py-3 font-medium text-gray-700">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredExercises.map((exercise, index) => (
                  <TableRow
                    key={exercise.id}
                    className={`hover:bg-gray-50 border-b ${index % 2 === 0 ? "bg-white" : "bg-gray-50/30"
                      }`}
                  >
                    <TableCell className="py-4">
                      <div className="flex items-center">
                        <BookOpen className="h-5 w-5 text-indigo-400 mr-3 flex-shrink-0" />
                        <span className="font-medium text-gray-900">{exercise.name}</span>
                      </div>
                    </TableCell>

                    <TableCell className="text-center py-4">
                      <Badge
                        variant="outline"
                        className={`bg-blue-50 text-blue-700 hover:bg-blue-100 px-2 py-1 cursor-default`}
                      >
                        {getLectureName(exercise.lectureId) || "Chưa có"}
                      </Badge>
                    </TableCell>

                    <TableCell className="text-center py-4">
                      <Badge
                        variant="outline"
                        className="bg-amber-50 text-amber-700 hover:bg-amber-100 px-2 py-0.5 cursor-default font-medium"
                      >
                        {exercise.ordinalNumber}
                      </Badge>
                    </TableCell>

                    <TableCell className="text-center py-4">
                      <Badge
                        variant="outline"
                        className="bg-green-50 text-green-700 hover:bg-green-100 px-2 py-0.5 cursor-default font-medium"
                      >
                        {exercise.questionCount}
                      </Badge>
                    </TableCell>

                    <TableCell className="text-right py-3">
                      <div className="flex justify-end space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          asChild
                          className="bg-white text-indigo-600 border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700"
                        >
                          <Link href={`/exercises/edit/${exercise.id}`}>
                            <Pencil className="h-4 w-4 mr-1" /> Sửa
                          </Link>
                        </Button>

                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              className="bg-white text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
                              disabled={deletedExerciseId === exercise.id}
                            >
                              {deletedExerciseId === exercise.id ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <>
                                  <Trash2 className="h-4 w-4 mr-1" /> Xóa
                                </>
                              )}
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent className="rounded-lg">
                            <AlertDialogHeader>
                              <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
                              <AlertDialogDescription>
                                Bạn có chắc chắn muốn xóa bài luyện tập "{exercise.name}"? Hành động này không thể hoàn tác.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel className="hover:bg-gray-100">Hủy</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDeleteExercise(exercise.id)}
                                className="bg-red-600 hover:bg-red-700 text-white"
                                disabled={deletedExerciseId === exercise.id}
                              >
                                {deletedExerciseId === exercise.id ? "Đang xóa..." : "Xóa"}
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      )}
    </div>
  )
}
