import { useEffect, useRef, useState } from 'react';
import { CircleCheck, Upload, X } from 'lucide-react';
import { Alert, AlertDescription } from '../../ui/alert';
import { Button } from '../../ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '../../ui/dialog';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';

function LevelDialog({ open, onOpenChange, onSave, title, confirmText, initialData }) {
  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
  const VALID_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
  const fileInputRef = useRef(null);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    selectedImage: null,
    selectedFileName: '',
    previewUrl: '',
  });
  const [isValidName, setIsValidName] = useState(false);
  const [isValidImage, setIsValidImage] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        selectedImage: null,
        previewUrl: initialData.imageUrl,
        selectedFileName: initialData.imageUrl.split('/').pop() || 'image.jpg',
      });
    } else {
      setFormData({ name: '', selectedImage: null, selectedFileName: '', previewUrl: '' });
    }
    setError(null);
  }, [initialData, open]);

  useEffect(() => {
    return () => {
      if (formData.previewUrl) URL.revokeObjectURL(formData.previewUrl);
    };
  }, [formData.previewUrl]);

  useEffect(() => {
    const isNameValid = formData.name.trim().length > 0;
    setIsValidName(isNameValid);
  }, [formData.name]);

  useEffect(() => {
    let isImageValid = false;
    if (initialData) {
      isImageValid = !!formData.previewUrl || !formData.selectedImage;
    } else {
      isImageValid = formData.previewUrl.trim() > 0 || formData.selectedImage !== null;
    }
    setIsValidImage(isImageValid);
  }, [formData.previewUrl, formData.selectedImage]);

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > MAX_FILE_SIZE) {
      setError('File quá lớn! Vui lòng chọn file nhỏ hơn 5MB.');
      return;
    }
    if (!VALID_IMAGE_TYPES.includes(file.type)) {
      setError('Vui lòng chọn file ảnh hợp lệ (JPEG, PNG, JPG, hoặc WebP).');
      return;
    }
    setError(null);
    const newPreviewUrl = URL.createObjectURL(file);
    setFormData((prev) => ({
      ...prev,
      selectedImage: file,
      selectedFileName: file.name,
      previewUrl: newPreviewUrl,
    }));
  };

  const handleSave = async () => {
    if (!isValidName) {
      setError('Vui lòng nhập tên cấp độ.');
      return;
    }
    if (!isValidImage) {
      setError('Vui lòng chọn ảnh hợp lệ.');
      return;
    }
    setError(null);
    setIsLoading(true);
    const levelData = {
      levelName: formData.name,
      ...(formData.selectedImage && { fileBlob: formData.selectedImage, imageName: formData.selectedFileName }),
      ...(initialData && { levelId: initialData.levelId }),
    };
    const isSuccess = await onSave(levelData);
    if (isSuccess) {
      setFormData({ name: '', selectedImage: null, selectedFileName: '', previewUrl: '' });
      onOpenChange(false);
    } else {
      setError('Đã xảy ra lỗi khi lưu cấp độ. Vui lòng điều chỉnh lại thông tin và thử lại.');
    }
    setIsLoading(false);
  };

  const handleNameChange = (e) => {
    setFormData((prev) => ({ ...prev, name: e.target.value }));
  };

  const removeImage = () => {
    if (formData.previewUrl) URL.revokeObjectURL(formData.previewUrl);
    formData.previewUrl = '';
    formData.selectedImage = null;
    setFormData((prev) => ({
      ...prev,
      selectedImage: null,
      selectedFileName: '',
      previewUrl: '',
    }));
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] p-6 rounded-lg">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-center">{title}</DialogTitle>
        </DialogHeader>
        <div className="grid py-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium">
              Tên cấp độ
            </Label>
            <Input
              id="name"
              value={formData.name}
              onChange={handleNameChange}
              placeholder="Nhập tên cấp độ"
              className="h-10"
            />
          </div>
          <div className="space-y-3 mt-6">
            <Label htmlFor="image" className="text-sm font-medium">
              Ảnh cấp độ
            </Label>
            {formData.selectedFileName && !error && (
              <div className="px-3 py-2 bg-gray-50 border border-gray-300 rounded-md">
                <p className="text-sm text-gray-600 flex items-center">
                  <CircleCheck className="w-4 h-4 mr-2" />
                  Đã chọn: {formData.selectedFileName}
                </p>
              </div>
            )}
            <div className="flex flex-col items-center">
              {formData.previewUrl ? (
                <div className="relative w-full h-64 mb-3 bg-gray-50 rounded-lg overflow-hidden border border-gray-200">
                  <img src={formData.previewUrl} alt="Preview" className="object-contain w-full h-full" />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2 w-8 h-8 bg-white text-gray-700 hover:text-white rounded-full"
                    onClick={removeImage}
                  >
                    <X size={16} />
                  </Button>
                </div>
              ) : (
                <div
                  onClick={triggerFileInput}
                  className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 hover:bg-gray-100 cursor-pointer transition-colors"
                >
                  <Upload size={36} className="text-gray-400 mb-2" />
                  <p className="text-sm text-gray-600">Click để tải ảnh lên</p>
                  <p className="text-xs text-gray-500 mt-1">JPEG, PNG, JPG hoặc WebP (tối đa 5MB)</p>
                </div>
              )}
              <Input
                ref={fileInputRef}
                id="image"
                type="file"
                accept={VALID_IMAGE_TYPES.join(',')}
                onChange={handleImageChange}
                className="hidden"
              />
            </div>
          </div>
          {error && (
            <Alert
              variant="destructive"
              className="bg-red-50 border border-red-200 text-red-800 shadow-sm rounded-md mt-6"
            >
              <AlertDescription className="text-sm text-red-700">{error}</AlertDescription>
            </Alert>
          )}
        </div>
        <DialogFooter className="flex gap-3">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="flex-1 h-10">
            Hủy
          </Button>
          <Button
            onClick={handleSave}
            disabled={(initialData && !isValidName) || (!initialData && (!isValidImage || !isValidName)) || isLoading}
            className="flex-1 h-10 button-bg-color"
          >
            {isLoading ? 'Đang lưu...' : confirmText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default LevelDialog;
