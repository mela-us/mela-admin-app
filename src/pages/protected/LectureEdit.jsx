import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import LectureForm from '../../components/common/lectures/LectureForm';
import Loader from '../../components/Loader';
import { useToast } from '../../contexts/ToastContext';
import DashboardLayout from '../../layouts/DashboardLayout';
import { LectureService } from '../../services/LectureService';
import { LevelService } from '../../services/LevelService';
import { TopicService } from '../../services/TopicService';

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
        if (isMounted) {
          const [lectureResData, levelsResData, topicsResData] = await Promise.all([
            LectureService.getLectureById(id),
            LevelService.getLevels(),
            TopicService.getTopics(),
          ]);
          setLecture(lectureResData.data);
          setLevels([...(levelsResData.data || [])]);
          setTopics([...(topicsResData.data || [])]);
        }
      } catch (error) {
        const msg = error.response?.data?.message || error.message || 'Error fetching lecture data';
        if (isMounted) {
          toast.error({
            title: 'Error Loading Data',
            description: msg,
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
        <div className="flex justify-center items-center h-10">
          <div className="text-purple-600 text-lg">Không tìm thấy bài học</div>
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
