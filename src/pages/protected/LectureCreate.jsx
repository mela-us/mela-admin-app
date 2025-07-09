import { useEffect, useState } from 'react';
import LectureForm from '../../components/common/lectures/LectureForm';
import { useToast } from '../../contexts/ToastContext';
import DashboardLayout from '../../layouts/DashboardLayout';
import { LevelService } from '../../services/LevelService';
import { TopicService } from '../../services/TopicService';
import Loader from '../../components/Loader';

export default function LectureCreate() {
  const [isLoading, setIsLoading] = useState(true);
  const [levels, setLevels] = useState([]);
  const [topics, setTopics] = useState([]);
  const { toast } = useToast();

  useEffect(() => {
    let isMounted = true;
    async function fetchData() {
      try {
        const [levelsResData, topicsResData] = await Promise.all([LevelService.getLevels(), TopicService.getTopics()]);
        if (isMounted) {
          setLevels([{ levelId: 'null', name: 'Chưa có' }, ...(levelsResData.data || [])]);
          setTopics([{ topicId: 'null', name: 'Chưa có' }, ...(topicsResData.data || [])]);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        if (isMounted) {
          toast.error({
            title: 'Lỗi!',
            description: 'Có lỗi xảy ra khi tải dữ liệu.',
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
      <LectureForm mode="add" levels={levels} topics={topics} />
    </DashboardLayout>
  );
}
