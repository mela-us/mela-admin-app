import { useEffect, useState } from 'react';
import QuestionDialog from './QuestionDialog';
import { ArrowDown, ArrowUp, ChevronLeft, CirclePlus, Edit, Loader2, Save, Trash2, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../../../contexts/ToastContext';
import { ExerciseService } from '../../../services/ExerciseService';
import { MediaService } from '../../../services/MediaService';
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
  AlertDialogTrigger,
} from '../../ui/alert-dialog';
import { Badge } from '../../ui/badge';
import { Button } from '../../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/card';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';

export default function ExerciseForm({ mode, lectures, lectureParam, initialData }) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    exerciseId: '',
    exerciseName: '',
    ordinalNumber: 1,
    lectureId: lectureParam || '',
    questions: [],
  });
  const [originalFormData, setOriginalFormData] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isExitDialogOpen, setIsExitDialogOpen] = useState(false);
  const [isQuestionDialogOpen, setIsQuestionDialogOpen] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [exerciseError, setExerciseError] = useState(null);
  const [questionsError, setQuestionsError] = useState(null);

  const extractImageUrlsFromText = (text) => {
    const regex = /<img[^>]+src=['"]([^'">]+)['"]/g;
    const urls = new Set();
    let match;
    while ((match = regex.exec(text))) {
      urls.add(match[1]);
    }
    return urls;
  };

  const extractAllImageUrls = (questions) => {
    const imageUrlSet = new Set();
    questions.forEach((q) => {
      extractImageUrlsFromText(q.content).forEach((url) => imageUrlSet.add(url));
      extractImageUrlsFromText(q.solution).forEach((url) => imageUrlSet.add(url));
      if (q.options) {
        q.options.forEach((opt) => {
          extractImageUrlsFromText(opt.content).forEach((url) => imageUrlSet.add(url));
        });
      }
    });
    return Array.from(imageUrlSet);
  };

  useEffect(() => {
    if (mode === 'edit' && initialData) {
      const data = {
        exerciseId: initialData.exerciseId || '',
        exerciseName: initialData.exerciseName || '',
        ordinalNumber: initialData.ordinalNumber || 1,
        lectureId: initialData.lectureId || lectureParam || '',
        questions: initialData.questions.map((q) => ({
          questionId: q.questionId,
          ordinalNumber: q.ordinalNumber,
          content: q.content,
          questionType: q.questionType,
          options: q.options
            ? q.options.map((opt) => ({
              ordinalNumber: opt.ordinalNumber,
              content: opt.content,
              isCorrect: opt.isCorrect,
            }))
            : [],
          blankAnswer: q.blankAnswer || '',
          solution: q.solution || '',
          guide: q.guide || '',
          terms: q.terms || '',
        })),
      };
      setFormData(data);
      setOriginalFormData(JSON.parse(JSON.stringify(data)));
      const uniqueImageUrls = extractAllImageUrls(data.questions);
      setUploadedImages(uniqueImageUrls);
    } else {
      resetForm();
    }
  }, [mode, initialData, lectureParam]);

  const resetForm = () => {
    if (mode === 'edit' && originalFormData) {
      setFormData(JSON.parse(JSON.stringify(originalFormData)));
    } else {
      setFormData({
        exerciseId: '',
        exerciseName: '',
        ordinalNumber: 1,
        lectureId: lectureParam || '',
        questions: [],
      });
    }
    setUploadedImages([]);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'ordinalNumber' ? parseInt(value) || 1 : value,
    });
  };

  const handleSelectChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleAddQuestion = () => {
    setCurrentQuestion(null);
    setIsQuestionDialogOpen(true);
  };

  const handleEditQuestion = (question) => {
    setCurrentQuestion(question);
    setIsQuestionDialogOpen(true);
  };

  const handleSaveQuestion = (question) => {
    setQuestionsError(null);
    let updatedQuestions;
    if (currentQuestion) {
      updatedQuestions = formData.questions.map((q) => (q.questionId === question.questionId ? question : q));
    } else {
      updatedQuestions = [...formData.questions, question];
    }

    updatedQuestions = updatedQuestions
      .sort((a, b) => a.ordinalNumber - b.ordinalNumber)
      .map((q, index) => ({ ...q, ordinalNumber: index + 1 }));

    setFormData({ ...formData, questions: updatedQuestions });
    setIsQuestionDialogOpen(false);
  };

  const handleDeleteQuestion = (id) => {
    setQuestionsError(null);
    const updatedQuestions = formData.questions
      .filter((q) => q.questionId !== id)
      .map((q, index) => ({ ...q, ordinalNumber: index + 1 }));
    setFormData({ ...formData, questions: updatedQuestions });
  };

  const handleMoveQuestion = (id, direction) => {
    setQuestionsError(null);
    const index = formData.questions.findIndex((q) => q.questionId === id);
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === formData.questions.length - 1) return;

    const newIndex = direction === 'up' ? index - 1 : index + 1;
    const updatedQuestions = [...formData.questions];
    const [movedQuestion] = updatedQuestions.splice(index, 1);
    updatedQuestions.splice(newIndex, 0, movedQuestion);

    const reorderedQuestions = updatedQuestions.map((q, i) => ({
      ...q,
      ordinalNumber: i + 1,
    }));

    setFormData({ ...formData, questions: reorderedQuestions });
  };

  const handleImageUpload = async (file) => {
    try {
      const { preSignedUrl, fileUrl } = await MediaService.getUploadUrl(file.name, 'EXERCISE');
      await MediaService.uploadFile(preSignedUrl, file);
      setUploadedImages((prev) => [...prev, fileUrl]);
      return fileUrl;
    } catch (error) {
      const msg = error.response?.data?.message || error.message || 'Error uploading image';
      toast.error({
        title: 'Upload Error',
        description: msg,
      });
      return null;
    }
  };

  const validateForm = () => {
    let isValid = true;
    if (!formData.lectureId) {
      setExerciseError('Vui lòng chọn bài học');
      isValid = false;
    }
    if (!formData.exerciseName.trim()) {
      setExerciseError('Vui lòng nhập tên bài luyện tập');
      isValid = false;
    }
    if (isValid) {
      setExerciseError(null);
    }

    if (formData.questions.length === 0) {
      setQuestionsError('Bài luyện tập cần có ít nhất một câu hỏi');
      return false;
    }
    for (const question of formData.questions) {
      if (!question.content.trim()) {
        setQuestionsError(`Câu hỏi số ${question.ordinalNumber} cần có nội dung`);
        return false;
      }
      if (question.questionType === 'MULTIPLE_CHOICE' && question.options.length < 2) {
        setQuestionsError(`Câu hỏi số ${question.ordinalNumber} cần có ít nhất 2 lựa chọn`);
        return false;
      }
      for (const option of question.options) {
        if (!option.content.trim()) {
          setQuestionsError(
            `Lựa chọn số ${option.ordinalNumber} của câu hỏi số ${question.ordinalNumber} cần có nội dung`,
          );
          return false;
        }
      }
      if (question.questionType === 'FILL_IN_THE_BLANK' && !question.blankAnswer?.trim()) {
        setQuestionsError(`Câu hỏi số ${question.ordinalNumber} cần có đáp án điền khuyết`);
        return false;
      }
      if (!question.solution?.trim()) {
        setQuestionsError(`Câu hỏi số ${question.ordinalNumber} cần có hướng dẫn giải`);
        return false;
      }
    }
    setQuestionsError(null);
    return isValid;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    setExerciseError(null);
    setQuestionsError(null);
    setIsSubmitting(true);
    try {
      const exerciseData = { ...formData };

      if (mode === 'add') {
        const resData = await ExerciseService.createExercise(exerciseData);
        const { message } = resData.data;
        toast.success({
          title: 'Add Exercise Success',
          description: message,
        });
      } else {
        const resData = await ExerciseService.updateExercise(formData.exerciseId, exerciseData);
        const { message } = resData.data;
        toast.success({
          title: 'Update Exercise Success',
          description: message,
        });
      }
      navigate('/exercises');
    } catch (error) {
      const msg = error.response?.data?.message || error.message || 'Error saving exercise';
      toast.error({
        title: 'Save Error',
        description: msg,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleExit = () => {
    const hasChanges =
      mode === 'edit'
        ? JSON.stringify(formData) !== JSON.stringify(originalFormData)
        : formData.exerciseName || formData.lectureId || formData.questions.length > 0;

    if (hasChanges) {
      setIsExitDialogOpen(true);
    } else {
      navigate('/exercises');
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
        <h2 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent ml-2">
          {mode === 'add' ? 'Thêm bài luyện tập' : 'Chỉnh sửa bài luyện tập'}
        </h2>
      </div>

      <div className="space-y-8">
        <Card className="border-indigo-200 shadow-lg bg-gradient-to-b from-white to-indigo-50/20">
          <CardHeader className="bg-indigo-200/50 border-b border-indigo-200">
            <CardTitle className="text-xl font-bold text-gray-700/90">Thông tin bài luyện tập</CardTitle>
            <CardDescription className="text-gray-700/80">
              {mode === 'add' ? 'Nhập thông tin cơ bản của bài luyện tập' : 'Chỉnh sửa thông tin bài luyện tập'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
            <div className="grid gap-2">
              <Label htmlFor="exerciseName" className="text-sm font-semibold text-indigo-900">
                Tên bài luyện tập
              </Label>
              <Input
                id="exerciseName"
                name="exerciseName"
                value={formData.exerciseName}
                onChange={handleInputChange}
                placeholder="Nhập tên bài luyện tập"
                className="border-indigo-300 bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 rounded-md px-4 py-2 text-indigo-900 placeholder-indigo-400/70 transition-all duration-200"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="lectureId" className="text-sm font-semibold text-indigo-900">
                  Bài học
                </Label>
                <Select value={formData.lectureId} onValueChange={(value) => handleSelectChange('lectureId', value)}>
                  <SelectTrigger
                    id="lectureId"
                    className="border-indigo-300 bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 rounded-md text-indigo-900"
                  >
                    <SelectValue placeholder="Chọn bài học" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-indigo-200">
                    {lectures.map((lecture) => (
                      <SelectItem
                        key={lecture.lectureId}
                        value={lecture.lectureId}
                        className="text-indigo-900 hover:bg-indigo-50"
                      >
                        {lecture.name}
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
                />
              </div>
            </div>
            {exerciseError && (
              <Alert
                variant="destructive"
                className="bg-red-50 border border-red-200 text-red-800 shadow-sm rounded-md mt-6"
              >
                <AlertDescription className="text-sm text-red-700">{exerciseError}</AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        <Card className="border-indigo-200 shadow-lg bg-gradient-to-b from-white to-indigo-50/20">
          <CardHeader className="bg-indigo-200/50 border-b border-indigo-200 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-xl font-bold text-gray-700/90">Danh sách câu hỏi</CardTitle>
              <CardDescription className="text-gray-700/80">
                Thêm và quản lý các câu hỏi trong bài luyện tập
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            {formData.questions.length === 0 ? (
              <p className="text-indigo-600/70 text-sm">Chưa có câu hỏi nào. Thêm câu hỏi để bắt đầu.</p>
            ) : (
              <div className="space-y-4">
                {formData.questions.map((question) => (
                  <Card
                    key={question.questionId}
                    className="border-indigo-200 bg-white shadow-sm hover:shadow-md transition-shadow"
                  >
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 py-3">
                      <div className="flex items-center">
                        <Badge className="mr-2 bg-purple-500 hover:bg-indigo-600">Câu {question.ordinalNumber}</Badge>
                        <Badge variant="outline" className="border-indigo-300 text-indigo-700 hover:bg-indigo-50">
                          {question.questionType === 'MULTIPLE_CHOICE'
                            ? 'Trắc nghiệm'
                            : question.questionType === 'FILL_IN_THE_BLANK'
                              ? 'Điền khuyết'
                              : 'Tự luận'}
                        </Badge>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => handleMoveQuestion(question.questionId, 'up')}
                          disabled={question.ordinalNumber === 1}
                          className="h-8 w-8 text-indigo-600 hover:bg-indigo-50"
                        >
                          <ArrowUp className="h-4 w-4" />
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => handleMoveQuestion(question.questionId, 'down')}
                          disabled={question.ordinalNumber === formData.questions.length}
                          className="h-8 w-8 text-indigo-600 hover:bg-indigo-50"
                        >
                          <ArrowDown className="h-4 w-4" />
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEditQuestion(question)}
                          className="h-8 w-8 text-indigo-600 hover:bg-indigo-50"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent className="rounded-lg">
                            <AlertDialogHeader>
                              <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
                              <AlertDialogDescription>
                                Bạn có chắc chắn muốn xóa câu hỏi này? Hành động này không thể hoàn tác.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel className="hover:bg-gray-100">Hủy</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDeleteQuestion(question.questionId)}
                                className="bg-red-600 hover:bg-red-700 text-white"
                              >
                                Xóa
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0 pb-3">
                      <div className="text-sm border-l-4 border-indigo-200 pl-3 py-1 mt-1 text-indigo-900">
                        {question.content ? (
                          question.content.length > 50 ? (
                            `${question.content.substring(0, 50)}...`
                          ) : (
                            question.content
                          )
                        ) : (
                          <span className="italic text-gray-400">Hãy thêm nội dung câu hỏi...</span>
                        )}
                      </div>
                      {question.questionType === 'MULTIPLE_CHOICE' && (
                        <div className="mt-3 grid grid-cols-2 gap-2">
                          {question.options.map((option, index) => (
                            <div
                              key={index}
                              className={`flex items-center rounded-md border p-2 text-xs ${
                                option.isCorrect
                                  ? 'border-green-200 bg-green-50 text-green-700'
                                  : 'border-gray-200 bg-gray-50 text-gray-700'
                              }`}
                            >
                              <span className="font-medium">
                                {option.ordinalNumber}.
                                {option.isCorrect && <span className="ml-1 text-green-600">✓</span>}
                              </span>
                              <span className="ml-1 truncate">
                                {option.content.length > 50 ? `${option.content.substring(0, 50)}...` : option.content}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                      {question.questionType === 'FILL_IN_THE_BLANK' && (
                        <div className="mt-3 grid grid-cols-1 gap-2">
                          <span
                            className={`flex items-center rounded-md border p-2 text-xs border-green-200 bg-green-50 ${
                              question.blankAnswer ? 'bg-indigo-100 text-green-700' : 'bg-gray-100 italic text-gray-500'
                            }`}
                          >
                            <span className="font-medium">
                              {question.blankAnswer && <span className="ml-1 mr-2 text-green-600">✓</span>}
                            </span>
                            {question.blankAnswer
                              ? question.blankAnswer.length > 70
                                ? `${question.blankAnswer.substring(0, 70)}...`
                                : question.blankAnswer
                              : 'Hãy thêm đáp án'}
                          </span>
                        </div>
                      )}
                      {question.questionType === 'ESSAY' && (
                        <div className="mt-3 grid grid-cols-1 gap-2">
                          <span
                            className={`flex items-center rounded-md border p-2 text-xs border-green-200 bg-green-50 ${
                              question.solution ? 'bg-indigo-100 text-green-700' : 'bg-gray-100 italic text-gray-500'
                            }`}
                          >
                            <span className="font-medium">
                              {question.solution && <span className="ml-1 mr-2 text-green-600">✓</span>}
                            </span>
                            {question.solution
                              ? question.solution.length > 70
                                ? `${question.solution.substring(0, 70)}...`
                                : question.solution
                              : 'Hãy thêm hướng dẫn giải'}
                          </span>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
            {questionsError && (
              <Alert
                variant="destructive"
                className="bg-red-50 border border-red-200 text-red-800 shadow-sm rounded-md mt-6"
              >
                <AlertDescription className="text-sm text-red-700">{questionsError}</AlertDescription>
              </Alert>
            )}
            <div
              className="group relative border-2 border-dashed border-gray-300 rounded-lg hover:border-pink-400 hover:bg-pink-50/30 transition-all cursor-pointer mt-4"
              onClick={handleAddQuestion}
            >
              <div className="flex items-center justify-center py-6 px-4">
                <div className="flex items-center space-x-2 text-gray-500 group-hover:text-pink-600">
                  <CirclePlus className="h-5 w-5" />
                  <span className="text-sm font-medium">Thêm câu hỏi mới</span>
                </div>
              </div>
            </div>
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
              ${isSubmitting ? 'bg-pink-400' : 'bg-pink-500 hover:bg-pink-700'}
              text-white focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-80`}
          >
            {isSubmitting ? (
              <div className="flex items-center">
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                <span>Đang lưu...</span>
              </div>
            ) : (
              <div className="flex items-center">
                <Save className="mr-2 h-5 w-5" />
                <span>{mode === 'add' ? 'Lưu bài luyện tập' : 'Lưu thay đổi'}</span>
              </div>
            )}
          </Button>
        </div>
      </div>

      <QuestionDialog
        open={isQuestionDialogOpen}
        onOpenChange={setIsQuestionDialogOpen}
        question={currentQuestion}
        onSave={handleSaveQuestion}
        maxOrdinalNumber={formData.questions.length}
        uploadedImages={uploadedImages}
        setUploadedImages={setUploadedImages}
        onImageUpload={handleImageUpload}
      />

      <AlertDialog open={isExitDialogOpen} onOpenChange={setIsExitDialogOpen}>
        <AlertDialogContent className="rounded-lg">
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận thoát</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn thoát? {mode === 'add' ? 'Tất cả thông tin đã nhập' : 'Tất cả thay đổi'} sẽ bị mất
              và không thể khôi phục.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="hover:bg-gray-100">Tiếp tục chỉnh sửa</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                resetForm();
                navigate('/exercises');
              }}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Hủy và thoát
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
