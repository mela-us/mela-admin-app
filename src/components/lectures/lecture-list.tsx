"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { toast } from "@/components/ui/use-toast"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { Level, Topic, Lecture } from "@/types/lecture"
import { Search, Filter, Plus, ListFilter, ArrowDownAZ, ArrowUpZA, BookOpen } from "lucide-react"
import LectureTable from "./lecture-table"

interface Props {
  initialLectures: Lecture[]
  levels: Level[]
  topics: Topic[]
}

export default function LectureList({ initialLectures, levels, topics }: Props) {
  const [lectures, setLectures] = useState<Lecture[]>(initialLectures)
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc")

  const [selectedLevelFilter, setSelectedLevelFilter] = useState<string>("all")
  const [selectedTopicFilter, setSelectedTopicFilter] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState<string>("")

  const handleSort = (order: "asc" | "desc") => {
    setSortOrder(order)
    const sortedLectures = [...lectures].sort((a, b) => {
      if (order === "asc") {
        return a.name.localeCompare(b.name)
      } else {
        return b.name.localeCompare(a.name)
      }
    })
    setLectures(sortedLectures)
  }

  const filteredLectures = lectures.filter((lecture) => {
    const levelMatch = selectedLevelFilter === "all" || lecture.levelId === selectedLevelFilter
    const topicMatch = selectedTopicFilter === "all" || lecture.topicId === selectedTopicFilter
    const searchMatch = searchQuery === "" || lecture.name.toLowerCase().includes(searchQuery.toLowerCase())
    return levelMatch && topicMatch && searchMatch
  })

  const handleDeleteLecture = async (id: string) => {
    try {
      setIsLoading(true)
      const response = await fetch(`/api/lectures/${id}`, {
        method: "DELETE",
      })
      if (!response.ok) {
        throw new Error("Xoá lecture thất bại")
      }
      setLectures(lectures.filter((lecture) => lecture.lectureId !== id))
      toast({
        title: "Thành công",
        description: "Đã xóa bài học",
      })
    } catch (error) {
      console.error("Error deleting lecture:", error)
      toast({
        title: "Lỗi",
        description: "Không thể xóa bài học",
        variant: "error",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const getLevelName = (id: string) => {
    const level = levels.find((level) => level.levelId === id)
    return level ? level.name : "Chưa có"
  }

  const getTopicName = (id: string) => {
    const topic = topics.find((topic) => topic.topicId === id)
    return topic ? topic.name : "Chưa có"
  }

  const activeFiltersCount =
    (selectedLevelFilter !== "all" ? 1 : 0) +
    (selectedTopicFilter !== "all" ? 1 : 0) +
    (searchQuery !== "" ? 1 : 0);

  return (
    <div className="space-y-6">
      {/* Header with Title and Add button */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b">
        <div>
          <h2 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-indigo-700 to-blue-500 bg-clip-text text-transparent flex items-center gap-2">
            <BookOpen className="h-6 w-6 text-indigo-500" />
            Danh sách bài học
          </h2>
        </div>
        <Button
          asChild
          className="bg-gradient-to-r from-indigo-600 to-blue-500 hover:from-indigo-700 hover:to-blue-600 text-white font-medium px-5 py-2 rounded-lg shadow transition-all duration-200"
        >
          <Link href="/lectures/add">
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
              placeholder="Tìm kiếm bài học theo tên..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 w-full"
            />
          </div>

          {/* Filter buttons group */}
          <div className="flex items-center gap-3 w-full md:w-auto justify-end">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-10 px-4 bg-white border-gray-200 text-gray-700 hover:bg-gray-50">
                  <ListFilter className="mr-2 h-4 w-4 text-indigo-500" />
                  <span>Sắp xếp</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuGroup>
                  <DropdownMenuItem onClick={() => handleSort("asc")} className="cursor-pointer">
                    <ArrowDownAZ className="mr-2 h-4 w-4 text-indigo-500" />
                    <span>Tên A-Z</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleSort("desc")} className="cursor-pointer">
                    <ArrowUpZA className="mr-2 h-4 w-4 text-indigo-500" />
                    <span>Tên Z-A</span>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button
              variant={isFilterOpen ? "secondary" : "outline"}
              className={`flex items-center gap-2 h-10 px-4 ${isFilterOpen ? 'bg-indigo-200 text-indigo-900 border-indigo-500' : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'}`}
              onClick={() => setIsFilterOpen(!isFilterOpen)}
            >
              <Filter className={`h-4 w-4 ${isFilterOpen ? 'text-indigo-900' : 'text-gray-500'}`} />
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Bộ lọc Cấp độ */}
              <div className="space-y-2">
                <Label htmlFor="level-filter" className="text-sm font-medium text-gray-700">Cấp độ</Label>
                <Select value={selectedLevelFilter} onValueChange={setSelectedLevelFilter}>
                  <SelectTrigger id="level-filter" className="border-gray-200 bg-white">
                    <SelectValue placeholder="Chọn cấp độ" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả cấp độ</SelectItem>
                    <SelectItem value="null">Chưa có cấp độ</SelectItem>
                    {levels
                      .filter((level) => level.levelId !== "null")
                      .map((level) => (
                        <SelectItem key={level.levelId} value={level.levelId}>
                          {level.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Bộ lọc Chủ đề */}
              <div className="space-y-2">
                <Label htmlFor="topic-filter" className="text-sm font-medium text-gray-700">Chủ đề</Label>
                <Select value={selectedTopicFilter} onValueChange={setSelectedTopicFilter}>
                  <SelectTrigger id="topic-filter" className="border-gray-200 bg-white">
                    <SelectValue placeholder="Chọn chủ đề" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả chủ đề</SelectItem>
                    <SelectItem value="null">Chưa có chủ đề</SelectItem>
                    {topics
                      .filter((topic) => topic.topicId !== "null")
                      .map((topic) => (
                        <SelectItem key={topic.topicId} value={topic.topicId}>
                          {topic.name}
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
                    Đang lọc: {" "}
                    {selectedLevelFilter !== "all" && (
                      <Badge variant="outline" className="bg-blue-50 text-blue-700 mr-2">
                        {getLevelName(selectedLevelFilter)}
                      </Badge>
                    )}
                    {selectedTopicFilter !== "all" && (
                      <Badge variant="outline" className="bg-purple-50 text-purple-700 mr-2">
                        {getTopicName(selectedTopicFilter)}
                      </Badge>
                    )}
                    {searchQuery !== "" && (
                      <Badge variant="outline" className="bg-green-50 text-green-700">
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
                    setSelectedLevelFilter("all");
                    setSelectedTopicFilter("all");
                    setSearchQuery("");
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
          {filteredLectures.length > 0 ? (
            <span>Hiển thị <strong>{filteredLectures.length}</strong> bài học</span>
          ) : (
            <span>Không tìm thấy bài học nào phù hợp với điều kiện lọc</span>
          )}
        </div>
      </div>

      {/* Lecture Table in an elevated card */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-lg overflow-hidden">
        <LectureTable
          lectures={filteredLectures}
          levels={levels}
          topics={topics}
          onDelete={handleDeleteLecture}
          isLoading={isLoading}
        />
      </div>
    </div>
  )
}
