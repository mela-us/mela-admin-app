import { useEffect, useState } from 'react';
import LectureForm from '../../components/common/lectures/LectureForm';
import Loader from '../../components/Loader';
import { useToast } from '../../contexts/ToastContext';
import DashboardLayout from '../../layouts/DashboardLayout';
import { LevelService } from '../../services/LevelService';
import { TopicService } from '../../services/TopicService';

export default function LectureCreate() {
  const [isLoading, setIsLoading] = useState(true);
  const [levels, setLevels] = useState([]);
  const [topics, setTopics] = useState([]);
  const { toast } = useToast();

  useEffect(() => {
    let isMounted = true;
    async function fetchData() {
      try {
        if (isMounted) {
          const [levelsResData, topicsResData] = await Promise.all([
            LevelService.getLevels(),
            TopicService.getTopics(),
          ]);
          setLevels([...(levelsResData.data || [])]);
          setTopics([...(topicsResData.data || [])]);
        }
      } catch (error) {
        const msg = error.response?.data?.message || error.message || 'Error fetching topics and levels';
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
