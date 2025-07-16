import { useState, useEffect } from 'react';
import { Eye, MoreVertical, Pencil, Trash2, UserIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  AlertDialogFooter,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../ui/table';
import { calculateAge } from '../../../lib/utils';


export default function UserTable({ users, levels, onDelete, isLoading }) {
  const { state } = useAuth();
  const userRole = state.user?.userRole?.toUpperCase() || 'CONTRIBUTOR';
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const pageSizes = [5, 10, 20];
  const totalItems = users?.length || 0;
  const totalPages = Math.ceil(totalItems / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedUsers = users?.slice(startIndex, endIndex) || [];

  const getLevelName = (id) => {
    const level = levels?.find((l) => l.levelId === id);
    return level ? level.name : 'Chưa có';
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [users]);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handlePageSizeChange = (value) => {
    setPageSize(Number(value));
    setCurrentPage(1);
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'ArrowLeft' && currentPage > 1) {
        handlePageChange(currentPage - 1);
        event.preventDefault();
      } else if (event.key === 'ArrowRight' && currentPage < totalPages) {
        handlePageChange(currentPage + 1);
        event.preventDefault();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [currentPage, totalPages]);

  if (totalItems === 0) {
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
    <div className="space-y-6">
      <div className="overflow-x-auto border-b border-gray-200 shadow-xl rounded-lg">
        <Table>
          <TableHeader>
            <TableRow className="bg-gradient-to-r from-gray-200 to-gray-300 border-b hover:bg-gray-300 border-gray-200">
              <TableHead className="py-3 font-semibold text-gray-700 w-[200px] rounded-tl-lg">Username</TableHead>
              <TableHead className="text-center py-3 font-semibold text-gray-700 w-[250px]">Họ và tên</TableHead>
              <TableHead className="text-center py-3 font-semibold text-gray-700 w-[150px]">Tuổi</TableHead>
              <TableHead className="text-center py-3 font-semibold text-gray-700 w-[130px]">Vai trò</TableHead>
              <TableHead className="text-center py-3 font-semibold text-gray-700 w-[130px]">Cấp độ</TableHead>
              <TableHead className="text-center py-3 font-semibold text-gray-700 w-[130px]">Ngày tạo</TableHead>
              <TableHead className="text-right py-3 font-semibold text-gray-700 w-[130px] rounded-tr-lg">
                Thao tác
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedUsers.map((user, index) => {
              const age = calculateAge(user.birthday);
              const level = getLevelName(user.levelId);
              return (
                <TableRow
                  key={user.userId}
                  className={`hover:bg-violet-300/30 border-b border-gray-200 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-100/40'}`}
                >
                  <TableCell className="py-4 w-[200px]">
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
                  <TableCell className="text-center py-4 w-[250px]">
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
                  <TableCell className="text-center py-4 w-[130px]">
                    <Badge
                      variant="outline"
                      className="bg-blue-50 text-blue-700 hover:bg-blue-100 px-2 py-1 cursor-default text-xs text-center whitespace-normal break-words max-w-full"
                    >
                      {user.userRole?.toUpperCase() || 'N/A'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center py-4 w-[130px]">
                    <Badge
                      variant="outline"
                      className="bg-purple-50 text-purple-700 hover:bg-purple-100 px-2 py-1 cursor-default text-xs text-center whitespace-normal break-words max-w-full"
                    >
                      {level}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center py-4 w-[130px]">
                    <span className="font-medium text-sm text-gray-700">
                      {new Date(user.createdAt).toLocaleDateString('vi-VN', {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                      })}
                    </span>
                  </TableCell>
                  <TableCell className="text-right py-3 w-[130px]">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 bg-gray-500 hover:bg-gray-600 text-gray-100 hover:text-white rounded-full shadow-lg mr-2"
                        >
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="end"
                        className="w-40 bg-white border-white/20 shadow-xl rounded-xl"
                      >
                        <DropdownMenuItem asChild>
                          <Link to={`/users/${user.userId}`} className="text-blue-600 hover:bg-gray-50 rounded-lg">
                            <Eye className="mr-2 h-4 w-4" />
                            Thông tin
                          </Link>
                        </DropdownMenuItem>
                        {userRole.toUpperCase() === 'ADMIN' && (
                          <>
                            <DropdownMenuItem asChild>
                              <Link
                                to={`/users/${user.userId}/edit`}
                                className="text-indigo-600 hover:bg-gray-50 rounded-lg"
                              >
                                <Pencil className="mr-2 h-4 w-4" />
                                Chỉnh sửa
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator className="bg-gray-200" />
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <DropdownMenuItem
                                  className="text-red-600 hover:bg-red-50 rounded-lg"
                                  onSelect={(e) => e.preventDefault()}
                                >
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Xóa
                                </DropdownMenuItem>
                              </AlertDialogTrigger>
                              <AlertDialogContent className="rounded-xl border-gray-200 shadow-2xl">
                                <AlertDialogHeader>
                                  <AlertDialogTitle className="text-xl">Xác nhận xóa</AlertDialogTitle>
                                  <AlertDialogDescription className="text-gray-600">
                                    Bạn có chắc chắn muốn xóa người dùng &quot;{user.fullname || user.username}&quot;? Hành động này không thể hoàn tác.
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

      {/* Pagination Controls */}
      {totalPages > 0 && (
        <div
          className="flex flex-row items-center justify-between p-4 bg-white rounded-lg border border-gray-200 shadow-md"
          tabIndex="0"
        >
          <div className="flex items-center gap-2 mb-4 sm:mb-0">
            <span className="text-sm text-gray-600">Số dòng mỗi trang:</span>
            <Select value={pageSize.toString()} onValueChange={handlePageSizeChange}>
              <SelectTrigger className="w-24 border-gray-300 bg-white focus:ring-2 focus:ring-gray-500 focus:border-gray-500 rounded-lg text-gray-900">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-white border-gray-200">
                {pageSizes.map((size) => (
                  <SelectItem key={size} value={size.toString()} className="text-gray-900 hover:bg-gray-50">
                    {size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="border-gray-300 bg-white hover:bg-gray-50 text-gray-600 disabled:opacity-50 rounded-lg"
              aria-label="Trang trước"
            >
              Trước
            </Button>
            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <Button
                  key={page}
                  variant={currentPage === page ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handlePageChange(page)}
                  className={`w-10 h-10 ${
                    currentPage === page
                      ? 'bg-gray-600 text-white hover:bg-gray-700'
                      : 'border-gray-300 bg-white hover:bg-gray-50 text-gray-600'
                  } rounded-lg`}
                  aria-label={`Trang ${page}`}
                >
                  {page}
                </Button>
              ))}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="border-gray-300 bg-white hover:bg-gray-50 text-gray-600 disabled:opacity-50 rounded-lg"
              aria-label="Trang sau"
            >
              Sau
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
