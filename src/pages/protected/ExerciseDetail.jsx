import { useEffect, useState } from 'react';
import { ChevronDown, ChevronLeft, ChevronUp } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import MathPreview from '../../components/common/exercises/MathPreview';
import Loader from '../../components/Loader';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { useToast } from '../../contexts/ToastContext';
import DashboardLayout from '../../layouts/DashboardLayout';
import { ExerciseService } from '../../services/ExerciseService';
import { LectureService } from '../../services/LectureService';

export default function ExerciseDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [exercise, setExercise] = useState(null);
  const [lectures, setLectures] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedQuestions, setExpandedQuestions] = useState(new Set());

  useEffect(() => {
    let isMounted = true;

    async function fetchData() {
      try {
        const [exerciseResData, lecturesResData] = await Promise.all([
          ExerciseService.getExerciseById(id),
          LectureService.getLectures(),
        ]);

        if (isMounted) {
          const exerciseData = {
            exerciseId: exerciseResData.data.exerciseId,
            exerciseName: exerciseResData.data.exerciseName,
            ordinalNumber: exerciseResData.data.ordinalNumber,
            lectureId: exerciseResData.data.lectureId,
            questions: exerciseResData.data.questions.map((q) => ({
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

          setExercise(exerciseData);
          setLectures(lecturesResData.data || []);
        }
      } catch (error) {
        if (isMounted) {
          toast.error({
            title: 'Lỗi tải dữ liệu',
            description: error.response?.data?.message || 'Không thể tải thông tin bài tập.',
          });
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [id]);

  const getLectureName = (lectureId) => {
    const lecture = lectures.find((l) => l.lectureId === lectureId);
    return lecture ? lecture.name : 'Chưa có';
  };

  const toggleQuestion = (questionId) => {
    setExpandedQuestions((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(questionId)) {
        newSet.delete(questionId);
      } else {
        newSet.add(questionId);
      }
      return newSet;
    });
  };

  const getQuestionTypeName = (type) => {
    switch (type) {
      case 'MULTIPLE_CHOICE':
        return 'Trắc nghiệm';
      case 'FILL_IN_THE_BLANK':
        return 'Điền khuyết';
      default:
        return 'Tự luận';
    }
  };

  const getQuestionTypeColor = (type) => {
    switch (type) {
      case 'MULTIPLE_CHOICE':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'FILL_IN_THE_BLANK':
        return 'bg-green-50 text-green-700 border-green-200';
      default:
        return 'bg-purple-50 text-purple-700 border-purple-200';
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <Loader />
      </DashboardLayout>
    );
  }

  if (!exercise) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-64">
          <div className="text-red-600 text-lg font-medium">Không tìm thấy bài tập.</div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-3 mb-10">
          <Button
            onClick={() => navigate('/exercises')}
            size="sm"
            variant="ghost"
            className="group flex items-center gap-1 border border-indigo-300 bg-white hover:bg-indigo-50 text-indigo-600 px-3 py-1 rounded-md transition-all"
          >
            <ChevronLeft className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform duration-200" />
          </Button>
          <h2 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-purple-700 to-pink-500 bg-clip-text text-transparent ml-2">
            Chi tiết bài luyện tập
          </h2>
        </div>

        <Card className="border-indigo-200 shadow-lg bg-gradient-to-b from-white to-indigo-50/20">
          <CardHeader className="bg-indigo-200/50 border-b border-indigo-200">
            <CardTitle className="text-xl font-bold text-gray-700/90">Thông tin bài luyện tập</CardTitle>
            <CardDescription className="text-gray-700/80">Thông tin cơ bản của bài luyện tập</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-indigo-900 min-w-[120px]">Tên bài tập:</span>
                <Badge
                  variant="outline"
                  className="bg-indigo-50 text-indigo-700 hover:bg-indigo-100 px-3 py-1 cursor-default text-sm font-medium"
                >
                  {exercise.exerciseName}
                </Badge>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-indigo-900 min-w-[120px]">Bài học:</span>
                <Badge
                  variant="outline"
                  className="bg-blue-50 text-blue-700 hover:bg-blue-100 px-3 py-1 cursor-default text-sm font-medium"
                >
                  {getLectureName(exercise.lectureId)}
                </Badge>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-indigo-900 min-w-[120px]">Thứ tự:</span>
                <Badge
                  variant="outline"
                  className="bg-amber-50 text-amber-700 hover:bg-amber-100 px-3 py-1 cursor-default text-sm font-medium"
                >
                  #{exercise.ordinalNumber}
                </Badge>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-indigo-900 min-w-[120px]">Số câu hỏi:</span>
                <Badge
                  variant="outline"
                  className="bg-emerald-50 text-emerald-700 hover:bg-emerald-100 px-3 py-1 cursor-default text-sm font-medium"
                >
                  {exercise.questions.length} câu
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-indigo-200 shadow-lg bg-gradient-to-b from-white to-indigo-50/20">
          <CardHeader className="bg-indigo-200/50 border-b border-indigo-200">
            <CardTitle className="text-xl font-bold text-gray-700/90">Danh sách câu hỏi</CardTitle>
            <CardDescription className="text-gray-700/80">Các câu hỏi trong bài luyện tập</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            {exercise.questions.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-indigo-600/70 text-lg mb-2">Chưa có câu hỏi nào</div>
                <div className="text-indigo-600/50 text-sm">Hãy thêm câu hỏi để hoàn thiện bài tập</div>
              </div>
            ) : (
              <div className="space-y-4">
                {exercise.questions.map((question) => {
                  const isExpanded = expandedQuestions.has(question.questionId);
                  return (
                    <Card
                      key={question.questionId}
                      className="border-indigo-200 bg-white shadow-sm hover:shadow-md transition-shadow duration-200"
                    >
                      <CardHeader
                        className="cursor-pointer hover:bg-gray-50/50 transition-colors duration-200"
                        onClick={() => toggleQuestion(question.questionId)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Badge className="bg-purple-500 hover:bg-indigo-600 px-3 py-1 font-medium">
                              Câu {question.ordinalNumber}
                            </Badge>
                            <Badge
                              variant="outline"
                              className={`${getQuestionTypeColor(question.questionType)} px-3 py-1 font-medium`}
                            >
                              {getQuestionTypeName(question.questionType)}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-500">{isExpanded ? 'Thu gọn' : 'Mở rộng'}</span>
                            {isExpanded ? (
                              <ChevronUp className="h-4 w-4 text-gray-500" />
                            ) : (
                              <ChevronDown className="h-4 w-4 text-gray-500" />
                            )}
                          </div>
                        </div>
                      </CardHeader>

                      {isExpanded && (
                        <CardContent className="pt-0 pb-6">
                          <div className="space-y-6">
                            {/* Question Content */}
                            <div className="bg-slate-50 rounded-lg p-4 border-l-4 border-indigo-400">
                              <h4 className="text-sm font-semibold text-indigo-900 mb-3 flex items-center gap-2">
                                <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                                Nội dung câu hỏi
                              </h4>
                              <div className="pl-4">
                                <MathPreview content={question.content} />
                              </div>
                            </div>

                            {/* Multiple Choice Options */}
                            {question.questionType === 'MULTIPLE_CHOICE' && (
                              <div className="bg-blue-50 rounded-lg p-4 border-l-4 border-blue-400">
                                <h4 className="text-sm font-semibold text-blue-900 mb-3 flex items-center gap-2">
                                  <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                                  Các đáp án
                                </h4>
                                <div className="pl-4 space-y-3">
                                  {question.options.map((option) => (
                                    <div
                                      key={option.ordinalNumber}
                                      className={`flex items-center gap-3 rounded-lg border p-4 transition-all duration-200 ${
                                        option.isCorrect
                                          ? 'border-green-400 bg-green-200 shadow-sm'
                                          : 'border-gray-200 bg-white hover:border-gray-300'
                                      }`}
                                    >
                                      <div className="flex-shrink-0 flex items-center justify-center">
                                        <div
                                          className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold ${
                                            option.isCorrect ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-600'
                                          }`}
                                        >
                                          {option.ordinalNumber}
                                        </div>
                                        {option.isCorrect && <span className="ml-2 text-green-600 font-bold">✓</span>}
                                      </div>
                                      <div className="flex-1 min-w-0">
                                        <MathPreview content={option.content} />
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Fill in the Blank Answer */}
                            {question.questionType === 'FILL_IN_THE_BLANK' && (
                              <div className="bg-green-50 rounded-lg p-4 border-l-4 border-green-400">
                                <h4 className="text-sm font-semibold text-green-900 mb-3 flex items-center gap-2">
                                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                                  Đáp án điền khuyết
                                </h4>
                                <div className="pl-4">
                                  <div className="flex items-center gap-3 rounded-lg border border-green-300 bg-white p-4">
                                    <span className="text-green-600 font-bold text-lg">✓</span>
                                    <span className="text-green-800 font-medium bg-green-100 px-3 py-1 rounded-md">
                                      {question.blankAnswer}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            )}

                            {/* Solution */}
                            {question.solution && (
                              <div className="bg-amber-50 rounded-lg p-4 border-l-4 border-amber-400">
                                <h4 className="text-sm font-semibold text-amber-900 mb-3 flex items-center gap-2">
                                  <span className="w-2 h-2 bg-amber-500 rounded-full"></span>
                                  Hướng dẫn giải
                                </h4>
                                <div className="pl-4">
                                  <MathPreview content={question.solution} />
                                </div>
                              </div>
                            )}

                            {/* Guide */}
                            {question.guide && (
                              <div className="bg-purple-50 rounded-lg p-4 border-l-4 border-purple-400">
                                <h4 className="text-sm font-semibold text-purple-900 mb-3 flex items-center gap-2">
                                  <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                                  Gợi ý
                                </h4>
                                <div className="pl-4">
                                  <p className="text-purple-800 leading-relaxed">{question.guide}</p>
                                </div>
                              </div>
                            )}

                            {/* Terms */}
                            {question.terms && (
                              <div className="bg-rose-50 rounded-lg p-4 border-l-4 border-rose-400">
                                <h4 className="text-sm font-semibold text-rose-900 mb-3 flex items-center gap-2">
                                  <span className="w-2 h-2 bg-rose-500 rounded-full"></span>
                                  Thuật ngữ liên quan
                                </h4>
                                <div className="pl-4">
                                  <p className="text-rose-800 leading-relaxed">{question.terms}</p>
                                </div>
                              </div>
                            )}
                          </div>
                        </CardContent>
                      )}
                    </Card>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
