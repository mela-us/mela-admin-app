import { useState } from 'react';
import LevelDialog from './LevelDialog';
import { motion } from 'framer-motion';
import {
  ArrowDownAZ,
  ArrowUpZA,
  BadgeCheck,
  BadgeX,
  CheckCircle,
  Clock,
  Edit3,
  Eye,
  Info,
  Layers,
  MoreVertical,
  Plus,
  Search,
  Sparkles,
  SquarePen,
  Trash2,
  X,
  XCircle,
} from 'lucide-react';
import { useToast } from '../../../contexts/ToastContext';
import { LevelService } from '../../../services/LevelService';
import { MediaService } from '../../../services/MediaService';
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

function LevelList({ levels, setLevels }) {
  const { toast } = useToast();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [_, setIsDenyDialogOpen] = useState(false);
  const [currentLevel, setCurrentLevel] = useState(null);
  const [denyLevel, setDenyLevel] = useState(null);
  const [rejectedReason, setRejectedReason] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortOrder, setSortOrder] = useState('asc');

  const handleAddLevel = async ({ levelName, imageName, fileBlob }) => {
    try {
      imageName = (imageName || fileBlob?.name) + levelName.replace(/\s+/g, '-').toLowerCase();
      const preSignedResData = await MediaService.getUploadUrl(imageName, 'LEVEL');
      const { preSignedUrl, fileUrl } = preSignedResData;
      await MediaService.uploadFile(preSignedUrl, fileBlob);

      const createLevelResData = await LevelService.createLevel(levelName, fileUrl);
      const { message, data } = createLevelResData;
      setLevels([...levels, data]);
      toast.success({
        title: 'Create Level Success',
        description: message,
      });
      setIsAddDialogOpen(false);
      return true;
    } catch (error) {
      const msg = error.response?.data?.message || error.message || 'Error adding level';
      toast.error({
        title: 'Create Level Error',
        description: msg,
      });
    }
    return false;
  };

  const handleEditLevel = async ({ levelId, levelName, imageName, fileBlob }) => {
    try {
      let imageUrl = null;
      if (fileBlob) {
        imageName = (imageName || fileBlob.name) + levelName.replace(/\s+/g, '-').toLowerCase();
        const preSinedResData = await MediaService.getUploadUrl(imageName, 'LEVEL');
        const { preSignedUrl, fileUrl } = preSinedResData;
        await MediaService.uploadFile(preSignedUrl, fileBlob);
        imageUrl = fileUrl;
      }

      const updateLevelResData = await LevelService.updateLevel(levelId, levelName, imageUrl);
      const { message } = updateLevelResData;
      setLevels(
        levels.map((level) => {
          if (level.levelId === levelId) {
            const updateLevel = { ...level };
            updateLevel.name = levelName || updateLevel.name;
            updateLevel.imageUrl = imageUrl || updateLevel.imageUrl;
            updateLevel.rejectedReason = null;
            if (updateLevel.status !== 'VERIFIED') {
              updateLevel.status = 'PENDING';
            }
            return updateLevel;
          }
          return level;
        }),
      );
      toast.success({
        title: 'Update Level Success',
        description: message,
      });
      setIsEditDialogOpen(false);
      setCurrentLevel(null);
      return true;
    } catch (error) {
      const msg = error.response?.data?.message || error.message || 'Error updating level';
      toast.error({
        title: 'Update Level Error',
        description: msg,
      });
    }
    return false;
  };

  const handleDeleteLevel = async (levelId) => {
    try {
      const resData = await LevelService.deleteLevel(levelId);
      const { message } = resData;
      setLevels(levels.filter((level) => level.levelId !== levelId));
      toast.success({
        title: 'Delete Level Success',
        description: message,
      });
    } catch (error) {
      const msg = error.response?.data?.message || error.message || 'Error deleting level';
      toast.error({
        title: 'Delete Level Error',
        description: msg,
      });
    }
  };

  const handleApproveLevel = async (levelId) => {
    try {
      const resData = await LevelService.approveLevel(levelId);
      const { message } = resData;
      setLevels(
        levels.map((level) =>
          level.levelId === levelId ? { ...level, status: 'VERIFIED', rejectedReason: null } : level,
        ),
      );
      toast.success({
        title: 'Approve Level Success',
        description: message,
      });
    } catch (error) {
      const msg = error.response?.data?.message || error.message || 'Error approving level';
      toast.error({
        title: 'Approve Level Error',
        description: msg,
      });
    }
  };

  const handleDenyLevel = async (levelId) => {
    if (!rejectedReason.trim()) {
      setRejectedReason('');
    }
    try {
      const resData = await LevelService.denyLevel(levelId, rejectedReason);
      const { message } = resData;
      setLevels(
        levels.map((level) =>
          level.levelId === levelId
            ? {
              ...level,
              status: 'DENIED',
              rejectedReason: rejectedReason || 'Liên hệ quản trị viên để biết thêm chi tiết',
            }
            : level,
        ),
      );
      toast.success({
        title: 'Deny Level Success',
        description: message,
      });
      setIsDenyDialogOpen(false);
      setDenyLevel(null);
      setRejectedReason('');
    } catch (error) {
      const msg = error.response?.data?.message || error.message || 'Error denying level';
      toast.error({
        title: 'Deny Level Error',
        description: msg,
      });
    }
  };

  const openEditDialog = (level) => {
    setCurrentLevel(level);
    setIsEditDialogOpen(true);
  };

  const openDenyDialog = (level) => {
    setDenyLevel(level);
    setRejectedReason(level.rejectedReason || '');
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

  const filteredAndSortedLevels = levels
    .filter((level) => {
      const matchesSearch = level.name?.toLowerCase().includes(searchTerm?.toLowerCase());
      const matchesStatus = statusFilter === 'All' || level.status === statusFilter;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      const aValue = a.name?.toLowerCase();
      const bValue = b.name?.toLowerCase();
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
    return levels.filter((level) => status === 'All' || level.status === status)?.length || 0;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex gap-4 flex-row justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-r from-purple-400 to-pink-400 rounded-lg shadow-lg">
            <Layers className="h-7 w-7 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-700">Quản lý cấp độ</h2>
            <p className="text-gray-600 text-sm">Tổng cộng {levels?.length || 0} cấp độ</p>
          </div>
        </div>
        <Button
          onClick={() => setIsAddDialogOpen(true)}
          className="button-bg-color text-white font-medium px-5 py-2 rounded-3xl shadow transition-all duration-200"
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
              placeholder="Tìm kiếm theo tên cấp độ..."
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
              { key: 'DENIED', label: 'Từ chối', color: 'bg-red-100 text-red-700 hover:bg-red-200' },
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
              <span className="text-sm text-gray-500">({filteredAndSortedLevels?.length || 0} kết quả)</span>
            </div>
            <Button variant="ghost" size="sm" className="text-gray-500 hover:text-gray-700" onClick={clearFilters}>
              Xóa bộ lọc
            </Button>
          </div>
        )}
      </div>

      {/* Results */}
      {filteredAndSortedLevels?.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center py-16 px-4 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
          <Search className="h-16 w-16 text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-600 mb-1">Không tìm thấy kết quả</h3>
          <p className="text-gray-500 mb-4 max-w-md">
            Không tìm thấy cấp độ nào phù hợp với điều kiện tìm kiếm. Hãy thử điều chỉnh bộ lọc hoặc chọn thêm mới.
          </p>
        </div>
      ) : (
        <motion.div
          className="grid grid-cols-5 gap-6"
          variants={{
            hidden: { opacity: 0 },
            show: { opacity: 1, transition: { staggerChildren: 0.05 } },
          }}
          initial="hidden"
          animate="show"
        >
          {filteredAndSortedLevels.map((level, index) => (
            <motion.div
              key={level.levelId}
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
                <div className="relative h-64 overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
                  <img
                    src={level.imageUrl || '/assets/placeholder.svg'}
                    alt={level.name}
                    className="object-cover w-full h-full transition-all duration-500 group-hover:scale-110"
                    onError={(e) => {
                      e.target.src = '/assets/placeholder.svg';
                    }}
                  />

                  {/* Overlay Effects */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-black/40 opacity-30 group-hover:opacity-100 transition-opacity duration-300" />

                  {/* Floating Status Badge */}
                  <div className="absolute top-3 left-3 transform transition-all duration-300 group-hover:scale-110">
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: index * 0.1 }}>
                      {getStatusBadge(level.status)}
                    </motion.div>
                  </div>

                  {/* Enhanced Action Menu */}
                  {(level.status === 'PENDING' || level.status === 'DENIED') && (
                    <div className="absolute top-2.5 right-3 opacity-80 group-hover:opacity-100">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <div className="relative">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-9 w-9 bg-amber-500 text-gray-200 shadow-lg border-2 border-amber-400 backdrop-blur-sm hover:bg-amber-600 hover:text-white"
                            >
                              <Clock className="h-5 w-5" />
                            </Button>
                            <div className="absolute top-0 right-0 h-3 w-3 bg-red-500/50 rounded-full animate-ping"></div>
                          </div>
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
                                  <AlertDialogTitle className="text-xl">Xác nhận</AlertDialogTitle>
                                  <AlertDialogDescription className="text-gray-600">
                                    Bạn có chắc chắn muốn phê duyệt cấp độ &quot;{level.name}&quot;?
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel className="rounded-lg hover:bg-gray-100">Hủy</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleApproveLevel(level.levelId)}
                                    className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-lg"
                                  >
                                    Phê duyệt
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                            <DropdownMenuItem
                              onClick={() => openDenyDialog(level)}
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
                    {/* Title */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-base font-bold text-gray-900 line-clamp-2 leading-tight group-hover:text-purple-600 transition-colors duration-200">
                          {level.name}
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="w-8 h-1 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
                        </div>
                      </div>

                      {/* Rejected Reason Info */}
                      {level.status === 'DENIED' && level.rejectedReason && (
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
                          <DialogContent className="max-w-lg overflow-hidden" closeDisabled={true}>
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
                                {level.rejectedReason || 'Liên hệ quản trị viên để biết thêm chi tiết'}
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
                        onClick={() => openEditDialog(level)}
                        className="flex-1 h-8 text-xs bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-100 hover:border-blue-300 hover:text-blue-800 rounded-lg transition-all duration-200"
                      >
                        <SquarePen className="mr-1 h-3 w-3" />
                        Sửa
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1 h-8 text-xs bg-red-50 text-red-600 border-red-200 hover:bg-red-100 hover:border-red-300 hover:text-red-800 rounded-lg transition-all duration-200"
                          >
                            <Trash2 className="mr-1 h-3 w-3" />
                            Xóa
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="rounded-xl border-0 shadow-2xl">
                          <AlertDialogHeader>
                            <AlertDialogTitle className="text-xl">Xác nhận</AlertDialogTitle>
                            <AlertDialogDescription className="text-gray-600">
                              Bạn có chắc chắn muốn xóa cấp độ &quot;{level.name}&quot;? Hành động này không thể hoàn
                              tác.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel className="rounded-lg hover:bg-gray-100">Hủy</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDeleteLevel(level.levelId)}
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
      <LevelDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onSave={handleAddLevel}
        title="Thêm cấp độ mới"
        confirmText="Thêm mới"
      />
      <LevelDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        onSave={handleEditLevel}
        title="Chỉnh sửa cấp độ"
        confirmText="Lưu thay đổi"
        initialData={currentLevel}
      />

      {/* Deny Dialog */}
      <AlertDialog open={denyLevel?.status === 'PENDING' || denyLevel?.status === 'DENIED'}>
        <AlertDialogContent className="rounded-lg">
          <AlertDialogHeader>
            <AlertDialogTitle>Từ chối</AlertDialogTitle>
            <AlertDialogDescription>
              Vui lòng nhập lý do từ chối duyệt cấp độ &quot;{denyLevel?.name}&quot;.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="py-4">
            <Textarea
              value={rejectedReason}
              onChange={(e) => setRejectedReason(e.target.value)}
              placeholder="Nhập lý do từ chối"
              className="h-3 text-gray-700"
            />
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => {
                setRejectedReason('');
                setDenyLevel(null);
              }}
              className="hover:bg-gray-100"
            >
              Hủy
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => handleDenyLevel(denyLevel?.levelId)}
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

export default LevelList;
