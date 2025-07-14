import { Eye, MoreVertical, Pencil, Plus, Trash2, UserIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
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
} from '../../ui/alert-dialog';
import { Badge } from '../../ui/badge';
import { Button } from '../../ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../../ui/dropdown-menu';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../ui/table';

const calculateAge = (birthday) => {
  if (!birthday) return 0;
  const birthDate = new Date(birthday);
  const currentDate = new Date();
  let age = currentDate.getFullYear() - birthDate.getFullYear();
  const monthDiff = currentDate.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && currentDate.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
};

export default function UserTable({ users, levels, onDelete, isLoading }) {
  const { state } = useAuth();
  const userRole = state.user?.userRole?.toUpperCase() || 'CONTRIBUTOR';
  const getLevelName = (id) => {
    const level = levels?.find((l) => l.levelId === id);
    return level ? level.name : 'Chưa có';
  };

  if (users?.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center text-center py-16 px-4 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
        <UserIcon className="h-16 w-16 text-gray-300 mb-4" />
        <h3 className="text-lg font-medium text-gray-600 mb-1">Không có người dùng nào</h3>
        <p className="text-gray-500 mb-4 max-w-md">
          Không tìm thấy người dùng nào phù hợp. Hãy thử điều chỉnh bộ lọc hoặc thêm người dùng mới.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto border-b border-gray-200 shadow-xl">
      <Table>
        <TableHeader>
          <TableRow className="bg-gradient-to-r from-gray-200 to-gray-300 border-b hover:bg-gray-300 border-gray-200">
            <TableHead className="py-3 font-semibold text-gray-700 w-[150px] rounded-tl-lg">Username</TableHead>
            <TableHead className="text-center py-3 font-semibold text-gray-700 w-[150px]">Họ và tên</TableHead>
            <TableHead className="text-center py-3 font-semibold text-gray-700 w-[150px]">Tuổi</TableHead>
            <TableHead className="text-center py-3 font-semibold text-gray-700 w-[100px]">Vai trò</TableHead>
            <TableHead className="text-center py-3 font-semibold text-gray-700 w-[100px]">Cấp độ</TableHead>
            <TableHead className="text-center py-3 font-semibold text-gray-700 w-[100px]">Ngày tạo</TableHead>
            <TableHead className="text-right py-3 font-semibold text-gray-700 w-[100px] rounded-tr-lg">
              Thao tác
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user, index) => {
            const age = calculateAge(user.birthday);
            const level = getLevelName(user.levelId);
            return (
              <TableRow
                key={user.userId}
                className={`hover:bg-violet-300/30 border-b border-x ${index % 2 === 0 ? 'bg-white' : 'bg-gray-100/80'}`}
              >
                <TableCell className="py-4 w-[150px]">
                  <div className="flex items-center gap-3">
                    {user.imageUrl ? (
                      <img
                        src={user.imageUrl}
                        alt={user.fullname}
                        className="h-8 w-8 rounded-full object-cover flex-shrink-0"
                      />
                    ) : (
                      <UserIcon className="h-5 w-5 text-purple-400 flex-shrink-0" />
                    )}
                    <span className="font-medium text-gray-900 line-clamp-2">{user.username}</span>
                  </div>
                </TableCell>
                <TableCell className="text-center py-4 w-[150px]">
                  <span className="font-medium text-gray-900">{user.fullname || 'Chưa thêm'}</span>
                </TableCell>
                <TableCell className="text-center py-4 w-[150px]">
                  <Badge
                    variant="outline"
                    className="bg-amber-50 text-amber-700 hover:bg-amber-100 px-2 py-1 cursor-default text-xs font-medium text-center whitespace-normal break-words max-w-full"
                  >
                    {age > 0 ? `${age} tuổi (${new Date(user.birthday).toLocaleDateString('vi-VN')})` : 'Chưa thêm'}
                  </Badge>
                </TableCell>
                <TableCell className="text-center py-4 w-[100px]">
                  <Badge
                    variant="outline"
                    className="bg-blue-50 text-blue-700 hover:bg-blue-100 px-2 py-1 cursor-default text-xs text-center whitespace-normal break-words max-w-full"
                  >
                    {user.userRole?.toUpperCase() || 'N/A'}
                  </Badge>
                </TableCell>
                <TableCell className="text-center py-4 w-[100px]">
                  <Badge
                    variant="outline"
                    className="bg-purple-50 text-purple-700 hover:bg-purple-100 px-2 py-1 cursor-default text-xs text-center whitespace-normal break-words max-w-full"
                  >
                    {level}
                  </Badge>
                </TableCell>
                <TableCell className="text-center py-4 w-[100px]">
                  <span className="font-medium text-sm text-gray-700">
                    {new Date(user.createdAt).toLocaleDateString('vi-VN', {
                      year: 'numeric',
                      month: '2-digit',
                      day: '2-digit',
                    })}
                  </span>
                </TableCell>
                <TableCell className="text-right py-3 w-[100px]">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 bg-gray-500 backdrop-blur-sm hover:bg-gray-600 text-gray-100 hover:text-white rounded-full shadow-lg mr-2"
                      >
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="end"
                      className="w-40 bg-white/95 backdrop-blur-sm border-white/20 shadow-xl rounded-xl"
                    >
                      <DropdownMenuItem asChild>
                        <Link to={`/users/${user.userId}`} className="text-blue-600 focus:text-blue-600 rounded-lg">
                          <Eye className="mr-2 h-4 w-4" />
                          Thông tin
                        </Link>
                      </DropdownMenuItem>
                      {userRole === 'ADMIN' && (
                        <>
                          <DropdownMenuItem asChild>
                            <Link
                              to={`/users/${user.userId}/edit`}
                              className="text-indigo-600 focus:text-indigo-600 rounded-lg"
                            >
                              <Pencil className="mr-2 h-4 w-4" />
                              Chỉnh sửa
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator className="bg-gray-200" />
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <DropdownMenuItem
                                className="text-red-600 focus:text-red-600 rounded-lg"
                                onSelect={(e) => e.preventDefault()}
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Xóa
                              </DropdownMenuItem>
                            </AlertDialogTrigger>
                            <AlertDialogContent className="rounded-xl border-0 shadow-2xl">
                              <AlertDialogHeader>
                                <AlertDialogTitle className="text-xl">Xác nhận xóa</AlertDialogTitle>
                                <AlertDialogDescription className="text-gray-600">
                                  Bạn có chắc chắn muốn xóa người dùng "{user.fullname || user.username}"? Hành động này
                                  không thể hoàn tác.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel className="rounded-lg hover:bg-gray-100">Hủy</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => onDelete(user.userId)}
                                  className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-lg"
                                  disabled={isLoading}
                                >
                                  {isLoading ? 'Đang xóa...' : 'Xóa'}
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
