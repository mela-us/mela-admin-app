import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import LectureForm from '../../components/common/lectures/LectureForm';
import { useToast } from '../../contexts/ToastContext';
import DashboardLayout from '../../layouts/DashboardLayout';
import { LectureService } from '../../services/LectureService';
import { LevelService } from '../../services/LevelService';
import { TopicService } from '../../services/TopicService';
import Loader from '../../components/Loader';

export default function LectureEdit() {
  const { id } = useParams();
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
        <div className="flex justify-center items-center h-64">
          <div className="text-red-600 text-lg">Không tìm thấy bài học</div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <LectureForm mode="edit" initialData={lecture} levels={levels} topics={topics} />;
    </DashboardLayout>
  );
}
