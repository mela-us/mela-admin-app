import { useEffect, useState } from 'react';
import { ArrowDownAZ, ArrowUpZA, BookOpen, Plus, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import { useToast } from '../../../contexts/ToastContext';
import { truncateText } from '../../../lib/utils';
import { ExerciseService } from '../../../services/ExerciseService';
import { Badge } from '../../ui/badge';
import { Button } from '../../ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../../ui/dropdown-menu';
import { Input } from '../../ui/input';
import ExerciseTable from './ExerciseTable';

function ExerciseList({ exercises, setExercises, lectures, contributors, lectureParam }) {
  const { state } = useAuth();
  const { userRole } = state.user;
  const { toast } = useToast();
  const [selectedLectureFilter, setSelectedLectureFilter] = useState(lectureParam || 'all');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState('all');
  const [selectedCreatorFilter, setSelectedCreatorFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');

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
        title: 'Delete Exercise Success',
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
    const trimmedReason = reason?.trim();
    try {
      const resData = await ExerciseService.denyExercise(id, trimmedReason);
      const { message } = resData;
      setExercises(
        exercises.map((exercise) =>
          exercise.exerciseId === id
            ? { ...exercise, status: 'DENIED', rejectedReason: trimmedReason ?? 'Liên hệ quản trị viên để biết thêm chi tiết' }
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
    if (creator.userRole?.toUpperCase() === 'ADMIN') return 'Admin';
    return truncateText(creator.fullname || creator.username || 'Contributor', maxLength);
  };

  const getStatusCount = (status) => {
    return exercises?.filter((exercise) => status === 'all' || exercise.status === status)?.length || 0;
  };

  const filteredExercises = exercises
    ?.filter((exercise) => {
      const lectureMatch = selectedLectureFilter === 'all' || exercise.lectureId === selectedLectureFilter;
      const statusMatch = selectedStatusFilter === 'all' || exercise.status === selectedStatusFilter;
      const creatorMatch =
        userRole.toUpperCase() === 'ADMIN'
          ? selectedCreatorFilter === 'all' ||
            (selectedCreatorFilter === 'admin' && !exercise.createdBy) ||
            (exercise?.createdBy === selectedCreatorFilter || exercise?.creator?.userRole?.toLowerCase() === selectedCreatorFilter)
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
                      <span>{contributor.fullname || contributor.username}</span>
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

      <ExerciseTable
        exercises={filteredExercises}
        lectures={lectures}
        onDelete={handleDeleteExercise}
        onApprove={handleApproveExercise}
        onDeny={handleDenyExercise}
        userRole={userRole}
        selectedLecture={selectedLectureFilter}
      />
    </div>
  );
}

export default ExerciseList;
