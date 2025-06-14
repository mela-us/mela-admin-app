import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Pencil, Trash2, UserIcon, FileText } from "lucide-react"
import type { User } from "@/types/user"
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

interface UserTableProps {
  users: User[]
  roles: { value: string; label: string }[]
  averageScores: { userId: string; averageScore: number }[]
  onDelete: (userId: string) => void
  isLoading: boolean
}

export default function UserTable({ users, roles, averageScores, onDelete, isLoading }: UserTableProps) {
  const getPerformanceRating = (score: number): string => {
    if (score >= 90) return "Xuất sắc"
    if (score >= 80) return "Giỏi"
    if (score >= 65) return "Khá"
    if (score >= 50) return "Trung bình"
    return "Yếu"
  }

  const calculateAge = (birthday: string | null): number => {
    if (!birthday) return 0
    const birthDate = new Date(birthday)
    const currentDate = new Date()
    const age = currentDate.getFullYear() - birthDate.getFullYear()
    const monthDiff = currentDate.getMonth() - birthDate.getMonth()
    if (monthDiff < 0 || (monthDiff === 0 && currentDate.getDate() < birthDate.getDate())) {
      return age - 1
    }
    return age
  }

  if (users.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center text-center py-16 px-4 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
        <FileText className="h-16 w-16 text-gray-300 mb-4" />
        <h3 className="text-lg font-medium text-gray-600 mb-1">Không có người dùng nào</h3>
        <p className="text-gray-500 mb-4 max-w-md">
          Không tìm thấy người dùng nào phù hợp. Hãy thử điều chỉnh bộ lọc hoặc thêm người dùng mới.
        </p>
        <Button asChild className="bg-indigo-500 hover:bg-indigo-600 text-white font-medium px-5 py-2 rounded-lg shadow transition-all duration-200">
          <Link href="/users/add">Thêm mới</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50 border-b border-gray-200">
            <TableHead className="py-4 px-6 font-semibold text-gray-700 text-sm">Username</TableHead>
            <TableHead className="py-4 px-6 font-semibold text-gray-700 text-sm">Họ và tên</TableHead>
            <TableHead className="py-4 px-6 font-semibold text-gray-700 text-sm text-center">Tuổi</TableHead>
            <TableHead className="py-4 px-6 font-semibold text-gray-700 text-sm text-center">Vai trò</TableHead>
            <TableHead className="py-4 px-6 font-semibold text-gray-700 text-sm text-center">Xếp loại</TableHead>
            <TableHead className="py-4 px-6 font-semibold text-gray-700 text-sm text-right">Thao tác</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user, index) => {
            const score = averageScores.find((s) => s.userId === user.userId)?.averageScore || 0
            const rating = getPerformanceRating(score)
            const age = calculateAge(user.birthday)
            return (
              <TableRow
                key={user.userId}
                className={`hover:bg-gray-50 border-b ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'}`}
              >
                <TableCell className="py-4 px-6">
                  <div className="flex items-center gap-3">
                    <UserIcon className="h-5 w-5 text-indigo-400 flex-shrink-0" />
                    <span className="text-gray-600 text-sm">{user.username}</span>
                  </div>
                </TableCell>
                <TableCell className="py-4 px-6">
                  <span className="font-medium text-gray-900 text-sm">{user.fullName || "Chưa thêm"}</span>
                </TableCell>
                <TableCell className="py-4 px-6 text-center">
                  <Badge
                    variant="outline"
                    className="bg-amber-50 text-amber-700 hover:bg-amber-100 px-2 py-0.5 cursor-default text-xs font-medium"
                  >
                    {age > 0 ? `${age} tuổi (${new Date(user.birthday || "").toLocaleDateString('vi-VN')})` : "N/A (Chưa thêm)"}
                  </Badge>
                </TableCell>
                <TableCell className="py-4 px-6 text-center">
                  <Badge
                    variant="outline"
                    className="bg-blue-50 text-blue-700 hover:bg-blue-100 px-2 py-1 cursor-default text-xs"
                  >
                    {user.userRole.toUpperCase()}
                  </Badge>
                </TableCell>
                <TableCell className="py-4 px-6 text-center">
                  <Badge
                    variant="outline"
                    className="bg-purple-50 text-purple-700 hover:bg-purple-100 px-2 py-1 cursor-default text-xs"
                  >
                    {rating}
                  </Badge>
                </TableCell>
                <TableCell className="py-4 px-6 text-right">
                  <div className="flex justify-end space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      asChild
                      className="bg-white text-emerald-600 border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700 text-xs px-3 py-1"
                    >
                      <Link href={`/users/${user.userId}`}>
                        <UserIcon className="h-4 w-4 mr-1" /> Xem
                      </Link>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      asChild
                      className="bg-white text-indigo-600 border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700 text-xs px-3 py-1"
                    >
                      <Link href={`/users/edit/${user.userId}`}>
                        <Pencil className="h-4 w-4 mr-1" /> Sửa
                      </Link>
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="bg-white text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700 text-xs px-3 py-1"
                        >
                          <Trash2 className="h-4 w-4 mr-1" /> Xóa
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent className="rounded-lg">
                        <AlertDialogHeader>
                          <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
                          <AlertDialogDescription>
                            Bạn có chắc chắn muốn xóa người dùng "{user.fullName || user.username}"? Hành động này không thể hoàn tác.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel className="hover:bg-gray-100 text-sm">Hủy</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => onDelete(user.userId)}
                            className="bg-red-600 hover:bg-red-700 text-white text-sm"
                            disabled={isLoading}
                          >
                            {isLoading ? "Đang xóa..." : "Xóa"}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}
