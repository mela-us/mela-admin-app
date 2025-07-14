import { useState } from 'react';
import {
  BookOpen,
  CircleCheck,
  ExternalLink,
  Eye,
  FileText,
  MoreVertical,
  Pencil,
  Plus,
  Trash2,
  X,
  XCircle,
} from 'lucide-react';
import { Link } from 'react-router-dom';
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
import { Button } from '../../ui/button.jsx';
import { Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../../ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../../ui/dropdown-menu';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../ui/table';
import { Textarea } from '../../ui/textarea';

function LectureTable({ lectures, levels, topics, onDelete, onApprove, onDeny, userRole }) {
  const [rejectedReason, setRejectedReason] = useState('');

  const getLevelName = (id) => {
    const level = levels.find((level) => level.levelId === id);
    return level ? level.name : 'Chưa có cấp độ';
  };

  const getTopicName = (id) => {
    const topic = topics.find((topic) => topic.topicId === id);
    return topic ? topic.name : 'Chưa có chủ đề';
  };

  const getCreatorName = (creator) => {
    if (!creator) return 'Admin';
    return creator.fullName || creator.username || 'Không xác định';
  };

  const getStatusBadge = (status, reason) => {
    reason = rejectedReason?.trim() || reason || 'Liên hệ quản trị viên để biết thêm chi tiết';
    const styles = {
      PENDING: 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white',
      DENIED:
        'bg-gradient-to-r from-red-600 to-red-700 text-white shadow-md hover:bg-red-700 cursor-pointer ring-2 ring-red-800',
      VERIFIED: 'bg-gradient-to-r from-green-400 to-emerald-500 text-white',
    };
    return (
      <div className="flex items-center justify-center gap-2">
        {status === 'DENIED' && reason ? (
          <Dialog>
            <DialogTrigger asChild>
              <Badge
                variant="outline"
                className={`px-3 py-1 text-xs font-semibold ${styles[status] || 'bg-gray-200 text-gray-800'} text-center whitespace-normal break-words max-w-[100px] transition-all duration-200`}
              >
                {status}
              </Badge>
            </DialogTrigger>
            <DialogContent className="max-w-lg shadow-2xl rounded-2xl overflow-hidden" closeDisabled={true}>
              <DialogHeader className="bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-4 -m-6 mb-4">
                <div className="flex items-center justify-between">
                  <DialogTitle className="text-lg font-semibold">Lý do bị từ chối</DialogTitle>
                  <DialogClose className="text-white/80 hover:text-white hover:bg-white/20 rounded-full p-1 transition-colors">
                    <X className="h-5 w-5" />
                  </DialogClose>
                </div>
              </DialogHeader>
              <div className="px-1 pb-2">
                <div className="text-sm text-red-800 whitespace-pre-wrap leading-relaxed p-1 rounded-lg">{reason}</div>
              </div>
            </DialogContent>
          </Dialog>
        ) : (
          <Badge
            variant="outline"
            className={`px-3 py-1 text-xs font-semibold ${styles[status] || 'bg-gray-200 text-gray-800'} text-center whitespace-normal break-words max-w-[100px]`}
          >
            {status}
          </Badge>
        )}
      </div>
    );
  };

  if (lectures?.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center text-center py-16 px-4 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
        <FileText className="h-16 w-16 text-gray-300 mb-4" />
        <h3 className="text-lg font-medium text-gray-600 mb-1">Không có bài học nào</h3>
        <p className="text-gray-500 mb-4 max-w-md">
          Không tìm thấy bài học nào phù hợp với điều kiện tìm kiếm. Hãy thử điều chỉnh bộ lọc hoặc thêm bài học mới.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto border-b border-gray-200 shadow-xl">
      <Table>
        <TableHeader>
          <TableRow className="bg-gradient-to-r from-gray-200 to-gray-300 border-b hover:bg-gray-300 border-gray-200">
            <TableHead className="py-3 font-semibold text-gray-700 w-[300px] rounded-tl-lg">Tên bài học</TableHead>
            <TableHead className="text-center py-3 font-semibold text-gray-700 w-[120px]">Cấp độ</TableHead>
            <TableHead className="text-center py-3 font-semibold text-gray-700 w-[150px]">Chủ đề</TableHead>
            <TableHead className="text-center py-3 font-semibold text-gray-700 w-[80px]">STT</TableHead>
            <TableHead className="text-center py-3 font-semibold text-gray-700 w-[100px]">Sections</TableHead>
            <TableHead className="text-center py-3 font-semibold text-gray-700 w-[120px]">Người tạo</TableHead>
            <TableHead className="text-center py-3 font-semibold text-gray-700 w-[120px]">Trạng thái</TableHead>
            <TableHead className="text-right py-3 font-semibold text-gray-700 w-[100px] rounded-tr-lg">
              Thao tác
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {lectures?.map((lecture, index) => (
            <TableRow
              key={lecture.lectureId}
              className={`hover:bg-violet-300/30 border-b border-x  ${index % 2 === 0 ? 'bg-white' : 'bg-gray-100/80'}`}
            >
              <TableCell className="py-4 w-[300px]">
                <div className="flex items-center">
                  <BookOpen className="h-5 w-5 text-purple-400 mr-3 flex-shrink-0" />
                  <span className="font-medium text-gray-900 line-clamp-2">{lecture.name}</span>
                </div>
              </TableCell>
              <TableCell className="text-center py-4 w-[120px]">
                <Badge
                  variant="outline"
                  className="bg-blue-50 text-blue-700 hover:bg-blue-100 px-2 py-1 cursor-default text-center whitespace-normal break-words max-w-full"
                >
                  {getLevelName(lecture.levelId)}
                </Badge>
              </TableCell>
              <TableCell className="text-center py-4 w-[150px]">
                <Badge
                  variant="outline"
                  className="bg-purple-50 text-purple-700 hover:bg-purple-100 px-2 py-1 cursor-default text-center whitespace-normal break-words max-w-full"
                >
                  {getTopicName(lecture.topicId)}
                </Badge>
              </TableCell>
              <TableCell className="text-center py-4 w-[80px]">
                <Badge
                  variant="outline"
                  className="bg-amber-50 text-amber-700 hover:bg-amber-100 px-2 py-0.5 cursor-default font-medium text-center whitespace-normal break-words max-w-full"
                >
                  {lecture.ordinalNumber}
                </Badge>
              </TableCell>
              <TableCell className="text-center py-4 w-[100px]">
                <Badge
                  variant="outline"
                  className="bg-green-50 text-green-700 hover:bg-green-100 px-2 py-0.5 cursor-default font-medium text-center whitespace-normal break-words max-w-full"
                >
                  {lecture.sections?.length || 0}
                </Badge>
              </TableCell>
              <TableCell className="text-center py-4 w-[120px]">
                <Badge
                  variant="outline"
                  className={`px-2 py-1 cursor-default text-center whitespace-normal break-words max-w-full ${
                    lecture.creator
                      ? 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'
                      : 'bg-red-50 text-red-700 hover:bg-red-100'
                  }`}
                >
                  {getCreatorName(lecture.creator)}
                </Badge>
              </TableCell>
              <TableCell className="text-center py-4 w-[120px]">
                {getStatusBadge(lecture.status, lecture.rejectedReason)}
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
                      <Link
                        to={`/lectures/${lecture.lectureId}`}
                        className="text-blue-600 focus:text-blue-600 rounded-lg"
                      >
                        <Eye className="mr-2 h-4 w-4" />
                        Thông tin
                      </Link>
                    </DropdownMenuItem>
                    {(userRole.toUpperCase() === 'ADMIN' || lecture.status !== 'VERIFIED') && (
                      <DropdownMenuItem asChild>
                        <Link
                          to={`/lectures/${lecture.lectureId}/edit`}
                          className="text-indigo-600 focus:text-indigo-600 rounded-lg"
                        >
                          <Pencil className="mr-2 h-4 w-4" />
                          Chỉnh sửa
                        </Link>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem asChild>
                      <Link
                        to={`/exercises?lecture=${lecture.lectureId}`}
                        className="text-pink-600 focus:text-pink-600 rounded-lg"
                      >
                        <ExternalLink className="mr-2 h-4 w-4" />
                        Bài tập
                      </Link>
                    </DropdownMenuItem>
                    {userRole.toUpperCase() === 'ADMIN' &&
                      (lecture.status === 'PENDING' || lecture.status === 'DENIED') && (
                      <>
                        <DropdownMenuSeparator className="bg-gray-200" />
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <DropdownMenuItem
                              className="text-green-600 focus:text-green-600 rounded-lg"
                              onSelect={(e) => e.preventDefault()}
                            >
                              <CircleCheck className="mr-2 h-4 w-4" />
                                Phê duyệt
                            </DropdownMenuItem>
                          </AlertDialogTrigger>
                          <AlertDialogContent className="rounded-xl border-0 shadow-2xl">
                            <AlertDialogHeader>
                              <AlertDialogTitle className="text-xl">Xác nhận duyệt</AlertDialogTitle>
                              <AlertDialogDescription className="text-gray-600">
                                  Bạn có chắc chắn muốn phê duyệt bài học &quot;{lecture.name}&quot;?
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel className="rounded-lg hover:bg-gray-100">Hủy</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => onApprove(lecture.lectureId)}
                                className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-lg"
                              >
                                  Phê duyệt
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <DropdownMenuItem
                              className="text-orange-600 focus:text-orange-600 rounded-lg"
                              onSelect={(e) => e.preventDefault()}
                            >
                              <XCircle className="mr-2 h-4 w-4" />
                                Từ chối
                            </DropdownMenuItem>
                          </AlertDialogTrigger>
                          <AlertDialogContent className="rounded-xl border-0 shadow-2xl">
                            <AlertDialogHeader>
                              <AlertDialogTitle className="text-xl">Xác nhận từ chối</AlertDialogTitle>
                              <AlertDialogDescription className="text-gray-600">
                                  Vui lòng nhập lý do từ chối duyệt bài học &quot;{lecture.name}&quot;.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <div className="py-4">
                              <Textarea
                                value={rejectedReason}
                                onChange={(e) => setRejectedReason(e.target.value)}
                                placeholder="Nhập lý do từ chối"
                                className="h-4 text-gray-700"
                              />
                            </div>
                            <AlertDialogFooter>
                              <AlertDialogCancel
                                onClick={() => {
                                  setRejectedReason('');
                                }}
                                className="rounded-lg hover:bg-gray-100"
                              >
                                  Hủy
                              </AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => {
                                  onDeny(lecture?.lectureId, rejectedReason);
                                  setRejectedReason('');
                                }}
                                className="bg-orange-600 hover:bg-orange-700 text-white"
                              >
                                  Xác nhận
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </>
                    )}
                    {(userRole.toUpperCase() === 'ADMIN' || lecture.status !== 'VERIFIED') && (
                      <>
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
                                Bạn có chắc chắn muốn xóa bài học &quot;{lecture.name}&quot;? Hành động này không thể
                                hoàn tác và có thể ảnh hưởng đến các bài tập liên quan.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel className="rounded-lg hover:bg-gray-100">Hủy</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => onDelete(lecture.lectureId)}
                                className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-lg"
                              >
                                Xóa
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
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export default LectureTable;
