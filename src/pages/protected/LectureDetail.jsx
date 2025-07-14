import { useEffect, useState } from 'react';
import { ChevronLeft, Eye } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import Loader from '../../components/Loader';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { useToast } from '../../contexts/ToastContext';
import DashboardLayout from '../../layouts/DashboardLayout';
import { LectureService } from '../../services/LectureService';
import { LevelService } from '../../services/LevelService';
import { TopicService } from '../../services/TopicService';

export default function LectureDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [lecture, setLecture] = useState(null);
  const [levels, setLevels] = useState([]);
  const [topics, setTopics] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function fetchData() {
      try {
        const [lectureResData, levelsResData, topicsResData] = await Promise.all([
          LectureService.getLectureById(id),
          LevelService.getLevels(),
          TopicService.getTopics(),
        ]);
        if (isMounted) {
          setLecture(lectureResData.data);
          setLevels([{ levelId: 'null', name: 'Chưa có' }, ...(levelsResData.data || [])]);
          setTopics([{ topicId: 'null', name: 'Chưa có' }, ...(topicsResData.data || [])]);
        }
      } catch (error) {
        console.error('Error fetching lecture data:', error);
        if (isMounted) {
          toast.error({
            title: 'Lỗi!',
            description: 'Không thể tải dữ liệu bài học. Vui lòng thử lại.',
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

  const getLevelName = (levelId) => {
    const level = levels.find((l) => l.levelId === levelId);
    return level ? level.name : 'Chưa có';
  };

  const getTopicName = (topicId) => {
    const topic = topics.find((t) => t.topicId === topicId);
    return topic ? topic.name : 'Chưa có';
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <Loader />
      </DashboardLayout>
    );
  }

  if (!lecture) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-10">
          <div className="text-purple-600 text-lg">Không tìm thấy bài học</div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-3 mb-10">
          <Button
            onClick={() => navigate('/lectures')}
            size="sm"
            variant="ghost"
            className="group flex items-center gap-1 border border-indigo-300 bg-white hover:bg-indigo-50 text-indigo-600 px-3 py-1 rounded-md transition-all"
          >
            <ChevronLeft className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform duration-200" />
          </Button>
          <h2 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent ml-2">
            Chi tiết bài học
          </h2>
        </div>
        <Card className="border-indigo-200 shadow-lg bg-gradient-to-b from-white to-indigo-50/20">
          <CardHeader className="bg-indigo-200/50 border-b border-indigo-200">
            <CardTitle className="text-xl font-bold text-gray-700/90 flex items-center gap-2">
              Thông tin bài học
            </CardTitle>
            <CardDescription className="text-gray-700/80">Thông tin chi tiết của bài học</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-indigo-900 min-w-[120px]">Tên bài học:</span>
                <Badge
                  variant="outline"
                  className="bg-pink-50 text-pink-700 hover:bg-pink-100 px-3 py-1 cursor-default text-sm font-medium"
                >
                  {lecture.name}
                </Badge>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-indigo-900 min-w-[120px]">Cấp độ:</span>
                <Badge
                  variant="outline"
                  className="bg-blue-50 text-blue-700 hover:bg-blue-100 px-3 py-1 cursor-default text-sm font-medium"
                >
                  {getLevelName(lecture.levelId)}
                </Badge>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-indigo-900 min-w-[120px]">Chủ đề:</span>
                <Badge
                  variant="outline"
                  className="bg-purple-50 text-purple-700 hover:bg-purple-100 px-3 py-1 cursor-default text-sm font-medium"
                >
                  {getTopicName(lecture.topicId)}
                </Badge>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-indigo-900 min-w-[120px]">Thứ tự:</span>
                <Badge
                  variant="outline"
                  className="bg-amber-50 text-amber-700 hover:bg-amber-100 px-3 py-1 cursor-default text-sm font-medium"
                >
                  #{lecture.ordinalNumber}
                </Badge>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-indigo-900 min-w-[120px]">Mô tả:</span>
                <p className="text-gray-700 bg-white border border-gray-200 rounded-md px-4 py-2">
                  {lecture.description || 'Không có mô tả'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-indigo-200 shadow-lg bg-gradient-to-b from-white to-indigo-50/20">
          <CardHeader className="bg-indigo-200/50 border-b border-indigo-200">
            <CardTitle className="text-xl font-bold text-gray-700/90">Danh sách section</CardTitle>
            <CardDescription className="text-gray-700/90">Các section thuộc bài học</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            {!lecture.sections || lecture.sections.length === 0 ? (
              <p className="text-indigo-600/70 text-sm">Chưa có section nào cho bài học này.</p>
            ) : (
              <div className="space-y-4">
                {lecture.sections.map((section) => (
                  <div
                    key={section.ordinalNumber}
                    className="flex items-center justify-between p-4 border border-gray-300 rounded-lg bg-gray-50"
                  >
                    <div className="flex items-center gap-3">
                      <Badge
                        variant="secondary"
                        className="font-semibold bg-indigo-400/50 hover:bg-indigo-400/50 text-sm"
                      >
                        {section.ordinalNumber}
                      </Badge>
                      <div className="ml-2">
                        <p className="font-medium text-gray-900">{section.name}</p>
                        <Badge variant="secondary" className="mt-1 bg-violet-400 hover:bg-violet-400 text-xs">
                          {section.sectionType}
                        </Badge>
                      </div>
                    </div>
                    {section.sectionType === 'PDF' && section.url && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-blue-600 border-blue-200 hover:bg-blue-50 hover:text-blue-700"
                        onClick={() => window.open(section.url, '_blank')}
                      >
                        <Eye className="h-4 w-4 mr-1" /> Xem PDF
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
