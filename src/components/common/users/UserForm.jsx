import { useEffect, useState } from 'react';
import { Camera, ChevronLeft, Loader2, Save, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../../../contexts/ToastContext';
import { MediaService } from '../../../services/MediaService';
import { UserService } from '../../../services/UserService';
import { Alert, AlertDescription } from '../../ui/alert';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../../ui/alert-dialog';
import { Avatar, AvatarFallback, AvatarImage } from '../../ui/avatar';
import { Button } from '../../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/card';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';

function UserForm({ mode, user, roles, levels }) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isExitDialogOpen, setIsExitDialogOpen] = useState(false);
  const [imagePreview, setImagePreview] = useState(user?.imageUrl || null);
  const [imageFile, setImageFile] = useState(null);
  const [formData, setFormData] = useState({
    username: '',
    fullName: '',
    birthday: '',
    userRole: 'USER',
    levelId: '',
    password: '',
  });
  const [originalFormData, setOriginalFormData] = useState(null);
  const [formError, setFormError] = useState(null);

  useEffect(() => {
    if (mode === 'edit' && user) {
      const formattedData = {
        username: user.username || '',
        fullName: user.fullName || '',
        birthday: user.birthday ? new Date(user.birthday).toISOString().split('T')[0] : '',
        userRole: user.userRole?.toUpperCase() || 'USER',
        levelId: user.levelId || '',
        password: '',
      };
      setFormData(formattedData);
      setOriginalFormData(JSON.parse(JSON.stringify(formattedData)));
      setImagePreview(user.imageUrl || null);
    } else {
      resetForm();
    }
  }, [mode, user]);

  const resetForm = () => {
    if (mode === 'edit' && originalFormData) {
      setFormData(JSON.parse(JSON.stringify(originalFormData)));
      if (imageFile && imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
      setImagePreview(user?.imageUrl || null);
      setImageFile(null);
    } else {
      setFormData({
        username: '',
        fullName: '',
        birthday: '',
        userRole: 'USER',
        levelId: '',
        password: '',
      });
      if (imageFile && imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
      setImagePreview(null);
      setImageFile(null);
    }
    setFormError(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    setFormError(null);
  };

  const handleSelectChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value,
    });
    setFormError(null);
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 5 * 1024 * 1024) {
        setFormError('File quá lớn. Vui lòng chọn file dưới 5MB.');
        return;
      }
      if (!file.type.startsWith('image/')) {
        setFormError('Vui lòng chọn file hình ảnh.');
        return;
      }
      if (imageFile && imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
      const tempUrl = URL.createObjectURL(file);
      setImageFile(file);
      setImagePreview(tempUrl);
    }
  };

  const handleRemoveImage = () => {
    if (imageFile && imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }
    setImagePreview(null);
    setImageFile(null);
  };

  const validateForm = () => {
    let isValid = true;
    if (!formData.username?.trim()) {
      setFormError('Vui lòng nhập tên đăng nhập');
      isValid = false;
    } else if (mode === 'add' && !formData.password?.trim()) {
      setFormError('Vui lòng nhập mật khẩu');
      isValid = false;
    } else if (!formData.userRole) {
      setFormError('Vui lòng chọn vai trò');
      isValid = false;
    } else if (!formData.levelId) {
      setFormError('Vui lòng chọn cấp độ');
      isValid = false;
    }
    return isValid;
  };

  const formatDate = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    setFormError(null);
    setIsSubmitting(true);
    try {
      let imageUrl = null;
      if (imageFile) {
        const fileName = `${imageFile.name}`;
        const { preSignedUrl, fileUrl } = await MediaService.getUploadUrl(fileName, 'USER_AVATAR');
        await MediaService.uploadFile(preSignedUrl, imageFile);
        imageUrl = fileUrl;
        URL.revokeObjectURL(imagePreview);
      }

      const userData = {
        username: formData.username,
        fullName: formData.fullName?.trim() || null,
        birthday: formData.birthday ? formatDate(formData.birthday) : null,
        userRole: formData.userRole,
        levelId: formData.levelId,
        imageUrl: imageUrl || null,
        ...(mode === 'add' || formData.password?.trim() ? { password: formData.password } : {}),
      };

      if (mode === 'edit' && user) {
        await UserService.updateUser(user.userId, userData);
      } else {
        await UserService.createUser(userData);
      }
      toast.success({
        title: `${mode === 'edit' ? 'Update' : 'Create'} User Success`,
        description: `User ${formData.username} has been successfully ${mode === 'edit' ? 'updated' : 'created'}.`,
      });
      navigate('/users');
    } catch (error) {
      const msg = error.response?.data?.message || error.message || 'Error saving user data';
      toast.error({
        title: 'Save User Error',
        description: msg,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleExit = () => {
    const hasChanges =
      mode === 'edit'
        ? JSON.stringify(formData) !== JSON.stringify(originalFormData) || imagePreview !== user?.imageUrl
        : formData.username ||
          formData.fullName ||
          formData.birthday ||
          formData.userRole !== 'USER' ||
          formData.levelId ||
          formData.password ||
          imagePreview;

    if (hasChanges) {
      setIsExitDialogOpen(true);
    } else {
      if (imageFile && imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
      navigate('/users');
    }
  };

  const getUserInitials = (name) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map((part) => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-10">
        <Button
          onClick={handleExit}
          size="sm"
          variant="ghost"
          className="group flex items-center gap-1 border border-indigo-300 bg-white hover:bg-indigo-50 text-indigo-600 px-3 py-1 rounded-md transition-all"
        >
          <ChevronLeft className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform duration-200" />
        </Button>
        <h2 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent ml-2">
          {mode === 'edit' ? 'Chỉnh sửa người dùng' : 'Thêm người dùng mới'}
        </h2>
      </div>

      <Card className="border-indigo-200 shadow-lg bg-gradient-to-b from-white to-indigo-50/20">
        <CardHeader className="bg-indigo-200/50 border-b border-indigo-200">
          <CardTitle className="text-xl font-bold text-gray-700/90">
            {mode === 'edit' ? 'Chỉnh sửa thông tin người dùng' : 'Thông tin người dùng mới'}
          </CardTitle>
          <CardDescription className="text-gray-700/80">
            {mode === 'edit'
              ? 'Cập nhật thông tin người dùng trong hệ thống'
              : 'Nhập thông tin cơ bản để tạo người dùng mới'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          <div className="flex flex-col items-center justify-center pb-6 border-b border-indigo-100">
            <div className="relative group">
              <Avatar className="h-24 w-24 border-4 border-white shadow-md transition-transform duration-200 group-hover:scale-105">
                {imagePreview ? (
                  <AvatarImage src={imagePreview} alt="Avatar preview" className="object-cover" />
                ) : (
                  <AvatarFallback className="bg-indigo-100 text-indigo-600 text-xl font-semibold">
                    {getUserInitials(formData.fullName)}
                  </AvatarFallback>
                )}
              </Avatar>
              <div className="absolute -bottom-2 -right-2 flex space-x-1">
                <div className="relative">
                  <Input id="image" type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                  <Button
                    type="button"
                    size="icon"
                    className="h-8 w-8 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white shadow-md"
                    onClick={() => document.getElementById('image')?.click()}
                  >
                    <Camera className="h-4 w-4" />
                  </Button>
                </div>
                {imagePreview && (
                  <Button
                    type="button"
                    size="icon"
                    variant="outline"
                    className="h-8 w-8 rounded-full bg-white border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 shadow-md"
                    onClick={handleRemoveImage}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
            <p className="text-sm text-indigo-600 mt-4 font-medium">
              {imagePreview ? 'Ảnh đại diện đã chọn' : 'Tải lên ảnh đại diện'}
            </p>
            <p className="text-xs text-gray-500 mt-1">Định dạng: JPG, PNG, JPEG. Kích thước tối đa: 5MB.</p>
          </div>

          <div className="grid grid-cols-6 gap-6">
            <div className="col-span-3">
              <Label htmlFor="username" className="text-sm font-semibold text-indigo-900">
                Tên đăng nhập
              </Label>
              <Input
                id="username"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                placeholder="example@gmail.com"
                className="border-indigo-300 bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 rounded-md px-4 py-2 text-indigo-900 placeholder-indigo-400/70 transition-all duration-200"
              />
            </div>
            <div className="col-span-3">
              <Label htmlFor="password" className="text-sm font-semibold text-indigo-900">
                {mode === 'edit' ? 'Mật khẩu mới' : 'Mật khẩu'}
                {mode === 'edit' && <span className="text-xs text-gray-500 ml-1">(để trống nếu không thay đổi)</span>}
              </Label>
              <Input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder={mode === 'edit' ? 'Nhập mật khẩu mới' : 'Nhập mật khẩu'}
                className="border-indigo-300 bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 rounded-md px-4 py-2 text-indigo-900 placeholder-indigo-400/70 transition-all duration-200"
              />
            </div>
            <div className="col-span-3">
              <Label htmlFor="fullName" className="text-sm font-semibold text-indigo-900">
                Họ và tên
              </Label>
              <Input
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                placeholder="Nhập họ và tên"
                className="border-indigo-300 bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 rounded-md px-4 py-2 text-indigo-900 placeholder-indigo-400/70 transition-all duration-200"
              />
            </div>
            <div className="col-span-3">
              <Label htmlFor="birthday" className="text-sm font-semibold text-indigo-900">
                Ngày sinh
              </Label>
              <Input
                id="birthday"
                name="birthday"
                type="date"
                value={formData.birthday}
                onChange={handleInputChange}
                className="border-indigo-300 bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 rounded-md px-4 py-2 text-indigo-900 transition-all duration-200"
              />
            </div>
            <div className="col-span-3">
              <Label htmlFor="userRole" className="text-sm font-semibold text-indigo-900">
                Vai trò
              </Label>
              <Select value={formData.userRole} onValueChange={(value) => handleSelectChange('userRole', value)}>
                <SelectTrigger className="border-indigo-300 bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 rounded-md text-indigo-900">
                  <SelectValue placeholder="Chọn vai trò" />
                </SelectTrigger>
                <SelectContent className="bg-white border-indigo-200">
                  {roles?.map((role) => (
                    <SelectItem key={role.value} value={role.value} className="text-indigo-900 hover:bg-indigo-50">
                      {role.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="col-span-3">
              <Label htmlFor="levelId" className="text-sm font-semibold text-indigo-900">
                Cấp độ
              </Label>
              <Select value={formData.levelId} onValueChange={(value) => handleSelectChange('levelId', value)}>
                <SelectTrigger className="border-indigo-300 bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 rounded-md text-indigo-900">
                  <SelectValue placeholder="Chọn cấp độ" />
                </SelectTrigger>
                <SelectContent className="bg-white border-indigo-200">
                  {levels?.map((level) => (
                    <SelectItem
                      key={level.levelId}
                      value={level.levelId}
                      className="text-indigo-900 hover:bg-indigo-50"
                    >
                      {level.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          {formError && (
            <Alert
              variant="destructive"
              className="bg-red-50 border border-red-200 text-red-800 shadow-sm rounded-md mt-6"
            >
              <AlertDescription className="text-sm text-red-700">{formError}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-end gap-3 mt-6">
        <Button
          type="button"
          variant="outline"
          onClick={handleExit}
          className="px-5 py-2 border-2 border-gray-300 hover:bg-gray-100 transition-colors duration-200 font-medium rounded-lg focus:ring-2 focus:ring-gray-300 focus:ring-offset-2"
        >
          <X className="mr-2 h-4 w-4" />
          Hủy
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className={`px-5 py-2 rounded-lg font-medium shadow-md transition-all duration-200
            ${isSubmitting ? 'bg-pink-400' : 'bg-pink-500 hover:bg-pink-600'}
            text-white focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 disabled:opacity-80`}
        >
          {isSubmitting ? (
            <div className="flex items-center">
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              <span>Đang lưu...</span>
            </div>
          ) : (
            <div className="flex items-center">
              <Save className="mr-2 h-5 w-5" />
              <span>{mode === 'edit' ? 'Lưu thay đổi' : 'Tạo người dùng'}</span>
            </div>
          )}
        </Button>
      </div>

      <AlertDialog open={isExitDialogOpen} onOpenChange={setIsExitDialogOpen}>
        <AlertDialogContent className="rounded-lg">
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận thoát</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn thoát? {mode === 'edit' ? 'Tất cả thay đổi' : 'Tất cả thông tin đã nhập'} sẽ bị mất
              và không thể khôi phục.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="hover:bg-gray-100 text-sm">Tiếp tục chỉnh sửa</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                resetForm();
                navigate('/users');
              }}
              className="bg-red-600 hover:bg-red-700 text-white text-sm"
            >
              Hủy và thoát
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default UserForm;
