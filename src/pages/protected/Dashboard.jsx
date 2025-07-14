import { motion } from 'framer-motion';
import {
  AlertTriangle,
  BadgeCheck,
  BadgeX,
  BarChart3,
  BookOpen,
  CheckCircle,
  Clock,
  Edit3,
  Eye,
  FileText,
  Info,
  Settings,
  Shield,
  Star,
  Target,
  Trash2,
  User,
  Users,
  XCircle,
} from 'lucide-react';
import { Badge } from '../../components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { useAuth } from '../../contexts/AuthContext';
import DashboardLayout from '../../layouts/DashboardLayout';

export default function About() {
  const { state } = useAuth();
  const userRole = state?.user?.userRole?.toUpperCase();
  const isAdmin = userRole === 'ADMIN';
  const isContributor = userRole === 'CONTRIBUTOR';

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const AdminFeatures = () => (
    <motion.div variants={itemVariants} className="space-y-6">
      <Card className="border-indigo-200 shadow-lg bg-gradient-to-b from-white to-indigo-50/20">
        <CardHeader className="bg-indigo-200/50 border-b border-indigo-200">
          <CardTitle className="text-xl font-bold text-gray-700/90">Quản lý nội dung học tập</CardTitle>
          <CardDescription className="text-gray-700/80">Bài giảng và bài tập</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 pt-6">
          <div className="flex items-center gap-2">
            <Eye className="h-4 w-4 text-green-500" />
            <span className="text-sm text-gray-700">Xem tất cả nội dung</span>
          </div>
          <div className="flex items-center gap-2">
            <Edit3 className="h-4 w-4 text-blue-500" />
            <span className="text-sm text-gray-700">Thêm và sửa không giới hạn cấp độ</span>
          </div>
          <div className="flex items-center gap-2">
            <Trash2 className="h-4 w-4 text-red-500" />
            <span className="text-sm text-gray-700">Xóa nội dung ở mọi trạng thái</span>
          </div>
          <div className="flex items-center gap-2">
            <BadgeCheck className="h-4 w-4 text-green-500" />
            <span className="text-sm text-gray-700">Phê duyệt nội dung PENDING và DENIED</span>
          </div>
          <div className="flex items-center gap-2">
            <BadgeX className="h-4 w-4 text-orange-500" />
            <span className="text-sm text-gray-700">Từ chối kèm lý do</span>
          </div>
        </CardContent>
      </Card>
      <Card className="border-indigo-200 shadow-lg bg-gradient-to-b from-white to-indigo-50/20">
        <CardHeader className="bg-indigo-200/50 border-b border-indigo-200">
          <CardTitle className="text-xl font-bold text-gray-700/90">Quản lý cấp độ và chủ đề</CardTitle>
          <CardDescription className="text-gray-700/80">Cấp độ và chủ đề học tập</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 pt-6">
          <div className="flex items-center gap-2">
            <Settings className="h-4 w-4 text-gray-500" />
            <span className="text-sm text-gray-700">Quản lý tất cả cấp độ</span>
          </div>
          <div className="flex items-center gap-2">
            <Target className="h-4 w-4 text-indigo-500" />
            <span className="text-sm text-gray-700">Quản lý tất cả chủ đề</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-green-500" />
            <span className="text-sm text-gray-700">Không giới hạn cấp độ quản lý</span>
          </div>
          <div className="flex items-center gap-2">
            <Edit3 className="h-4 w-4 text-blue-500" />
            <span className="text-sm text-gray-700">Thêm, xóa, sử, phê duyệt</span>
          </div>
        </CardContent>
      </Card>
      <Card className="border-indigo-200 shadow-lg bg-gradient-to-b from-white to-indigo-50/20">
        <CardHeader className="bg-indigo-200/50 border-b border-indigo-200">
          <CardTitle className="text-xl font-bold text-gray-700/90">Quản lý người dùng</CardTitle>
          <CardDescription className="text-gray-700/80">Thông tin và hoạt động người dùng</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 pt-6">
          <div className="flex items-center gap-2">
            <Eye className="h-4 w-4 text-green-500" />
            <span className="text-sm text-gray-700">Xem tất cả người dùng</span>
          </div>
          <div className="flex items-center gap-2">
            <Edit3 className="h-4 w-4 text-blue-500" />
            <span className="text-sm text-gray-700">Thêm, xoá và sửa tài khoản người dùng</span>
          </div>
          <div className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4 text-orange-500" />
            <span className="text-sm text-gray-700">Xem thống kê hoạt động</span>
          </div>
        </CardContent>
      </Card>
      <Card className="border-indigo-200 shadow-lg bg-gradient-to-b from-white to-indigo-50/20">
        <CardHeader className="bg-indigo-200/50 border-b border-indigo-200">
          <CardTitle className="text-xl font-bold text-gray-700/90">Thống kê hệ thống</CardTitle>
          <CardDescription className="text-gray-700/80">Báo cáo và phân tích</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 pt-6">
          <div className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4 text-orange-500" />
            <span className="text-sm text-gray-700">Báo cáo toàn hệ thống</span>
          </div>
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-blue-500" />
            <span className="text-sm text-gray-700">Thống kê bài giảng và bài tập</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-pink-500" />
            <span className="text-sm text-gray-700">Thống kê người dùng</span>
          </div>
        </CardContent>
      </Card>
      <Card className="border-indigo-200 shadow-lg bg-gradient-to-b from-white to-indigo-50/20">
        <CardHeader className="bg-indigo-200/50 border-b border-indigo-200">
          <CardTitle className="text-xl font-bold text-gray-700/90 flex items-center gap-2">
            Quyền hạn theo trạng thái nội dung
          </CardTitle>
          <CardDescription className="text-gray-700/80">Quyền hạn với bài giảng và bài tập</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-white rounded-lg border border-indigo-200">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="h-4 w-4 text-yellow-500" />
                <Badge className="bg-yellow-50 text-yellow-700 hover:bg-yellow-100">PENDING</Badge>
              </div>
              <p className="text-sm text-gray-600">Toàn quyền</p>
            </div>
            <div className="p-4 bg-white rounded-lg border border-indigo-200">
              <div className="flex items-center gap-2 mb-2">
                <XCircle className="h-4 w-4 text-red-500" />
                <Badge className="bg-red-50 text-red-700 hover:bg-red-100">DENIED</Badge>
              </div>
              <p className="text-sm text-gray-600">Toàn quyền</p>
            </div>
            <div className="p-4 bg-white rounded-lg border border-indigo-200">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <Badge className="bg-green-50 text-green-700 hover:bg-green-100">VERIFIED</Badge>
              </div>
              <p className="text-sm text-gray-600">Toàn quyền</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );

  const ContributorFeatures = () => (
    <motion.div variants={itemVariants} className="space-y-6">
      <Card className="border-indigo-200 shadow-lg bg-gradient-to-b from-white to-indigo-50/20">
        <CardHeader className="bg-indigo-200/50 border-b border-indigo-200">
          <CardTitle className="text-xl font-bold text-gray-700/90">Quản lý nội dung học tập</CardTitle>
          <CardDescription className="text-gray-700/80">Bài giảng và bài tập</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 pt-6">
          <div className="flex items-center gap-2">
            <Eye className="h-4 w-4 text-green-500" />
            <span className="text-sm text-gray-700">Xem nội dung trong cấp độ được phân công</span>
          </div>
          <div className="flex items-center gap-2">
            <Edit3 className="h-4 w-4 text-blue-500" />
            <span className="text-sm text-gray-700">Thêm và chỉnh sửa trong phạm vi cấp độ cho phép</span>
          </div>
          <div className="flex items-center gap-2">
            <Trash2 className="h-4 w-4 text-red-500" />
            <span className="text-sm text-gray-700">
              Quản lý nội dung <code>PENDING</code> và <code>DENIED</code> của bản thân
            </span>
          </div>
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-orange-500" />
            <span className="text-sm text-gray-700">Không có quyền phê duyệt hay từ chối</span>
          </div>
        </CardContent>
      </Card>
      <Card className="border-indigo-200 shadow-lg bg-gradient-to-b from-white to-indigo-50/20">
        <CardHeader className="bg-indigo-200/50 border-b border-indigo-200">
          <CardTitle className="text-xl font-bold text-gray-700/90">Truy cập cấp độ và chủ đề</CardTitle>
          <CardDescription className="text-gray-700/80">Giới hạn cấp độ và chủ đề</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 pt-6">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-orange-500" />
            <span className="text-sm text-gray-700">Không quản lý cấp độ</span>
          </div>
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-orange-500" />
            <span className="text-sm text-gray-700">Không quản lý chủ đề</span>
          </div>
          <div className="flex items-center gap-2">
            <Target className="h-4 w-4 text-indigo-500" />
            <span className="text-sm text-gray-700">Giới hạn một cấp độ duy nhất</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-green-500" />
            <span className="text-sm text-gray-700">Không giới hạn chủ đề</span>
          </div>
        </CardContent>
      </Card>
      <Card className="border-indigo-200 shadow-lg bg-gradient-to-b from-white to-indigo-50/20">
        <CardHeader className="bg-indigo-200/50 border-b border-indigo-200">
          <CardTitle className="text-xl font-bold text-gray-700/90">Truy cập người dùng</CardTitle>
          <CardDescription className="text-gray-700/80">Thông tin người dùng</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 pt-6">
          <div className="flex items-center gap-2">
            <Eye className="h-4 w-4 text-green-500" />
            <span className="text-sm text-gray-700">Xem danh sách người dùng</span>
          </div>
          <div className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4 text-orange-500" />
            <span className="text-sm text-gray-700">Xem thống kê hoạt động</span>
          </div>
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-orange-500" />
            <span className="text-sm text-gray-700">Không có quyền thêm, xoá và sửa</span>
          </div>
        </CardContent>
      </Card>
      <Card className="border-indigo-200 shadow-lg bg-gradient-to-b from-white to-indigo-50/20">
        <CardHeader className="bg-indigo-200/50 border-b border-indigo-200">
          <CardTitle className="text-xl font-bold text-gray-700/90">Thống kê hệ thống</CardTitle>
          <CardDescription className="text-gray-700/80">Hạn chế truy cập thống kê</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 pt-6">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-orange-500" />
            <span className="text-sm text-gray-700">Không có quyền xem báo cáo</span>
          </div>
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-orange-500" />
            <span className="text-sm text-gray-700">Không có quyền thống kê</span>
          </div>
        </CardContent>
      </Card>
      <Card className="border-indigo-200 shadow-lg bg-gradient-to-b from-white to-indigo-50/20">
        <CardHeader className="bg-indigo-200/50 border-b border-indigo-200">
          <CardTitle className="text-xl font-bold text-gray-700/90 flex items-center gap-2">
            Quyền hạn theo trạng thái nội dung
          </CardTitle>
          <CardDescription className="text-gray-700/80">Quyền hạn với bài giảng và bài tập</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-white rounded-lg border border-indigo-200">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="h-4 w-4 text-yellow-500" />
                <Badge className="bg-yellow-50 text-yellow-700 hover:bg-yellow-100">PENDING</Badge>
              </div>
              <p className="text-sm text-gray-600">Xem, xóa và sửa nội dung của mình</p>
            </div>
            <div className="p-4 bg-white rounded-lg border border-indigo-200">
              <div className="flex items-center gap-2 mb-2">
                <XCircle className="h-4 w-4 text-red-500" />
                <Badge className="bg-red-50 text-red-700 hover:bg-red-100">DENIED</Badge>
              </div>
              <p className="text-sm text-gray-600">Xem, xóa và sửa nội dung của mình</p>
            </div>
            <div className="p-4 bg-white rounded-lg border border-indigo-200">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <Badge className="bg-green-50 text-green-700 hover:bg-green-100">VERIFIED</Badge>
              </div>
              <p className="text-sm text-gray-600">Chỉ xem, không có quyền sửa và xóa</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );

  return (
    <DashboardLayout>
      <motion.div className="space-y-6" variants={containerVariants} initial="hidden" animate="visible">
        <header className="bg-gradient-to-r from-purple-500 to-pink-300 relative rounded-xl p-8 text-white overflow-hidden shadow-lg">
          <div className="absolute inset-0 bg-black/10" />
          <div className="relative flex flex-col md:flex-row justify-between items-start md:items-center">
            <div>
              <h1 className="text-3xl font-bold mb-2 tracking-tight">MELA WEB</h1>
              <p className="text-blue-50 max-w-2xl">
                Quản lý và phát triển nội dung học tập cho ứng dụng MELA. Tạo, chỉnh sửa và quản lý bài giảng, bài tập,
                người dùng và thống kê một cách dễ dàng.
              </p>
            </div>
          </div>
          <Star className="absolute right-0 bottom-0 opacity-20" size={180} />
        </header>

        {/* Overview */}
        <motion.div variants={itemVariants}>
          <Card className="border-indigo-200 shadow-lg bg-gradient-to-b from-white to-indigo-50/20">
            <CardHeader className="bg-indigo-200/50 border-b border-indigo-200">
              <CardTitle className="text-xl font-bold text-gray-700/90">Tổng quan hệ thống</CardTitle>
              <CardDescription className="text-gray-700/80">Nền tảng quản lý nội dung toán học</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <p className="text-gray-700 leading-relaxed">
                MELA WEB là hệ thống quản lý nội dung toán học cho ứng dụng MELA, hỗ trợ quản lý người dùng, cấp độ, chủ
                đề, bài giảng, và bài tập. Hệ thống phân quyền rõ ràng với hai vai trò:
                <strong className="font-bold"> ADMIN</strong> có toàn quyền quản lý và
                <strong className="font-bold"> CONTRIBUTOR</strong> tập trung vào soạn thảo nội dung trong phạm vi cấp
                độ được phân công.
              </p>
              <div className="flex items-center gap-2 mt-4">
                <span className="text-sm font-semibold text-gray-700">Vai trò hiện tại:</span>
                <Badge className="bg-purple-400 text-white px-3 py-1 hover:bg-purple-500 transition-colors">
                  {isAdmin ? (
                    <div className="flex items-center gap-1">
                      <Shield className="h-4 w-4" />
                      ADMIN
                    </div>
                  ) : (
                    <div className="flex items-center gap-1">
                      <User className="h-4 w-4" />
                      CONTRIBUTOR
                    </div>
                  )}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Role-based Content */}
        {isAdmin && <AdminFeatures />}
        {isContributor && <ContributorFeatures />}
      </motion.div>
    </DashboardLayout>
  );
}
