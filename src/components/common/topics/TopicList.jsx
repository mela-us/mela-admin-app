import { useState } from 'react';
import TopicDialog from './TopicDialog';
import { motion } from 'framer-motion';
import {
  ArrowDownAZ,
  ArrowUpZA,
  BadgeCheck,
  BadgeX,
  ExternalLink,
  Grid,
  Info,
  MoreVertical,
  Plus,
  Search,
  SquarePen,
  Trash2,
  X,
} from 'lucide-react';
import { useToast } from '../../../contexts/ToastContext';
import { MediaService } from '../../../services/MediaService';
import { TopicService } from '../../../services/TopicService';
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
import { Card, CardContent } from '../../ui/card';
import { Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../../ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../../ui/dropdown-menu';
import { Input } from '../../ui/input';
import { Textarea } from '../../ui/textarea';

function TopicList({ topics, setTopics }) {
  const { toast } = useToast();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [_, setIsDenyDialogOpen] = useState(false);
  const [currentTopic, setCurrentTopic] = useState(null);
  const [denyTopic, setDenyTopic] = useState(null);
  const [rejectedReason, setRejectedReason] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortOrder, setSortOrder] = useState('asc');

  const handleAddTopic = async ({ topicName, filename, fileBlob }) => {
    try {
      let filenamePath = null;
      filename = filename || fileBlob?.name;
      if (filename) {
        const presinedResData = await MediaService.getUploadUrl(filename, 'LEVEL');
        const { preSignedUrl, fileUrl } = presinedResData;
        if (fileBlob) {
          await MediaService.uploadFile(preSignedUrl, fileBlob);
        }
        filenamePath = fileUrl;
      }

      const resData = await TopicService.createTopic(topicName, filenamePath);
      const { message, data } = resData;
      setTopics([...topics, data]);
      toast.success({
        title: 'Thêm chủ đề thành công',
        description: message || 'Chủ đề mới đã được thêm thành công',
      });
      setIsAddDialogOpen(false);
    } catch (error) {
      let msg = '';
      if (error.response) {
        const { status, message, timestamp } = error.response?.data || {};
        console.error(`Error ${status}: ${message} at ${timestamp}`);
        msg = message;
      } else {
        console.error('Error adding topic:', error);
        msg = error.message;
      }
      toast.error({
        title: 'Lỗi thêm chủ đề',
        description: msg || 'Không thể thêm chủ đề mới',
      });
    }
  };

  const handleEditTopic = async ({ topicId, topicName, filename, fileBlob }) => {
    try {
      let filenamePath = null;
      filename = filename || fileBlob?.name;
      if (filename) {
        const presinedResData = await MediaService.getUploadUrl(filename, 'LEVEL');
        const { preSignedUrl, fileUrl } = presinedResData;
        if (fileBlob) {
          await MediaService.uploadFile(preSignedUrl, fileBlob);
        }
        filenamePath = fileUrl;
      }

      const resData = await TopicService.updateTopic(topicId, topicName, filenamePath);
      const { message } = resData;
      if (filenamePath) {
        setTopics(
          topics.map((topic) =>
            topic.topicId === topicId ? { ...topic, name: topicName, imageUrl: filenamePath } : topic,
          ),
        );
      } else {
        setTopics(topics.map((topic) => (topic.topicId === topicId ? { ...topic, name: topicName } : topic)));
      }

      toast.success({
        title: 'Cập nhật chủ đề thành công',
        description: message || 'Chủ đề đã được cập nhật thành công',
      });
      setIsEditDialogOpen(false);
      setCurrentTopic(null);
    } catch (error) {
      let msg = '';
      if (error.response) {
        const { status, message, timestamp } = error.response?.data || {};
        console.error(`Error ${status}: ${message} at ${timestamp}`);
        msg = message;
      } else {
        console.error('Error updating topic:', error);
        msg = error.message;
      }
      toast.error({
        title: 'Lỗi cập nhật chủ đề',
        description: msg || 'Không thể cập nhật chủ đề',
      });
    }
  };

  const handleDeleteTopic = async (id) => {
    try {
      const resData = await TopicService.deleteTopic(id);
      const { message } = resData;
      setTopics(topics.filter((topic) => topic.topicId !== id));
      toast.success({
        title: 'Xóa chủ đề thành công',
        description: message || 'Chủ đề đã được xóa thành công',
      });
    } catch (error) {
      let msg = '';
      if (error.response) {
        const { status, message, timestamp } = error.response?.data || {};
        console.error(`Error ${status}: ${message} at ${timestamp}`);
        msg = message;
      } else {
        console.error('Error deleting topic:', error);
        msg = error.message;
      }
      toast.error({
        title: 'Lỗi xóa chủ đề',
        description: msg || 'Không thể xóa chủ đề',
      });
    }
  };

  const handleApproveTopic = async (id) => {
    try {
      const resData = await TopicService.approveTopic(id);
      const { message } = resData;
      setTopics(
        topics.map((topic) => (topic.topicId === id ? { ...topic, status: 'VERIFIED', rejectedReason: null } : topic)),
      );
      toast.success({
        title: 'Phê duyệt chủ đề thành công',
        description: message || 'Chủ đề đã được phê duyệt',
      });
    } catch (error) {
      let msg = '';
      if (error.response) {
        const { status, message, timestamp } = error.response?.data || {};
        console.error(`Error ${status}: ${message} at ${timestamp}`);
        msg = message;
      } else {
        console.error('Error approving topic:', error);
        msg = error.message;
      }
      toast.error({
        title: 'Lỗi phê duyệt chủ đề',
        description: msg || 'Không thể phê duyệt chủ đề',
      });
    }
  };

  const handleDenyTopic = async (topicId) => {
    if (!rejectedReason.trim()) {
      setRejectedReason('');
    }
    try {
      const resData = await TopicService.denyTopic(topicId, rejectedReason);
      const { message } = resData;
      setTopics(
        topics.map((topic) => (topic.topicId === topicId ? { ...topic, status: 'DENIED', rejectedReason } : topic)),
      );
      toast.success({
        title: 'Từ chối chủ đề thành công',
        description: message || 'Chủ đề đã bị từ chối.',
      });
      setIsDenyDialogOpen(false);
      setDenyTopic(null);
      setRejectedReason('');
    } catch (error) {
      let msg = '';
      if (error.response) {
        const { status, message, timestamp } = error.response?.data || {};
        console.error(`Error ${status}: ${message} at ${timestamp}`);
        msg = message;
      } else {
        console.error('Error denying topic:', error);
        msg = error.message;
      }
      toast.error({
        title: 'Lỗi từ chối chủ đề',
        description: msg || 'Không thể từ chối chủ đề',
      });
    }
  };

  const openEditDialog = (topic) => {
    setCurrentTopic(topic);
    setIsEditDialogOpen(true);
  };

  const openDenyDialog = (topic) => {
    setDenyTopic(topic);
    setRejectedReason(topic.rejectedReason || '');
    setIsDenyDialogOpen(true);
  };

  const handleSort = (type) => {
    setSortOrder(type);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setStatusFilter('All');
    setSortOrder('asc');
  };

  const filteredAndSortedTopics = topics
    .filter((topic) => {
      const matchesSearch = topic.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'All' || topic.status === statusFilter;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      const aValue = a.name.toLowerCase();
      const bValue = b.name.toLowerCase();
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

  const getStatusBadge = (status) => {
    const styles = {
      PENDING: { bg: 'bg-gradient-to-r from-yellow-400 to-orange-500', text: 'text-white' },
      DENIED: { bg: 'bg-gradient-to-r from-red-400 to-red-500', text: 'text-white' },
      VERIFIED: { bg: 'bg-gradient-to-r from-green-400 to-emerald-500', text: 'text-white' },
    };
    const style = styles[status] || { bg: 'bg-gray-200', text: 'text-gray-800' };
    return (
      <span
        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${style.bg} ${style.text} shadow-sm`}
      >
        {status}
      </span>
    );
  };

  const getStatusCount = (status) => {
    return topics.filter((topic) => status === 'All' || topic.status === status).length;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex gap-4 flex-row justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-r from-purple-400 to-pink-400 rounded-lg shadow-lg">
            <Grid className="h-7 w-7 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-800">Quản lý chủ đề</h2>
            <p className="text-gray-600 text-sm">Tổng cộng {topics.length} chủ đề</p>
          </div>
        </div>
        <Button
          onClick={() => setIsAddDialogOpen(true)}
          className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-medium px-5 py-2 rounded-3xl shadow transition-all duration-200"
        >
          <Plus className="mr-2 h-5 w-5" /> <span>Thêm mới</span>
        </Button>
      </div>

      {/* Enhanced Filter Section */}
      <div className="p-5 bg-white rounded-lg border border-gray-200 shadow-md">
        <div className="flex flex-row gap-4 items-center">
          {/* Search */}
          <div className="relative flex-1 min-w-0">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500" />
            <Input
              type="text"
              placeholder="Tìm kiếm theo tên chủ đề..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2.5 border-gray-300 rounded-lg bg-gray-50 focus:bg-white transition-colors"
            />
          </div>

          {/* Status Filter with Counts */}
          <div className="flex flex-wrap gap-2">
            {[
              { key: 'All', label: 'Tất cả', color: 'bg-gray-100 text-gray-700 hover:bg-gray-200' },
              { key: 'PENDING', label: 'Chờ duyệt', color: 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200' },
              { key: 'VERIFIED', label: 'Đã duyệt', color: 'bg-green-100 text-green-700 hover:bg-green-200' },
              { key: 'DENIED', label: 'Bị từ chối', color: 'bg-red-100 text-red-700 hover:bg-red-200' },
            ].map(({ key, label, color }) => (
              <button
                key={key}
                onClick={() => setStatusFilter(key)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  statusFilter === key ? 'ring-2 ring-blue-500 bg-blue-50 text-blue-700' : color
                }`}
              >
                {label} ({getStatusCount(key)})
              </button>
            ))}
          </div>

          {/* Sort & More Options */}
          <div className="flex items-center gap-2">
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
        </div>

        {/* Active Filters Summary */}
        {(searchTerm || statusFilter !== 'All') && (
          <div className="mt-4 pt-4 border-t border-gray-200 flex items-center justify-between">
            <div className="flex flex-wrap gap-2 items-center">
              <span className="text-sm text-gray-600">Đang lọc theo </span>
              {searchTerm && (
                <Badge variant="outline" className="bg-green-50 text-green-700">
                  Tìm kiếm &quot;{searchTerm}&quot;
                </Badge>
              )}
              {statusFilter !== 'All' && (
                <Badge variant="outline" className="bg-blue-50 text-blue-700">
                  Trạng thái &quot;{statusFilter}&quot;
                </Badge>
              )}
              <span className="text-sm text-gray-500">({filteredAndSortedTopics.length} kết quả)</span>
            </div>
            <Button variant="ghost" size="sm" className="text-gray-500 hover:text-gray-700" onClick={clearFilters}>
              Xóa bộ lọc
            </Button>
          </div>
        )}
      </div>

      {/* Results */}
      {filteredAndSortedTopics.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center py-20 px-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl border border-gray-200">
          <div className="relative mb-6">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full opacity-20 blur-xl"></div>
            <div className="relative p-4 bg-white rounded-full shadow-lg">
              <Search className="h-12 w-12 text-gray-400" />
            </div>
          </div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">Không tìm thấy kết quả</h3>
          <p className="text-gray-500 mb-6 max-w-md leading-relaxed">
            Không tìm thấy chủ đề nào phù hợp với điều kiện tìm kiếm. Hãy thử điều chỉnh bộ lọc hoặc tạo chủ đề mới.
          </p>
          <Button
            onClick={() => setIsAddDialogOpen(true)}
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-6 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-200"
          >
            <Plus className="mr-2 h-4 w-4" />
            Tạo chủ đề mới
          </Button>
        </div>
      ) : (
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6"
          variants={{
            hidden: { opacity: 0 },
            show: { opacity: 1, transition: { staggerChildren: 0.05 } },
          }}
          initial="hidden"
          animate="show"
        >
          {filteredAndSortedTopics.map((topic, index) => (
            <motion.div
              key={topic.topicId}
              variants={{
                hidden: { opacity: 0, y: 20, scale: 0.9 },
                show: { opacity: 1, y: 0, scale: 1 },
              }}
              transition={{ delay: index * 0.05 }}
              className="group relative"
            >
              <Card className="overflow-hidden bg-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 rounded-2xl border-0 relative">
                {/* Gradient Border Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-[1px]">
                  <div className="w-full h-full bg-white rounded-2xl"></div>
                </div>

                {/* Image Section */}
                <div className="relative h-40 overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
                  <img
                    src={topic.imageUrl || '/assets/placeholder.svg'}
                    alt={topic.name}
                    className="object-scale-down w-full h-full transition-all duration-500 group-hover:scale-110"
                    onError={(e) => {
                      e.target.src = '/assets/placeholder.svg';
                    }}
                  />

                  {/* Overlay Effects */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-black/40 opacity-30 group-hover:opacity-100 transition-opacity duration-300" />

                  {/* Floating Status Badge */}
                  <div className="absolute top-3 left-3 transform transition-all duration-300 group-hover:scale-110">
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: index * 0.1 }}>
                      {getStatusBadge(topic.status)}
                    </motion.div>
                  </div>

                  {/* Enhanced Action Menu */}
                  {(topic.status === 'PENDING' || topic.status === 'DENIED') && (
                    <div className="absolute top-2.5 right-3 opacity-50 group-hover:opacity-100">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 bg-gray-800 backdrop-blur-sm hover:bg-gray-900 text-gray-200 hover:text-white rounded-full shadow-lg"
                          >
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          align="end"
                          className="w-40 bg-white/95 backdrop-blur-sm border-white/20 shadow-xl rounded-xl"
                        >
                          <>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <DropdownMenuItem
                                  className="text-green-600 focus:text-green-600 rounded-lg"
                                  onSelect={(e) => e.preventDefault()}
                                >
                                  <BadgeCheck className="mr-2 h-4 w-4" />
                                  Phê duyệt
                                </DropdownMenuItem>
                              </AlertDialogTrigger>
                              <AlertDialogContent className="rounded-xl border-0 shadow-2xl">
                                <AlertDialogHeader>
                                  <AlertDialogTitle className="text-xl">Xác nhận duyệt</AlertDialogTitle>
                                  <AlertDialogDescription className="text-gray-600">
                                    Bạn có chắc chắn muốn phê duyệt chủ đề &quot;{topic.name}&quot;?
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel className="rounded-lg hover:bg-gray-100">Hủy</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleApproveTopic(topic.topicId)}
                                    className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-lg"
                                  >
                                    Phê duyệt
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                            <DropdownMenuItem
                              onClick={() => openDenyDialog(topic)}
                              className="text-orange-600 focus:text-orange-600 rounded-lg"
                            >
                              <BadgeX className="mr-2 h-4 w-4" />
                              Từ chối
                            </DropdownMenuItem>
                          </>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  )}
                </div>

                {/* Enhanced Content Section */}
                <CardContent className="p-4 relative z-10">
                  <div className="space-y-3">
                    {/* Title with Tooltip */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-base font-bold text-gray-900 line-clamp-2 leading-tight group-hover:text-purple-600 transition-colors duration-200">
                          {topic.name}
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="w-8 h-1 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
                        </div>
                      </div>

                      {/* Rejected Reason Info */}
                      {topic.status === 'DENIED' && topic.rejectedReason && (
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 text-red-500 hover:text-red-600 hover:bg-red-50 rounded-full transition-all duration-200 flex-shrink-0"
                              title="Xem lý do bị từ chối"
                            >
                              <Info className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent
                            className="sm:max-w-lg border-0 shadow-2xl rounded-2xl overflow-hidden"
                            closeDisabled={true}
                          >
                            <DialogHeader className="bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-4 -m-6 mb-4">
                              <div className="flex items-center justify-between">
                                <DialogTitle className="text-lg font-semibold">Lý do bị từ chối</DialogTitle>
                                <DialogClose className="text-white/80 hover:text-white hover:bg-white/20 rounded-full p-1 transition-colors">
                                  <X className="h-5 w-5" />
                                </DialogClose>
                              </div>
                            </DialogHeader>
                            <div className="px-1 pb-2">
                              <div className="text-sm text-red-800 whitespace-pre-wrap leading-relaxed p-1 rounded-lg">
                                {topic.rejectedReason || 'Không có lý do cụ thể được cung cấp.'}
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      )}
                    </div>

                    {/* Enhanced Quick Actions */}
                    <div className="flex gap-2 pt-1">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openEditDialog(topic)}
                        className="flex-1 h-8 text-xs bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-100 hover:border-blue-300 rounded-lg transition-all duration-200"
                      >
                        <SquarePen className="mr-1 h-3 w-3" />
                        Sửa
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1 h-8 text-xs bg-red-50 text-red-600 border-red-200 hover:bg-red-100 hover:border-red-300 rounded-lg transition-all duration-200"
                          >
                            <Trash2 className="mr-1 h-3 w-3" />
                            Xóa
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="rounded-xl border-0 shadow-2xl">
                          <AlertDialogHeader>
                            <AlertDialogTitle className="text-xl">Xác nhận xóa</AlertDialogTitle>
                            <AlertDialogDescription className="text-gray-600">
                              Bạn có chắc chắn muốn xóa chủ đề &quot;{topic.name}&quot;? Hành động này không thể hoàn
                              tác.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel className="rounded-lg hover:bg-gray-100">Hủy</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDeleteTopic(topic.topicId)}
                              className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-lg"
                            >
                              Xóa
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Dialogs */}
      <TopicDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onSave={handleAddTopic}
        title="Thêm chủ đề mới"
        confirmText="Thêm mới"
      />
      <TopicDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        onSave={handleEditTopic}
        title="Chỉnh sửa chủ đề"
        confirmText="Lưu thay đổi"
        initialData={currentTopic}
      />

      {/* Deny Dialog */}
      <AlertDialog open={denyTopic?.status === 'PENDING' || denyTopic?.status === 'DENIED'}>
        <AlertDialogContent className="rounded-lg">
          <AlertDialogHeader>
            <AlertDialogTitle>Từ chối chủ đề</AlertDialogTitle>
            <AlertDialogDescription>
              Vui lòng nhập lý do từ chối chủ đề &quot;{denyTopic?.name}&quot;.
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
                setDenyTopic(null);
              }}
              className="hover:bg-gray-100"
            >
              Hủy
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => handleDenyTopic(denyTopic?.topicId)}
              className="bg-orange-600 hover:bg-orange-700 text-white"
            >
              Xác nhận
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default TopicList;
