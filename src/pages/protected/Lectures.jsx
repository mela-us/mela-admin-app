import { useEffect, useState } from 'react';
import { BookOpen } from 'lucide-react';
import LectureList from '../../components/common/lectures/LectureList';
import Loader from '../../components/Loader';
import { useToast } from '../../contexts/ToastContext';
import DashboardLayout from '../../layouts/DashboardLayout';
import { LectureService } from '../../services/LectureService';
import { LevelService } from '../../services/LevelService';
import { TopicService } from '../../services/TopicService';

export default function AdminLecturesPage() {
  const [lectures, setLectures] = useState([]);
  const [levels, setLevels] = useState([]);
  const [topics, setTopics] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    let isMounted = true;
    async function fetchData() {
      try {
        const [lecturesResData, levelsResData, topicsResData] = await Promise.all([
          LectureService.getLectures(),
          LevelService.getLevels(),
          TopicService.getTopics(),
        ]);
        if (isMounted) {
          setLectures(lecturesResData.data || []);
          setLevels([{ levelId: 'null', name: 'Chưa có' }, ...(levelsResData.data || [])]);
          setTopics([{ topicId: 'null', name: 'Chưa có' }, ...(topicsResData.data || [])]);
        }
      } catch (error) {
        let msg = '';
        if (error.response) {
          msg = error.response.data?.message;
        } else {
          msg = error.message || 'Lỗi không xác định';
        }
        toast.error({
          title: 'Lỗi tải dữ liệu',
          description: msg,
        });
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
  }, []);

  if (isLoading) {
    return (
      <DashboardLayout>
        <Loader />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <LectureList lectures={lectures} setLectures={setLectures} levels={levels} topics={topics} />
    </DashboardLayout>
  );
}
