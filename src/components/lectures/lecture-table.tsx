import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Pencil, Trash2, ExternalLink, BookOpen, FileText } from "lucide-react"
import type { Level, Topic, Lecture } from "@/types/lecture"
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

interface LectureTableProps {
  lectures: Lecture[]
  levels: Level[]
  topics: Topic[]
  onDelete: (id: string) => void
  isLoading: boolean
}

export default function LectureTable({ lectures, levels, topics, onDelete, isLoading }: LectureTableProps) {
  const getLevelName = (id: string) => {
    const level = levels.find((level) => level.levelId === id)
    return level ? level.name : "Chưa có"
  }

  const getTopicName = (id: string) => {
    const topic = topics.find((topic) => topic.topicId === id)
    return topic ? topic.name : "Chưa có"
  }

  if (lectures.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center text-center py-16 px-4 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
        <FileText className="h-16 w-16 text-gray-300 mb-4" />
        <h3 className="text-lg font-medium text-gray-600 mb-1">Không có bài học nào</h3>
        <p className="text-gray-500 mb-4 max-w-md">
          Không tìm thấy bài học nào phù hợp với điều kiện tìm kiếm.
          Hãy thử điều chỉnh bộ lọc hoặc thêm bài học mới.
        </p>
        <Button asChild className="bg-indigo-500 hover:bg-indigo-600 text-white font-medium px-5 py-2 rounded-lg shadow transition-all duration-200">
          <Link href="/lectures/add">Thêm mới</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-300 border-b hover:bg-gray-300 border-gray-200">
            <TableHead className="py-3 font-medium text-gray-700">Tên bài học</TableHead>
            <TableHead className="text-center py-3 font-medium text-gray-700">Cấp độ</TableHead>
            <TableHead className="text-center py-3 font-medium text-gray-700">Chủ đề</TableHead>
            <TableHead className="text-center py-3 font-medium text-gray-700">STT</TableHead>
            <TableHead className="text-center py-3 font-medium text-gray-700">Số sections</TableHead>
            <TableHead className="text-right py-3 font-medium text-gray-700">Thao tác</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {lectures.map((lecture, index) => (
            <TableRow
              key={lecture.lectureId}
              className={`hover:bg-gray-50 border-b ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'}`}
            >
              <TableCell className="py-4">
                <div className="flex items-center">
                  <BookOpen className="h-5 w-5 text-indigo-400 mr-3 flex-shrink-0" />
                  <span className="font-medium text-gray-900">{lecture.name}</span>
                </div>
              </TableCell>

              <TableCell className="text-center py-4">
                <Badge
                  variant="outline"
                  className={`bg-blue-50 text-blue-700 hover:bg-blue-100 px-2 py-1 cursor-default`}
                >
                  {getLevelName(lecture.levelId)}
                </Badge>
              </TableCell>

              <TableCell className="text-center py-4">
                <Badge
                  variant="outline"
                  className={`bg-purple-50 text-purple-700 hover:bg-purple-100 px-2 py-1 cursor-default`}
                >
                  {getTopicName(lecture.topicId)}
                </Badge>
              </TableCell>

              <TableCell className="text-center py-4">
                <Badge
                  variant="outline"
                  className="bg-amber-50 text-amber-700 hover:bg-amber-100 px-2 py-0.5 cursor-default font-medium"
                >
                  {lecture.ordinalNumber}
                </Badge>
              </TableCell>

              <TableCell className="text-center py-4">
                <Badge
                  variant="outline"
                  className="bg-green-50 text-green-700 hover:bg-green-100 px-2 py-0.5 cursor-default font-medium"
                >
                  {lecture.sections.length}
                </Badge>
              </TableCell>

              <TableCell className="text-right py-3">
                <div className="flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    asChild
                    className="bg-white text-emerald-600 border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700"
                  >
                    <Link href={`/exercises?lecture=${lecture.lectureId}`}>
                      <ExternalLink className="h-4 w-4 mr-1" /> Bài tập
                    </Link>
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    asChild
                    className="bg-white text-indigo-600 border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700"
                  >
                    <Link href={`/lectures/edit/${lecture.lectureId}`}>
                      <Pencil className="h-4 w-4 mr-1" /> Sửa
                    </Link>
                  </Button>

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="bg-white text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4 mr-1" /> Xóa
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="rounded-lg">
                      <AlertDialogHeader>
                        <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
                        <AlertDialogDescription>
                          Bạn có chắc chắn muốn xóa cấp độ "{lecture.name}"? Hành động này không thể hoàn tác và có thể ảnh hưởng đến các bài học và bài luyện tập liên quan.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel className="hover:bg-gray-100">Hủy</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => onDelete(lecture.lectureId)}
                          className="bg-red-600 hover:bg-red-700 text-white"
                          disabled={isLoading}
                        >
                          {isLoading ? "Đang xóa..." : "Xoá"}
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
  )
}
