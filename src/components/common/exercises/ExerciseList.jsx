import { useEffect, useState } from 'react';
import {
  ArrowDownAZ,
  ArrowUpZA,
  BookOpen,
  CircleCheck,
  Eye,
  FileText,
  MoreVertical,
  Pencil,
  Plus,
  Search,
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
} from '../../../components/ui/alert-dialog';
import { Badge } from '../../../components/ui/badge';
import { Button } from '../../../components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../../../components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../../../components/ui/dropdown-menu';
import { Input } from '../../../components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../components/ui/table';
import { Textarea } from '../../../components/ui/textarea';
import { useAuth } from '../../../contexts/AuthContext';
import { useToast } from '../../../contexts/ToastContext';
import { truncateText } from '../../../lib/utils';
import { ExerciseService } from '../../../services/ExerciseService';

export default function ExerciseList({ exercises, setExercises, lectures, contributors, lectureParam }) {
  const { state } = useAuth();
  const { userRole } = state.user;
  const [rejectedReason, setRejectedReason] = useState('');
  const [selectedLectureFilter, setSelectedLectureFilter] = useState(lectureParam || 'all');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState('all');
  const [selectedCreatorFilter, setSelectedCreatorFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');
  const { toast } = useToast();

  useEffect(() => {
    setSelectedLectureFilter(lectureParam || 'all');
  }, [lectureParam]);

  const handleSort = (order) => {
    setSortOrder(order);
  };

  const handleDeleteExercise = async (id) => {
    try {
      const resData = await ExerciseService.deleteExercise(id);
      const { message } = resData;
      setExercises(exercises.filter((ex) => ex.exerciseId !== id));
      toast.success({
        title: 'Deelete Exercise Success',
        description: message,
      });
    } catch (error) {
      const msg = error.response?.data?.message || error.message || 'Error when deleting exercise';
      toast.error({
        title: 'Delete Exercise Error',
        description: msg,
      });
    }
  };

  const handleApproveExercise = async (id) => {
    try {
      const resData = await ExerciseService.approveExercise(id);
      const { message } = resData;
      setExercises(
        exercises.map((exercise) =>
          exercise.exerciseId === id ? { ...exercise, status: 'VERIFIED', rejectedReason: null } : exercise,
        ),
      );
      toast.success({
        title: 'Approve Exercise Success',
        description: message,
      });
    } catch (error) {
      const msg = error.response?.data?.message || error.message || 'Error when approving exercise';
      toast.error({
        title: 'Approve Exercise Error',
        description: msg,
      });
    }
  };

  const handleDenyExercise = async (id, reason) => {
    reason = reason?.trim();
    try {
      const resData = await ExerciseService.denyExercise(id, reason);
      const { message } = resData;
      setExercises(
        exercises.map((exercise) =>
          exercise.exerciseId === id
            ? { ...exercise, status: 'DENIED', rejectedReason: reason ?? 'Liên hệ quản trị viên để biết thêm chi tiết' }
            : exercise,
        ),
      );
      toast.success({
        title: 'Deny Exercise Success',
        description: message,
      });
    } catch (error) {
      const msg = error.response?.data?.message || error.message || 'Error when denying exercise';
      toast.error({
        title: 'Deny Exercise Error',
        description: msg,
      });
    }
  };

  const getLectureName = (id) => {
    const lecture = lectures.find((l) => l.lectureId === id);
    return lecture ? lecture.name : 'Chưa có bài học';
  };

  const getCreatorName = (creator, maxLength = 100) => {
    if (!creator) return 'Admin';
    return truncateText(creator.fullName || creator.username || 'Contributor', maxLength);
  };

  const getStatusCount = (status) => {
    return exercises?.filter((exercise) => status === 'all' || exercise.status === status)?.length || 0;
  };

  const getStatusBadge = (status, reason) => {
    reason = reason?.trim() || 'Liên hệ quản trị viên để biết thêm chi tiết.';
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
            <DialogContent className="sm:max-w-lg border-0 shadow-2xl rounded-2xl overflow-hidden" closeDisabled={true}>
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

  const filteredExercises =
    exercises
      ?.filter((exercise) => {
        const lectureMatch = selectedLectureFilter === 'all' || exercise.lectureId === selectedLectureFilter;
        const statusMatch = selectedStatusFilter === 'all' || exercise.status === selectedStatusFilter;
        const creatorMatch =
          userRole.toUpperCase() === 'ADMIN'
            ? selectedCreatorFilter === 'all' ||
              (selectedCreatorFilter === 'admin' && !exercise.createdBy) ||
              (exercise.createdBy && exercise.createdBy === selectedCreatorFilter)
            : true;
        const searchMatch =
          searchQuery === '' || exercise.exerciseName?.toLowerCase().includes(searchQuery.toLowerCase());
        return lectureMatch && statusMatch && creatorMatch && searchMatch;
      })
      ?.sort((a, b) => {
        const aValue = a.exerciseName?.toLowerCase() || '';
        const bValue = b.exerciseName?.toLowerCase() || '';
        return sortOrder === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
      }) || [];

  const clearFilters = () => {
    setSelectedLectureFilter('all');
    setSelectedStatusFilter('all');
    setSelectedCreatorFilter('all');
    setSearchQuery('');
    setSortOrder('asc');
  };

  return (
    <div className="space-y-6">
      <div className="flex gap-4 flex-row justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-r from-purple-400 to-pink-400 rounded-lg shadow-lg">
            <BookOpen className="h-7 w-7 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-700">Quản lý bài luyện tập</h2>
            <p className="text-gray-600 text-sm">Tổng cộng {exercises?.length || 0} bài luyện tập</p>
          </div>
        </div>
        <Button
          asChild
          className="button-bg-color text-white font-medium px-5 py-2 rounded-3xl shadow transition-all duration-200"
        >
          <Link to="/exercises/add">
            <Plus className="mr-2 h-5 w-5" /> Thêm mới
          </Link>
        </Button>
      </div>

      <div className="p-5 bg-white rounded-lg border border-gray-200 shadow-md">
        <div className="flex flex-wrap gap-4 items-center">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500" />
            <Input
              type="text"
              placeholder="Tìm kiếm theo tên bài luyện tập..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2.5 border-gray-300 rounded-lg bg-gray-50 focus:bg-white transition-colors"
            />
          </div>
          {userRole.toUpperCase() === 'ADMIN' && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className={`h-10 px-4 text-sm font-medium transition-all duration-200 ${
                    selectedCreatorFilter === 'all'
                      ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      : 'ring-2 ring-green-500 bg-green-50 text-green-700'
                  }`}
                >
                  {selectedCreatorFilter === 'all'
                    ? 'Người tạo'
                    : getCreatorName(contributors.find((c) => c.userId === selectedCreatorFilter) || null, 10)}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuGroup className="scroll-max-h-60 overflow-y-auto max-h-60">
                  <DropdownMenuItem onClick={() => setSelectedCreatorFilter('all')} className="cursor-pointer">
                    <span>Tất cả người tạo</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSelectedCreatorFilter('admin')} className="cursor-pointer">
                    <span>Admin</span>
                  </DropdownMenuItem>
                  {contributors?.map((contributor) => (
                    <DropdownMenuItem
                      key={contributor.userId}
                      onClick={() => setSelectedCreatorFilter(contributor.userId)}
                      className="cursor-pointer"
                    >
                      <span>{contributor.fullName || contributor.username}</span>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className={`h-10 px-4 text-sm font-medium transition-all duration-200 ${
                  selectedLectureFilter === 'all'
                    ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    : 'ring-2 ring-blue-500 bg-blue-50 text-blue-700'
                }`}
              >
                {selectedLectureFilter === 'all' ? 'Bài học' : getLectureName(selectedLectureFilter)}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuGroup className="scroll-max-h-60 overflow-y-auto max-h-60">
                <DropdownMenuItem onClick={() => setSelectedLectureFilter('all')} className="cursor-pointer">
                  <span>Tất cả bài học</span>
                </DropdownMenuItem>
                {lectures.map((lecture) => (
                  <DropdownMenuItem
                    key={lecture.lectureId}
                    onClick={() => setSelectedLectureFilter(lecture.lectureId)}
                    className="cursor-pointer"
                  >
                    <span>{lecture.name}</span>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
          <div className="flex flex-wrap gap-2">
            {[
              { key: 'all', label: 'Tất cả', color: 'bg-gray-100 text-gray-700 hover:bg-gray-200' },
              { key: 'PENDING', label: 'Chờ duyệt', color: 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200' },
              { key: 'VERIFIED', label: 'Đã duyệt', color: 'bg-green-100 text-green-700 hover:bg-green-200' },
              { key: 'DENIED', label: 'Từ chối', color: 'bg-red-100 text-red-700 hover:bg-red-200' },
            ].map(({ key, label, color }) => (
              <button
                key={key}
                onClick={() => setSelectedStatusFilter(key)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  selectedStatusFilter === key ? 'ring-2 ring-blue-500 bg-blue-50 text-blue-700' : color
                }`}
              >
                {label} ({getStatusCount(key)})
              </button>
            ))}
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="h-10 px-4 bg-white border-gray-200 text-gray-700 hover:bg-gray-50"
              >
                {sortOrder === 'asc' ? (
                  <ArrowDownAZ className="mr-2 h-4 w-4 text-indigo-500" />
                ) : (
                  <ArrowUpZA className="mr-2 h-4 w-4 text-indigo-500" />
                )}
                <span>Sắp xếp</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuGroup>
                <DropdownMenuItem onClick={() => handleSort('asc')} className="cursor-pointer">
                  <ArrowDownAZ className="mr-2 h-4 w-4 text-indigo-500" />
                  <span>Tên A-Z</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleSort('desc')} className="cursor-pointer">
                  <ArrowUpZA className="mr-2 h-4 w-4 text-indigo-500" />
                  <span>Tên Z-A</span>
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        {(searchQuery ||
          selectedLectureFilter !== 'all' ||
          selectedStatusFilter !== 'all' ||
          (userRole.toUpperCase() === 'ADMIN' && selectedCreatorFilter !== 'all')) && (
          <div className="mt-4 pt-4 border-t border-gray-200 flex items-center justify-between">
            <div className="flex flex-wrap gap-2 items-center">
              <span className="text-sm text-gray-600">Đang lọc theo </span>
              {searchQuery && (
                <Badge variant="outline" className="bg-green-50 text-green-700">
                  Tìm kiếm &quot;{searchQuery}&quot;
                </Badge>
              )}
              {selectedLectureFilter !== 'all' && (
                <Badge variant="outline" className="bg-blue-50 text-blue-700">
                  Bài học &quot;{getLectureName(selectedLectureFilter)}&quot;
                </Badge>
              )}
              {selectedStatusFilter !== 'all' && (
                <Badge variant="outline" className="bg-yellow-50 text-yellow-700">
                  Trạng thái &quot;{selectedStatusFilter}&quot;
                </Badge>
              )}
              {userRole.toUpperCase() === 'ADMIN' && selectedCreatorFilter !== 'all' && (
                <Badge variant="outline" className="bg-green-50 text-green-700">
                  Người tạo &quot;
                  {selectedCreatorFilter === 'admin'
                    ? 'Admin'
                    : getCreatorName(
                      contributors.find((c) => c.userId === selectedCreatorFilter),
                      50,
                    )}
                  &quot;
                </Badge>
              )}
              <span className="text-sm text-gray-500">({filteredExercises?.length || 0} kết quả)</span>
            </div>
            <Button variant="ghost" size="sm" className="text-gray-500 hover:text-gray-700" onClick={clearFilters}>
              Xóa bộ lọc
            </Button>
          </div>
        )}
      </div>

      {filteredExercises?.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center py-16 px-4 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
          <FileText className="h-16 w-16 text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-600 mb-1">Không có bài luyện tập nào</h3>
          <p className="text-gray-500 mb-4 max-w-md">
            Không tìm thấy bài luyện tập nào phù hợp. Hãy thử điều chỉnh bộ lọc hoặc thêm bài luyện tập mới.
          </p>
          <Link
            className="group relative border-2 border-dashed border-gray-300 rounded-lg hover:border-purple-400 hover:bg-purple-50/30 transition-all cursor-pointer"
            to={`/exercises/add${selectedLectureFilter ? `?lecture=${selectedLectureFilter}` : ''}`}
          >
            <div className="flex items-center justify-center py-4 px-5">
              <div className="flex items-center space-x-2 text-gray-500 group-hover:text-purple-600">
                <Plus className="h-5 w-5" />
                <span className="text-sm font-medium">Thêm bài luyện tập mới</span>
              </div>
            </div>
          </Link>
        </div>
      ) : (
        <div className="overflow-x-auto border-b border-gray-200 shadow-xl">
          <Table>
            <TableHeader>
              <TableRow className="bg-gradient-to-r from-gray-200 to-gray-300 border-b hover:bg-gray-300 border-gray-200">
                <TableHead className="py-3 font-semibold text-gray-700 w-[300px] rounded-tl-lg">
                  Tên bài luyện tập
                </TableHead>
                <TableHead className="text-center py-3 font-semibold text-gray-700 w-[150px]">Bài học</TableHead>
                <TableHead className="text-center py-3 font-semibold text-gray-700 w-[100px]">STT</TableHead>
                <TableHead className="text-center py-3 font-semibold text-gray-700 w-[100px]">Số câu hỏi</TableHead>
                <TableHead className="text-center py-3 font-semibold text-gray-700 w-[120px]">Người tạo</TableHead>
                <TableHead className="text-center py-3 font-semibold text-gray-700 w-[120px]">Trạng thái</TableHead>
                <TableHead className="text-right py-3 font-semibold text-gray-700 w-[100px] rounded-tr-lg">
                  Thao tác
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredExercises.map((exercise, index) => (
                <TableRow
                  key={exercise.exerciseId}
                  className={`hover:bg-violet-300/30 border-b border-x ${index % 2 === 0 ? 'bg-white' : 'bg-gray-100/80'}`}
                >
                  <TableCell className="py-4 w-[300px]">
                    <div className="flex items-center">
                      <BookOpen className="h-5 w-5 text-indigo-400 mr-3 flex-shrink-0" />
                      <span className="font-medium text-gray-900 line-clamp-2">{exercise.exerciseName}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-center py-4 w-[150px]">
                    <Badge
                      variant="outline"
                      className="bg-blue-50 text-blue-700 hover:bg-blue-100 px-2 py-1 cursor-default text-center whitespace-normal break-words max-w-full"
                    >
                      {getLectureName(exercise.lectureId)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center py-4 w-[100px]">
                    <Badge
                      variant="outline"
                      className="bg-amber-50 text-amber-700 hover:bg-amber-100 px-2 py-0.5 cursor-default font-medium text-center whitespace-normal break-words max-w-full"
                    >
                      {exercise.ordinalNumber}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center py-4 w-[100px]">
                    <Badge
                      variant="outline"
                      className="bg-green-50 text-green-700 hover:bg-green-100 px-2 py-0.5 cursor-default font-medium text-center whitespace-normal break-words max-w-full"
                    >
                      {exercise.totalQuestions}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center py-4 w-[120px]">
                    <Badge
                      variant="outline"
                      className={`px-2 py-1 cursor-default text-center whitespace-normal break-words max-w-full ${
                        exercise.creator
                          ? 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'
                          : 'bg-red-50 text-red-700 hover:bg-red-100'
                      }`}
                    >
                      {getCreatorName(exercise.creator)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center py-4 w-[120px]">
                    {getStatusBadge(exercise.status, exercise.rejectedReason)}
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
                            to={`/exercises/${exercise.exerciseId}`}
                            className="text-blue-600 focus:text-blue-600 rounded-lg"
                          >
                            <Eye className="mr-2 h-4 w-4" />
                            Thông tin
                          </Link>
                        </DropdownMenuItem>
                        {(userRole.toUpperCase() === 'ADMIN' || exercise.status !== 'VERIFIED') && (
                          <DropdownMenuItem asChild>
                            <Link
                              to={`/exercises/${exercise.exerciseId}/edit`}
                              className="text-indigo-600 focus:text-indigo-600 rounded-lg"
                            >
                              <Pencil className="mr-2 h-4 w-4" />
                              Chỉnh sửa
                            </Link>
                          </DropdownMenuItem>
                        )}
                        {userRole.toUpperCase() === 'ADMIN' &&
                          (exercise.status === 'PENDING' || exercise.status === 'DENIED') && (
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
                                      Bạn có chắc chắn muốn phê duyệt bài luyện tập &quot;{exercise.exerciseName}&quot;?
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel className="rounded-lg hover:bg-gray-100">Hủy</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleApproveExercise(exercise.exerciseId)}
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
                                  <AlertDialogTitle className="text-xl">Từ chối duyệt</AlertDialogTitle>
                                  <AlertDialogDescription className="text-gray-600">
                                      Vui lòng nhập lý do từ chối duyệt bài luyện tập &quot;{exercise.exerciseName}
                                      &quot;.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <div className="py-4">
                                  <Textarea
                                    value={rejectedReason}
                                    onChange={(e) => setRejectedReason(e.target.value)}
                                    placeholder="Nhập lý do từ chối"
                                    className="h-12 text-gray-700"
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
                                      handleDenyExercise(exercise.exerciseId, rejectedReason);
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
                        {(userRole.toUpperCase() === 'ADMIN' || exercise.status !== 'VERIFIED') && (
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
                                    Bạn có chắc chắn muốn xóa bài luyện tập &quot;{exercise.exerciseName}&quot;? Hành
                                    động này không thể hoàn tác.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel className="rounded-lg hover:bg-gray-100">Hủy</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleDeleteExercise(exercise.exerciseId)}
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
      )}
    </div>
  );
}
