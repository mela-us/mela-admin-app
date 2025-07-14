import { useState } from 'react';
import LectureTable from './LectureTable';
import { ArrowDownAZ, ArrowUpZA, BookOpen, Plus, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import { useToast } from '../../../contexts/ToastContext';
import { truncateText } from '../../../lib/utils';
import { LectureService } from '../../../services/LectureService';
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

function LectureList({ lectures, setLectures, levels, topics, contributors }) {
  const { state } = useAuth();
  const { userRole, levelId: userLevelId } = state.user;
  const { toast } = useToast();
  const [selectedLevelFilter, setSelectedLevelFilter] = useState(
    userRole?.toUpperCase() === 'CONTRIBUTOR' ? userLevelId : 'all',
  );
  const [selectedTopicFilter, setSelectedTopicFilter] = useState('all');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState('all');
  const [selectedCreatorFilter, setSelectedCreatorFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');

  const handleSort = (order) => {
    setSortOrder(order);
  };

  const handleDeleteLecture = async (lectureId) => {
    try {
      const resData = await LectureService.deleteLecture(lectureId);
      const { message } = resData;
      setLectures(lectures.filter((lecture) => lecture.lectureId !== lectureId));
      toast.success({
        title: 'Delete Lecture Success',
        description: message,
      });
    } catch (error) {
      const msg = error.response?.data?.message || error.message || 'Error when deleting lecture';
      toast.error({
        title: 'Delete Lecture Error',
        description: msg,
      });
    }
  };

  const handleApproveLecture = async (lectureId) => {
    try {
      const resData = await LectureService.approveLecture(lectureId);
      const { message } = resData;
      setLectures(
        lectures.map((lecture) =>
          lecture.lectureId === lectureId ? { ...lecture, status: 'VERIFIED', rejectedReason: null } : lecture,
        ),
      );
      toast.success({
        title: 'Approve Lecture Success',
        description: message,
      });
    } catch (error) {
      const msg = error.response?.data?.message || error.message || 'Error when approving lecture';
      toast.error({
        title: 'Approve Lecture Error',
        description: msg,
      });
    }
  };

  const handleDenyLecture = async (lectureId, rejectedReason) => {
    const reason = rejectedReason.trim();
    try {
      const resData = await LectureService.denyLecture(lectureId, reason);
      const { message } = resData;
      setLectures(
        lectures.map((lecture) =>
          lecture.lectureId === lectureId
            ? { ...lecture, status: 'DENIED', rejectedReason: reason ?? 'Liên hệ quản trị viên để biết thêm chi tiết' }
            : lecture,
        ),
      );
      toast.success({
        title: 'Deny Lecture Success',
        description: message,
      });
    } catch (error) {
      const msg = error.response?.data?.message || error.message || 'Error when denying lecture';
      toast.error({
        title: 'Deny Lecture Error',
        description: msg,
      });
    }
  };

  const getLevelName = (id) => {
    const level = levels.find((level) => level.levelId === id);
    return level ? level.name : 'Chưa có cấp độ';
  };

  const getTopicName = (id) => {
    const topic = topics.find((topic) => topic.topicId === id);
    return topic ? topic.name : 'Chưa có chủ đề';
  };

  const getCreatorName = (creator, maxLength = 100) => {
    if (!creator) return 'Admin';
    return truncateText(creator.fullName || creator.username || 'Contributor', maxLength);
  };

  const getStatusCount = (status) => {
    return lectures.filter((lecture) => status === 'all' || lecture.status === status)?.length;
  };

  const filteredLectures = lectures
    .filter((lecture) => {
      const levelMatch =
        userRole?.toUpperCase() === 'CONTRIBUTOR'
          ? lecture.levelId === userLevelId
          : selectedLevelFilter === 'all' || lecture.levelId === selectedLevelFilter;
      const topicMatch = selectedTopicFilter === 'all' || lecture.topicId === selectedTopicFilter;
      const statusMatch = selectedStatusFilter === 'all' || lecture.status === selectedStatusFilter;
      const creatorMatch =
        userRole?.toUpperCase() === 'ADMIN'
          ? selectedCreatorFilter === 'all' ||
            (selectedCreatorFilter === 'admin' && !lecture.createdBy) ||
            (lecture.createdBy && lecture.createdBy === selectedCreatorFilter)
          : true;
      const searchMatch = searchQuery === '' || lecture.name.toLowerCase().includes(searchQuery?.toLowerCase());
      return levelMatch && topicMatch && statusMatch && creatorMatch && searchMatch;
    })
    .sort((a, b) => {
      const aValue = a.name.toLowerCase();
      const bValue = b.name.toLowerCase();
      return sortOrder === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
    });

  const clearFilters = () => {
    setSelectedLevelFilter(userRole.toUpperCase() === 'CONTRIBUTOR' ? userLevelId : 'all');
    setSelectedTopicFilter('all');
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
            <h2 className="text-xl font-bold text-gray-700">Quản lý bài học</h2>
            <p className="text-gray-600 text-sm">Tổng cộng {lectures?.length || 0} bài học</p>
          </div>
        </div>
        <Button
          asChild
          className="button-bg-color text-white font-medium px-5 py-2 rounded-3xl shadow transition-all duration-200"
        >
          <Link to="/lectures/add">
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
              placeholder="Tìm kiếm theo tên bài học..."
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
                  className={`h-10 px-4 text-sm font thứ tự-medium transition-all duration-200 ${
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
                  {contributors.map((contributor) => (
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
                  selectedLevelFilter === 'all' && userRole.toUpperCase() !== 'CONTRIBUTOR'
                    ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    : 'ring-2 ring-blue-500 bg-blue-50 text-blue-700'
                }`}
              >
                {selectedLevelFilter === 'all' ? 'Cấp độ' : getLevelName(selectedLevelFilter)}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuGroup className="scroll-max-h-60 overflow-y-auto max-h-60">
                {userRole.toUpperCase() !== 'CONTRIBUTOR' && (
                  <>
                    <DropdownMenuItem onClick={() => setSelectedLevelFilter('all')} className="cursor-pointer">
                      <span>Tất cả cấp độ</span>
                    </DropdownMenuItem>
                  </>
                )}
                {levels
                  .filter((level) => userRole.toUpperCase() !== 'CONTRIBUTOR' || level.levelId === userLevelId)
                  .map((level) => (
                    <DropdownMenuItem
                      key={level.levelId}
                      onClick={() => setSelectedLevelFilter(level.levelId)}
                      className="cursor-pointer"
                    >
                      <span>{level.name}</span>
                    </DropdownMenuItem>
                  ))}
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className={`h-10 px-4 text-sm font-medium transition-all duration-200 ${
                  selectedTopicFilter === 'all'
                    ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    : 'ring-2 ring-blue-500 bg-blue-50 text-blue-700'
                }`}
              >
                {selectedTopicFilter === 'all' ? 'Chủ đề' : getTopicName(selectedTopicFilter)}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuGroup className="scroll-max-h-60 overflow-y-auto max-h-60">
                <DropdownMenuItem onClick={() => setSelectedTopicFilter('all')} className="cursor-pointer">
                  <span>Tất cả chủ đề</span>
                </DropdownMenuItem>
                {topics
                  .filter((topic) => topic.topicId !== 'null')
                  .map((topic) => (
                    <DropdownMenuItem
                      key={topic.topicId}
                      onClick={() => setSelectedTopicFilter(topic.topicId)}
                      className="cursor-pointer"
                    >
                      <span>{topic.name}</span>
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
          (selectedLevelFilter !== 'all' && userRole.toUpperCase() !== 'CONTRIBUTOR') ||
          selectedTopicFilter !== 'all' ||
          selectedStatusFilter !== 'all' ||
          (selectedCreatorFilter !== 'all' && userRole.toUpperCase() === 'ADMIN')) && (
          <div className="mt-4 pt-4 border-t border-gray-200 flex items-center justify-between">
            <div className="flex flex-wrap gap-2 items-center">
              <span className="text-sm text-gray-600">Đang lọc theo </span>
              {searchQuery && (
                <Badge variant="outline" className="bg-green-50 text-green-700">
                  Tìm kiếm &quot;{searchQuery}&quot;
                </Badge>
              )}
              {selectedLevelFilter !== 'all' && (
                <Badge variant="outline" className="bg-blue-50 text-blue-700">
                  Cấp độ &quot;{getLevelName(selectedLevelFilter)}&quot;
                </Badge>
              )}
              {selectedTopicFilter !== 'all' && (
                <Badge variant="outline" className="bg-purple-50 text-purple-700">
                  Chủ đề &quot;{getTopicName(selectedTopicFilter)}&quot;
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
              <span className="text-sm text-gray-500">({filteredLectures?.length || 0} kết quả)</span>
            </div>
            <Button variant="ghost" size="sm" className="text-gray-500 hover:text-gray-700" onClick={clearFilters}>
              Xóa bộ lọc
            </Button>
          </div>
        )}
      </div>

      <LectureTable
        lectures={filteredLectures}
        levels={levels}
        topics={topics}
        onDelete={handleDeleteLecture}
        onApprove={handleApproveLecture}
        onDeny={handleDenyLecture}
        userRole={userRole}
      />
    </div>
  );
}

export default LectureList;
