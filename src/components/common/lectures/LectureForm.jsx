import { useEffect, useState } from 'react';
import SectionList from './SectionList';
import { ms } from 'date-fns/locale/ms';
import { ChevronLeft, Loader2, Save, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../../../contexts/ToastContext';
import { LectureService } from '../../../services/LectureService';
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
} from '../../ui/alert-dialog';
import { Button } from '../../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/card';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { Textarea } from '../../ui/textarea';

function LectureForm({ mode, initialData, levels, topics }) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isExitDialogOpen, setIsExitDialogOpen] = useState(false);
  const [_, setTotalUploads] = useState(0);
  const [__, setCompletedUploads] = useState(0);
  const [formData, setFormData] = useState({
    lectureId: '',
    name: '',
    levelId: '',
    topicId: '',
    ordinalNumber: 1,
    description: '',
    sections: [],
  });
  const [originalFormData, setOriginalFormData] = useState(null);

  useEffect(() => {
    if (mode === 'edit' && initialData) {
      const formattedData = {
        name: initialData.name,
        levelId: initialData.levelId,
        topicId: initialData.topicId,
        ordinalNumber: initialData.ordinalNumber,
        description: initialData.description,
        sections: initialData.sections.map((section) => ({
          ...section,
          fileName: section.url ? section.url.split('/').pop() : '',
          file: null,
          isNewFile: false,
        })),
      };
      setFormData(formattedData);
      setOriginalFormData(JSON.parse(JSON.stringify(formattedData)));
    } else {
      resetForm();
    }
  }, [mode, initialData]);

  const resetForm = () => {
    if (mode === 'edit' && originalFormData) {
      setFormData(JSON.parse(JSON.stringify(originalFormData)));
    } else {
      setFormData({
        name: '',
        levelId: '',
        topicId: '',
        ordinalNumber: 1,
        description: '',
        sections: [],
      });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSelectChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSectionChange = (sections) => {
    setFormData({
      ...formData,
      sections,
    });
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      return false;
    }

    if (!formData.levelId) {
      return false;
    }

    if (!formData.topicId) {
      return false;
    }

    if (formData.sections.length === 0) {
      return false;
    }

    for (const section of formData.sections) {
      if (section.sectionType === 'PDF' && !section.url) {
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const uploads = formData.sections.filter((s) => s.sectionType === 'PDF' && s.file && s.isNewFile).length;
      setTotalUploads(uploads);
      setCompletedUploads(0);

      const processedSections = [...formData.sections];

      for (let i = 0; i < processedSections.length; i++) {
        const section = processedSections[i];
        if (section.sectionType === 'PDF' && section.file && section.isNewFile) {
          const fileName = `${section.file.name}`;
          const { preSignedUrl, fileUrl } = await MediaService.getUploadUrl(fileName, 'LECTURE');
          await MediaService.uploadFile(preSignedUrl, section.file);
          processedSections[i] = {
            ...section,
            url: fileUrl,
            file: null,
            isNewFile: false,
          };
          setCompletedUploads((prev) => {
            const newCompleted = prev + 1;
            return newCompleted;
          });
        }
      }

      const lectureData = {
        ...formData,
        sections: processedSections.map((section) => ({
          ordinalNumber: section.ordinalNumber,
          name: section.name,
          sectionType: section.sectionType,
          content: section.content || '',
          url: section.url || '',
        })),
      };

      if (mode === 'edit' && initialData) {
        await LectureService.updateLecture(initialData.lectureId, lectureData);
      } else {
        await LectureService.createLecture(lectureData);
      }
      toast.success({
        title: 'Thành công',
        description: `${mode === 'edit' ? 'Cập nhật' : 'Thêm'} bài học thành công!`,
      });
      navigate('/lectures');
    } catch (error) {
      console.error('Error adding lecture:', error);
      toast.error({
        title: 'Lỗi',
        description: 'Không thể thêm bài học. Vui lòng thử lại.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleExit = () => {
    const hasChanges =
      mode === 'edit'
        ? JSON.stringify(formData) !== JSON.stringify(originalFormData)
        : formData.name || formData.description || formData.levelId || formData.topicId || formData.sections.length > 0;

    if (hasChanges) {
      setIsExitDialogOpen(true);
    } else {
      navigate('/lectures');
    }
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
        <h2 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-purple-700 to-pink-500 bg-clip-text text-transparent ml-2">
          {mode === 'edit' ? 'Chỉnh sửa bài học' : 'Thêm bài học'}
        </h2>
      </div>
      <Card className="border-indigo-200 shadow-lg bg-gradient-to-b from-white to-indigo-50/20">
        <CardHeader className="bg-indigo-200/50 border-b border-indigo-200">
          <CardTitle className="text-xl font-bold text-gray-700/90">Thông tin bài học</CardTitle>
          <CardDescription className="text-gray-700/80">Nhập thông tin cơ bản của bài học</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          <div className="grid gap-2">
            <Label htmlFor="name" className="text-sm font-semibold text-indigo-900">
              Tên bài học
            </Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Nhập tên bài học"
              className="border-indigo-300 bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 rounded-md px-4 py-2 text-indigo-900 placeholder-indigo-400/70 transition-all duration-200"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="levelId" className="text-sm font-semibold text-indigo-900">
                Cấp độ
              </Label>
              <Select value={formData.levelId} onValueChange={(value) => handleSelectChange('levelId', value)}>
                <SelectTrigger className="border-indigo-300 bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 rounded-md text-indigo-900">
                  <SelectValue placeholder="Chọn cấp độ" />
                </SelectTrigger>
                <SelectContent className="bg-white border-indigo-200">
                  <SelectItem value="level_default" className="text-indigo-900 hover:bg-indigo-50">
                    Chọn cấp độ
                  </SelectItem>
                  {levels
                    .filter((level) => level.levelId !== 'null')
                    .map((level) => (
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
            <div className="grid gap-2">
              <Label htmlFor="topicId" className="text-sm font-semibold text-indigo-900">
                Chủ đề
              </Label>
              <Select value={formData.topicId} onValueChange={(value) => handleSelectChange('topicId', value)}>
                <SelectTrigger className="border-indigo-300 bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 rounded-md text-indigo-900">
                  <SelectValue placeholder="Chọn chủ đề" />
                </SelectTrigger>
                <SelectContent className="bg-white border-indigo-200">
                  <SelectItem value="topic_default" className="text-indigo-900 hover:bg-indigo-50">
                    Chọn chủ đề
                  </SelectItem>
                  {topics
                    .filter((topic) => topic.topicId !== 'null')
                    .map((topic) => (
                      <SelectItem
                        key={topic.topicId}
                        value={topic.topicId}
                        className="text-indigo-900 hover:bg-indigo-50"
                      >
                        {topic.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="ordinalNumber" className="text-sm font-semibold text-indigo-900">
                Thứ tự
              </Label>
              <Input
                id="ordinalNumber"
                name="ordinalNumber"
                type="number"
                min="1"
                value={formData.ordinalNumber}
                onChange={handleInputChange}
                className="border-indigo-300 bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 rounded-md px-4 py-2 text-indigo-900 placeholder-indigo-400/70 transition-all duration-200"
                required
              />
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="description" className="text-sm font-semibold text-indigo-900">
              Mô tả
            </Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Nhập mô tả bài học"
              className="border-indigo-300 bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 rounded-md px-4 py-2 text-indigo-900 placeholder-indigo-400/70 transition-all duration-200"
              rows={2}
            />
          </div>
        </CardContent>
      </Card>
      <SectionList sections={formData.sections} onChange={handleSectionChange} />
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
            ${isSubmitting ? 'bg-pink-400' : 'bg-pink-500 hover:bg-pink-700'}
            text-white focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-80`}
        >
          {isSubmitting ? (
            <div className="flex items-center">
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              <span>Đang tải lên...</span>
            </div>
          ) : (
            <div className="flex items-center">
              <Save className="mr-2 h-5 w-5" />
              <span>Lưu bài học</span>
            </div>
          )}
        </Button>
      </div>
      <AlertDialog open={isExitDialogOpen} onOpenChange={setIsExitDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận hủy</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn hủy? Tất cả thông tin đã nhập sẽ bị mất và không thể khôi phục.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Tiếp tục chỉnh sửa</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-500 text-white hover:bg-red-600 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 rounded-md px-4 py-2"
              onClick={() => {
                resetForm();
                navigate('/lectures');
              }}
            >
              Hủy và thoát
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default LectureForm;
