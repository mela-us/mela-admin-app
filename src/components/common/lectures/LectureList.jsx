import { useState } from 'react';
import LectureTable from './LectureTable';
import { ArrowDownAZ, ArrowUpZA, BookOpen, Plus, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Badge } from '../../../components/ui/badge';
import { Button } from '../../../components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../../../components/ui/dropdown-menu';
import { Input } from '../../../components/ui/input';
import { useToast } from '../../../contexts/ToastContext';
import { LectureService } from '../../../services/LectureService';

function LectureList({ lectures, setLectures, levels, topics }) {
  const { toast } = useToast();
  const [selectedLevelFilter, setSelectedLevelFilter] = useState('all');
  const [selectedTopicFilter, setSelectedTopicFilter] = useState('all');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');

  const handleSort = (order) => {
    setSortOrder(order);
    const sortedLectures = [...lectures].sort((a, b) => {
      const aValue = a.name.toLowerCase();
      const bValue = b.name.toLowerCase();
      return order === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
    });
    setLectures(sortedLectures);
  };

  const handleDeleteLecture = async (id) => {
    try {
      const resData = await LectureService.deleteLecture(id);
      const { message } = resData;
      setLectures(lectures.filter((lecture) => lecture.lectureId !== id));
      toast.success({
        title: 'Xóa bài học thành công',
        description: message || 'Bài học đã được xóa thành công.',
      });
    } catch (error) {
      let msg = '';
      if (error.response) {
        const { status, message, timestamp } = error.response?.data || {};
        console.error(`Error ${status}: ${message} at ${timestamp}`);
        msg = message;
      } else {
        console.error('Error deleting lecture:', error);
        msg = error.message;
      }
      toast.error({
        title: 'Lỗi xóa bài học',
        description: msg || 'Không thể xóa bài học.',
      });
    }
  };

  const handleApproveLecture = async (id) => {
    try {
      const resData = await LectureService.approveLecture(id);
      const { message } = resData;
      setLectures(
        lectures.map((lecture) =>
          lecture.lectureId === id ? { ...lecture, status: 'VERIFIED', rejectedReason: null } : lecture,
        ),
      );
      toast.success({
        title: 'Phê duyệt bài học thành công',
        description: message || 'Bài học đã được phê duyệt.',
      });
    } catch (error) {
      let msg = '';
      if (error.response) {
        const { status, message, timestamp } = error.response?.data || {};
        console.error(`Error ${status}: ${message} at ${timestamp}`);
        msg = message;
      } else {
        console.error('Error approving lecture:', error);
        msg = error.message;
      }
      toast.error({
        title: 'Lỗi phê duyệt bài học',
        description: msg || 'Không thể phê duyệt bài học.',
      });
    }
  };

  const handleDenyLecture = async (id, rejectedReason) => {
    const reason = rejectedReason.trim() || 'Liên hệ quản trị viên để biết thêm chi tiết.';
    try {
      const resData = await LectureService.denyLecture(id, reason);
      const { message } = resData;
      setLectures(
        lectures.map((lecture) =>
          lecture.lectureId === id ? { ...lecture, status: 'DENIED', reason } : lecture,
        ),
      );
      toast.success({
        title: 'Từ chối bài học thành công',
        description: message || 'Bài học đã bị từ chối.',
      });
    } catch (error) {
      let msg = '';
      if (error.response) {
        const { status, message, timestamp } = error.response?.data || {};
        console.error(`Error ${status}: ${message} at ${timestamp}`);
        msg = message;
      } else {
        console.error('Error denying lecture:', error);
        msg = error.message;
      }
      toast.error({
        title: 'Lỗi từ chối bài học',
        description: msg || 'Không thể từ chối bài học.',
      });
    }
  };

  const getLevelName = (id) => {
    const level = levels.find((level) => level.levelId === id);
    return level ? level.name : 'Chưa có';
  };

  const getTopicName = (id) => {
    const topic = topics.find((topic) => topic.topicId === id);
    return topic ? topic.name : 'Chưa có';
  };

  const getStatusCount = (status) => {
    return lectures.filter((lecture) => status === 'all' || lecture.status === status).length;
  };

  const filteredLectures = lectures
    .filter((lecture) => {
      const levelMatch = selectedLevelFilter === 'all' || lecture.levelId === selectedLevelFilter;
      const topicMatch = selectedTopicFilter === 'all' || lecture.topicId === selectedTopicFilter;
      const statusMatch = selectedStatusFilter === 'all' || lecture.status === selectedStatusFilter;
      const searchMatch = searchQuery === '' || lecture.name.toLowerCase().includes(searchQuery.toLowerCase());
      return levelMatch && topicMatch && statusMatch && searchMatch;
    })
    .sort((a, b) => {
      const aValue = a.name.toLowerCase();
      const bValue = b.name.toLowerCase();
      return sortOrder === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
    });

  const clearFilters = () => {
    setSelectedLevelFilter('all');
    setSelectedTopicFilter('all');
    setSelectedStatusFilter('all');
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
            <h2 className="text-xl font-bold text-gray-800">Quản lý bài học</h2>
            <p className="text-gray-600 text-sm">Tổng cộng {lectures.length} bài học</p>
          </div>
        </div>
        <Button
          asChild
          className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-medium px-5 py-2 rounded-3xl shadow transition-all duration-200"
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
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className={`h-10 px-4 text-sm font-medium transition-all duration-200 ${
                  selectedLevelFilter === 'all'
                    ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    : 'ring-2 ring-blue-500 bg-blue-50 text-blue-700'
                }`}
              >
                {selectedLevelFilter === 'all' ? 'Cấp độ' : getLevelName(selectedLevelFilter)}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuGroup className="scroll-max-h-60 overflow-y-auto max-h-60">
                <DropdownMenuItem onClick={() => setSelectedLevelFilter('all')} className="cursor-pointer">
                  <span>Tất cả cấp độ</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSelectedLevelFilter('null')} className="cursor-pointer">
                  <span>Chưa có cấp độ</span>
                </DropdownMenuItem>
                {levels
                  .filter((level) => level.levelId !== 'null')
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
                <DropdownMenuItem onClick={() => setSelectedTopicFilter('null')} className="cursor-pointer">
                  <span>Chưa có chủ đề</span>
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
              { key: 'DENIED', label: 'Bị từ chối', color: 'bg-red-100 text-red-700 hover:bg-red-200' },
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
          selectedLevelFilter !== 'all' ||
          selectedTopicFilter !== 'all' ||
          selectedStatusFilter !== 'all') && (
          <div className="mt-4 pt-4 border-t border-gray-200 flex items-center justify-between">
            <div className="flex flex-wrap gap-2 items-center">
              <span className="text-sm text-gray-600">Đang lọc theo </span>
              {searchQuery && (
                <Badge variant="outline" className="bg-green-50 text-green-700">
                  Tìm kiếm "{searchQuery}"
                </Badge>
              )}
              {selectedLevelFilter !== 'all' && (
                <Badge variant="outline" className="bg-blue-50 text-blue-700">
                  Cấp độ "{getLevelName(selectedLevelFilter)}"
                </Badge>
              )}
              {selectedTopicFilter !== 'all' && (
                <Badge variant="outline" className="bg-purple-50 text-purple-700">
                  Chủ đề "{getTopicName(selectedTopicFilter)}"
                </Badge>
              )}
              {selectedStatusFilter !== 'all' && (
                <Badge variant="outline" className="bg-yellow-50 text-yellow-700">
                  Trạng thái "{selectedStatusFilter}"
                </Badge>
              )}
              <span className="text-sm text-gray-500">({filteredLectures.length} kết quả)</span>
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
      />
    </div>
  );
}

export default LectureList;
