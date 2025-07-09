import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowDown, ArrowUp, ChevronDown, ChevronUp, Eye, FileText, Trash2, Upload } from 'lucide-react';
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
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../../../components/ui/collapsible';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import { Progress } from '../../../components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select';
import { useToast } from '../../../contexts/ToastContext';

function SectionItem({ section, index, isOpen, isFirst, isLast, onToggle, onUpdate, onRemove, onMoveUp, onMoveDown }) {
  const [isRemoving, setIsRemoving] = useState(false);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const { toast } = useToast();

  const handleSectionChange = (field, value) => {
    onUpdate({
      ...section,
      [field]: value,
    });
  };

  const handleSectionTypeChange = (value) => {
    onUpdate({
      ...section,
      sectionType: value,
      content: value === 'text' ? '' : null,
      url: value === 'PDF' || value === 'video' ? null : null,
      file: null,
      fileName: undefined,
      isNewFile: false,
    });
  };

  const handleFileChange = async (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      if (file.size > 20 * 1024 * 1024) {
        toast.error({
          title: 'Lỗi',
          description: 'Kích thước file không được vượt quá 20MB',
        });
        return;
      }

      if (section.sectionType === 'PDF' && file.type !== 'application/pdf') {
        toast.error({
          title: 'Lỗi',
          description: 'Chỉ chấp nhận file PDF',
        });
        return;
      }

      const blobUrl = URL.createObjectURL(file);
      onUpdate({
        ...section,
        url: blobUrl,
        file,
        fileName: file.name,
        isNewFile: true,
      });
    }
  };

  const handleRemoveFile = () => {
    if (section.isNewFile && section.url) {
      URL.revokeObjectURL(section.url);
    }

    onUpdate({
      ...section,
      url: null,
      file: null,
      fileName: undefined,
      isNewFile: false,
    });
  };

  const handleRemoveSection = () => {
    setIsRemoving(true);
    try {
      if (section.isNewFile && section.url) {
        URL.revokeObjectURL(section.url);
      }
      onRemove();
    } catch (error) {
      console.error('Error removing section:', error);
      toast.error({
        title: 'Lỗi',
        description: 'Không thể xóa phần nội dung',
      });
    } finally {
      setIsRemoving(false);
      setShowDeleteAlert(false);
    }
  };

  useEffect(() => {
    if (section.isNewFile && section.url) {
      return () => {
        URL.revokeObjectURL(section.url);
      };
    }
  }, [section.isNewFile, section.url]);

  return (
    <motion.div className="border border-gray-300 rounded-lg overflow-hidden mb-5 shadow-md">
      <Collapsible open={isOpen} onOpenChange={onToggle}>
        <div className="flex items-center justify-between p-4 bg-gray-200">
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="font-semibold bg-indigo-400/50 hover:bg-indigo-400/50 text-sm">
              {section.ordinalNumber}
            </Badge>
            <span className="ml-2 font-medium truncate max-w-md">{section.name || 'Chưa có tên'}</span>
            <Badge variant="secondary" className="ml-2 bg-violet-400 hover:bg-violet-400 text-xs">
              {section.sectionType}
            </Badge>
          </div>
          <div className="flex items-center gap-1">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="text-muted-foreground hover:text-primary"
              onClick={onMoveUp}
              disabled={isFirst}
              title="Di chuyển lên"
            >
              <ArrowUp className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="text-muted-foreground hover:text-primary"
              onClick={onMoveDown}
              disabled={isLast}
              title="Di chuyển xuống"
            >
              <ArrowDown className="h-4 w-4" />
            </Button>
            <AlertDialog open={showDeleteAlert} onOpenChange={setShowDeleteAlert}>
              <AlertDialogTrigger asChild>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="text-red-500 hover:text-red-700 hover:bg-red-100"
                  title="Xóa phần này"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
                  <AlertDialogDescription>
                    Bạn có chắc chắn muốn xóa phần này? Hành động này không thể hoàn tác.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Hủy</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleRemoveSection}
                    className="bg-red-500 hover:bg-red-600 text-white"
                    disabled={isRemoving}
                  >
                    {isRemoving ? 'Đang xóa...' : 'Xóa'}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="icon" title={isOpen ? 'Thu gọn' : 'Mở rộng'}>
                {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </Button>
            </CollapsibleTrigger>
          </div>
        </div>
        <CollapsibleContent>
          <div className="p-6 space-y-6 border-t bg-gray-200/30">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="grid gap-2">
                <Label className="text-sm font-semibold text-indigo-900">Tên section</Label>
                <Input
                  value={section.name}
                  onChange={(e) => handleSectionChange('name', e.target.value)}
                  placeholder="Nhập tên section"
                  className="border-input/60"
                />
              </div>
              <div className="grid gap-2">
                <Label className="text-sm font-semibold text-indigo-900">Loại section</Label>
                <Select value={section.sectionType} onValueChange={(value) => handleSectionTypeChange(value)}>
                  <SelectTrigger className="border-input/60">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PDF">PDF</SelectItem>
                    <SelectItem value="video" disabled>
                      VIDEO (Chưa hỗ trợ)
                    </SelectItem>
                    <SelectItem value="text" disabled>
                      WORD (Chưa hỗ trợ)
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            {section.sectionType === 'PDF' && (
              <div className="grid gap-6">
                {!section.url && (
                  <div className="grid gap-2">
                    <Label className="text-sm font-semibold text-indigo-900">Tải tệp PDF</Label>
                    <div className="border-2 border-dashed rounded-lg p-6 bg-muted/10 border-muted-foreground/20 hover:border-primary/40 transition-colors">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <FileText className="h-10 w-10 text-muted-foreground/70" />
                        <p className="text-sm text-muted-foreground font-medium">
                          Kéo thả tệp PDF vào đây hoặc nhấn nút bên dưới để tải lên
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <Input
                            type="file"
                            accept=".pdf"
                            id={`file-upload-${index}`}
                            onChange={handleFileChange}
                            className="hidden"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => document.getElementById(`file-upload-${index}`)?.click()}
                            className="hover:border-primary"
                          >
                            <Upload className="h-4 w-4 mr-2" /> Chọn tệp PDF
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                {section.url && section.fileName && (
                  <div className="grid gap-2">
                    <Label className="text-sm font-semibold text-indigo-900">Tệp PDF</Label>
                    <div className="flex items-center gap-2 p-4 border rounded-lg bg-white transition-colors">
                      <FileText className="h-6 w-6 text-blue-500" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">{section.fileName}</p>
                        <p className="text-xs text-muted-foreground truncate">{section.url}</p>
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="h-8 hover:border-gray-700"
                        onClick={() => window.open(section.url || '', '_blank')}
                      >
                        <Eye className="h-4 w-4 mr-1" /> Xem
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="h-8 text-red-500 hover:bg-red-50 hover:border-gray-700 hover:text-red-500"
                          >
                            <Trash2 className="h-4 w-4 mr-1" /> Xóa
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
                            <AlertDialogDescription>
                              Bạn có chắc chắn muốn xóa tệp này? Hành động này không thể hoàn tác.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Hủy</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={handleRemoveFile}
                              className="bg-red-500 hover:bg-red-600 text-white"
                            >
                              Xóa
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </CollapsibleContent>
      </Collapsible>
    </motion.div>
  );
}

export default SectionItem;
