import { useEffect, useState } from 'react';
import LectureList from '../../components/common/lectures/LectureList';
import Loader from '../../components/Loader';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import DashboardLayout from '../../layouts/DashboardLayout';
import { LectureService } from '../../services/LectureService';
import { LevelService } from '../../services/LevelService';
import { TopicService } from '../../services/TopicService';
import { UserService } from '../../services/UserService';

export default function AdminLecturesPage() {
  const { state } = useAuth();
  const [lectures, setLectures] = useState([]);
  const [levels, setLevels] = useState([]);
  const [topics, setTopics] = useState([]);
  const [contributors, setContributors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    let isMounted = true;
    async function fetchData() {
      try {
        if (isMounted && state.user.userRole?.toLowerCase() === 'contributor') {
          const [lecturesResData, levelsResData, topicsResData] = await Promise.all([
            LectureService.getLectures(),
            LevelService.getLevels(),
            TopicService.getTopics(),
          ]);
          setLectures(lecturesResData.data || []);
          setLevels([...(levelsResData.data || [])]);
          setTopics([...(topicsResData.data || [])]);
        } else if (isMounted && state.user.userRole?.toLowerCase() === 'admin') {
          const [lecturesResData, levelsResData, topicsResData, contributorsResData] = await Promise.all([
            LectureService.getLectures(),
            LevelService.getLevels(),
            TopicService.getTopics(),
            UserService.getUsers('CONTRIBUTOR'),
          ]);
          setLectures(lecturesResData.data || []);
          setLevels([...(levelsResData.data || [])]);
          setTopics([...(topicsResData.data || [])]);
          setContributors([...(contributorsResData.data || [])]);
        }
      } catch (error) {
        const msg = error.response?.data?.message || error.message || 'Error when fetching data';
        if (isMounted) {
          toast.error({
            title: 'Fetch Error',
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
      <LectureList
        lectures={lectures}
        setLectures={setLectures}
        levels={levels}
        topics={topics}
        contributors={contributors}
      />
    </DashboardLayout>
  );
}
