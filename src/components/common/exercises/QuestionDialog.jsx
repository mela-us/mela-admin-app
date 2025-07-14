import { useEffect, useState } from 'react';
import MathEditor from './MathEditor';
import { Plus, Trash2, X } from 'lucide-react';
import { Alert, AlertDescription } from '../../ui/alert';
import { Badge } from '../../ui/badge';
import { Button } from '../../ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../../ui/dialog';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { RadioGroup, RadioGroupItem } from '../../ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';
import { Textarea } from '../../ui/textarea';
import { TooltipProvider } from '../../ui/tooltip';

export default function QuestionDialog({
  open,
  onOpenChange,
  question,
  onSave,
  maxOrdinalNumber,
  uploadedImages,
  onImageUpload,
}) {
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    questionId: '',
    ordinalNumber: 1,
    content: '',
    questionType: 'MULTIPLE_CHOICE',
    options: [
      { ordinalNumber: 1, content: '', isCorrect: true },
      { ordinalNumber: 2, content: '', isCorrect: false },
    ],
    blankAnswer: '',
    solution: '',
    guide: '',
    terms: '',
  });
  const [activeTab, setActiveTab] = useState('content');

  useEffect(() => {
    setActiveTab('content');
    if (open && question) {
      setFormData({
        questionId: question.questionId,
        ordinalNumber: question.ordinalNumber,
        content: question.content,
        questionType: question.questionType,
        options: question.options.map((opt) => ({
          ordinalNumber: opt.ordinalNumber,
          content: opt.content,
          isCorrect: opt.isCorrect,
        })),
        blankAnswer: question.blankAnswer || '',
        solution: question.solution || '',
        guide: question.guide || '',
        terms: question.terms || '',
      });
    } else if (open) {
      setFormData({
        questionId: crypto.randomUUID(),
        ordinalNumber: maxOrdinalNumber + 1,
        content: '',
        questionType: 'MULTIPLE_CHOICE',
        options: [
          { ordinalNumber: 1, content: '', isCorrect: true },
          { ordinalNumber: 2, content: '', isCorrect: false },
        ],
        blankAnswer: '',
        solution: '',
        guide: '',
        terms: '',
      });
    }
  }, [open, question, maxOrdinalNumber]);

  const handleContentChange = (content) => {
    setFormData({ ...formData, content });
  };

  const handleSolutionChange = (solution) => {
    setFormData({ ...formData, solution });
  };

  const handleQuestionTypeChange = (type) => {
    if (type === formData.questionType) return;

    if (type === 'MULTIPLE_CHOICE') {
      setFormData({
        ...formData,
        questionType: type,
        options: [
          { ordinalNumber: 1, content: '', isCorrect: true },
          { ordinalNumber: 2, content: '', isCorrect: false },
        ],
        blankAnswer: '',
      });
    } else if (type === 'FILL_IN_THE_BLANK') {
      setFormData({
        ...formData,
        questionType: type,
        options: [],
        blankAnswer: '',
      });
    } else if (type === 'ESSAY') {
      setFormData({
        ...formData,
        questionType: type,
        options: [],
        blankAnswer: '',
      });
    }
  };

  const handleOptionContentChange = (ordinalNumber, content) => {
    const updatedOptions = formData.options.map((option) =>
      option.ordinalNumber === ordinalNumber ? { ...option, content } : option,
    );
    setFormData({ ...formData, options: updatedOptions });
  };

  const handleCorrectOptionChange = (ordinalNumberStr) => {
    const ordinalNumber = Number(ordinalNumberStr);
    const updatedOptions = formData.options.map((option) => ({
      ...option,
      isCorrect: option.ordinalNumber === ordinalNumber,
    }));
    setFormData({ ...formData, options: updatedOptions });
  };

  const handleBlankAnswerChange = (blankAnswer) => {
    setFormData({ ...formData, blankAnswer });
  };

  const handleGuideChange = (e) => {
    setFormData({ ...formData, guide: e.target.value });
  };

  const handleTermsChange = (e) => {
    setFormData({ ...formData, terms: e.target.value });
  };

  const addOption = () => {
    const newOrdinalNumber = formData.options.length + 1;
    setFormData({
      ...formData,
      options: [...formData.options, { ordinalNumber: newOrdinalNumber, content: '', isCorrect: false }],
    });
  };

  const removeOption = (ordinalNumber) => {
    if (formData.options.length <= 2) return;

    const needNewCorrect = formData.options.find((o) => o.ordinalNumber === ordinalNumber)?.isCorrect;
    const filteredOptions = formData.options.filter((option) => option.ordinalNumber !== ordinalNumber);
    const updatedOptions = filteredOptions.map((option, index) => ({
      ...option,
      ordinalNumber: index + 1,
      isCorrect: needNewCorrect && index === 0 ? true : option.isCorrect,
    }));

    setFormData({ ...formData, options: updatedOptions });
  };

  const validateForm = () => {
    if (!formData.content.trim()) {
      setError('Vui lòng nhập nội dung câu hỏi');
      return false;
    }
    if (formData.questionType === 'MULTIPLE_CHOICE') {
      if (formData.options.length < 2) {
        setError('Câu hỏi trắc nghiệm cần ít nhất 2 phương án trả lời');
        return false;
      }
      if (formData.options.some((o) => !o.content.trim())) {
        setError('Vui lòng nhập nội dung cho tất cả các phương án trả lời');
        return false;
      }
    } else if (formData.questionType === 'FILL_IN_THE_BLANK') {
      if (!formData.blankAnswer.trim()) {
        setError('Vui lòng nhập đáp án điền khuyết');
        return false;
      }
    }
    if (!formData.solution.trim()) {
      setError('Vui lòng nhập hướng dẫn giải');
      return false;
    }
    setError(null);
    return true;
  };

  const handleSave = () => {
    if (!validateForm()) return;
    onSave(formData);
    onOpenChange(false);
  };

  return (
    <TooltipProvider>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-5xl h-[90vh] overflow-y-auto" closeDisabled={true}>
          <DialogHeader className="border-b pb-4 border-gray-300">
            <DialogTitle className="text-2xl font-semibold text-indigo-900/90">
              {question ? 'Chỉnh sửa câu hỏi' : 'Thêm câu hỏi mới'}
            </DialogTitle>
            <DialogClose className="absolute right-4 top-4 text-gray-500 hover:text-gray-700 transition-colors">
              <X className="h-5 w-5" />
            </DialogClose>
            <DialogDescription className="mt-1 text-sm text-gray-500">
              Vui lòng nhập thông tin chi tiết cho câu hỏi bên dưới
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-3">
            <div className="grid grid-cols-4 gap-4">
              <div className="col-span-1">
                <Label htmlFor="ordinalNumber" className="text-sm font-semibold text-indigo-900">
                  Số thứ tự
                </Label>
                <Select
                  value={formData.ordinalNumber.toString()}
                  onValueChange={(value) => setFormData({ ...formData, ordinalNumber: Number.parseInt(value) })}
                >
                  <SelectTrigger
                    id="ordinalNumber"
                    className="border-indigo-300 bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 rounded-md text-indigo-900 mt-1"
                  >
                    <SelectValue placeholder="Chọn thứ tự" className="text-sm" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-indigo-200">
                    {Array.from({ length: maxOrdinalNumber + 1 }, (_, i) => i + 1).map((num) => (
                      <SelectItem
                        key={num}
                        value={num.toString()}
                        className="text-sm text-indigo-900 hover:bg-indigo-50"
                      >
                        {num}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="col-span-3">
                <Label htmlFor="questionType" className="text-sm font-semibold text-indigo-900">
                  Loại câu hỏi
                </Label>
                <Select value={formData.questionType} onValueChange={handleQuestionTypeChange}>
                  <SelectTrigger
                    id="questionType"
                    className="border-indigo-300 bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 rounded-md text-indigo-900 mt-1"
                  >
                    <SelectValue placeholder="Chọn loại câu hỏi" className="text-sm" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-indigo-200">
                    <SelectItem value="MULTIPLE_CHOICE" className="text-sm text-indigo-900 hover:bg-indigo-50">
                      Câu hỏi trắc nghiệm
                    </SelectItem>
                    <SelectItem value="FILL_IN_THE_BLANK" className="text-sm text-indigo-900 hover:bg-indigo-50">
                      Câu hỏi điền khuyết
                    </SelectItem>
                    <SelectItem value="ESSAY" className="text-sm text-indigo-900 hover:bg-indigo-50">
                      Câu hỏi tự luận
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid grid-cols-4 w-full bg-neutral-100 rounded-lg p-1">
                <TabsTrigger
                  value="content"
                  className="data-[state=active]:bg-violet-300/70 data-[state=active]:shadow rounded-md"
                >
                  Nội dung
                </TabsTrigger>
                <TabsTrigger
                  value="answer"
                  className="data-[state=active]:bg-violet-300/70 data-[state=active]:shadow rounded-md"
                >
                  Đáp án
                </TabsTrigger>
                <TabsTrigger
                  value="solution"
                  className="data-[state=active]:bg-violet-300/70 data-[state=active]:shadow rounded-md"
                >
                  Hướng dẫn
                </TabsTrigger>
                <TabsTrigger
                  value="metadata"
                  className="data-[state=active]:bg-violet-300/70 data-[state=active]:shadow rounded-md"
                >
                  Gợi ý
                </TabsTrigger>
              </TabsList>

              <div className="mt-4 min-h-[35vh]">
                <TabsContent value="content" className="mt-0">
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold text-indigo-900">Nội dung câu hỏi</Label>
                    <MathEditor
                      value={formData.content}
                      onChange={handleContentChange}
                      uploadedImages={uploadedImages}
                      onImageUpload={onImageUpload}
                      placeholder="Nhập nội dung câu hỏi..."
                      height="h-64"
                    />
                  </div>
                </TabsContent>

                <TabsContent value="answer" className="mt-0 min-h-[35vh]">
                  {formData.questionType === 'MULTIPLE_CHOICE' ? (
                    <div className="space-y-2">
                      <Label className="text-sm font-semibold text-indigo-900">Các phương án trả lời</Label>

                      <RadioGroup
                        value={formData.options.find((o) => o.isCorrect)?.ordinalNumber.toString() || ''}
                        onValueChange={handleCorrectOptionChange}
                        className="space-y-3"
                      >
                        {formData.options.map((option, index) => (
                          <div
                            key={index}
                            className="group relative border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
                          >
                            {/* Header với radio button, label và action buttons */}
                            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-gray-200/50">
                              <div className="flex items-center space-x-3">
                                <RadioGroupItem
                                  value={option.ordinalNumber.toString()}
                                  id={`option-${option.ordinalNumber}`}
                                  className="flex-shrink-0"
                                />
                                <Label
                                  htmlFor={`option-${option.ordinalNumber}`}
                                  className="text-sm font-medium cursor-pointer"
                                >
                                  Lựa chọn {option.ordinalNumber}
                                </Label>
                                {option.isCorrect && (
                                  <Badge className="bg-green-100 text-green-700 hover:bg-green-100 text-xs px-2 py-1">
                                    Đáp án đúng
                                  </Badge>
                                )}
                              </div>

                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() => removeOption(option.ordinalNumber)}
                                disabled={formData.options.length <= 2}
                                className="h-8 w-8 group-hover:opacity-100 transition-opacity hover:bg-red-50 hover:text-red-600 text-gray-700"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>

                            {/* Content area */}
                            <div className="p-4">
                              <MathEditor
                                value={option.content}
                                onChange={(content) => handleOptionContentChange(option.ordinalNumber, content)}
                                uploadedImages={uploadedImages}
                                onImageUpload={onImageUpload}
                                placeholder={`Nhập nội dung phương án ${option.ordinalNumber}...`}
                                height="h-40"
                              />
                            </div>
                          </div>
                        ))}

                        {/* Add new option button as an option-like item */}
                        <div
                          className="group relative border-2 border-dashed border-gray-300 rounded-lg hover:border-pink-400 hover:bg-pink-50/30 transition-all cursor-pointer"
                          onClick={addOption}
                        >
                          <div className="flex items-center justify-center py-6 px-4">
                            <div className="flex items-center space-x-2 text-gray-500 group-hover:text-pink-600">
                              <Plus className="h-5 w-5" />
                              <span className="text-sm font-medium">Thêm lựa chọn mới</span>
                            </div>
                          </div>
                        </div>
                      </RadioGroup>
                    </div>
                  ) : formData.questionType === 'FILL_IN_THE_BLANK' ? (
                    <div className="space-y-2">
                      <Label htmlFor="blankAnswer" className="text-sm font-semibold text-indigo-900">
                        Đáp án điền khuyết
                      </Label>
                      <Input
                        id="blankAnswer"
                        value={formData.blankAnswer}
                        onChange={(e) => handleBlankAnswerChange(e.target.value)}
                        placeholder="Nhập đáp án..."
                        className="h-12"
                      />
                    </div>
                  ) : (
                    <></>
                  )}
                </TabsContent>

                <TabsContent value="solution" className="mt-0 min-h-[35vh]">
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold text-indigo-900">Hướng dẫn giải chi tiết</Label>
                    <MathEditor
                      value={formData.solution}
                      onChange={handleSolutionChange}
                      uploadedImages={uploadedImages}
                      onImageUpload={onImageUpload}
                      placeholder="Nhập lời giải chi tiết..."
                      height="h-80"
                    />
                  </div>
                </TabsContent>

                <TabsContent value="metadata" className="mt-0 min-h-[35vh]">
                  <div className="space-y-8">
                    {/* Gợi ý Section */}
                    <div className="space-y-2">
                      <Label htmlFor="guide" className="text-sm font-semibold text-indigo-900">
                        Nội dung phần gợi ý
                      </Label>
                      <Textarea
                        id="guide"
                        name="guide"
                        value={formData.guide}
                        onChange={handleGuideChange}
                        rows={4}
                        placeholder="Nhập nội dung gợi ý cho câu hỏi..."
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-semibold text-indigo-900">Thuật ngữ liên quan</Label>
                      <Textarea
                        id="terms"
                        name="terms"
                        value={formData.terms}
                        onChange={handleTermsChange}
                        rows={4}
                        placeholder="Nhập các thuật ngữ liên quan ..."
                      />
                    </div>
                  </div>
                </TabsContent>
              </div>
            </Tabs>
          </div>
          {error && (
            <Alert
              variant="destructive"
              className="bg-red-50 border border-red-200 text-red-800 shadow-sm rounded-md mt-0"
            >
              <AlertDescription className="text-sm text-red-700">{error}</AlertDescription>
            </Alert>
          )}

          <DialogFooter className="pt-5 border-gray-300 gap-2">
            <Button variant="outline" className="border-gray-500/50" onClick={() => onOpenChange(false)}>
              Hủy
            </Button>
            <Button onClick={handleSave} className="bg-pink-500 hover:bg-pink-600">
              {question ? 'Cập nhật câu hỏi' : 'Lưu câu hỏi'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </TooltipProvider>
  );
}
