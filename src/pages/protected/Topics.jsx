import { useEffect, useState } from 'react';
import TopicList from '../../components/common/topics/TopicList';
import Loader from '../../components/Loader';
import { useToast } from '../../contexts/ToastContext';
import DashboardLayout from '../../layouts/DashboardLayout';
import { TopicService } from '../../services/TopicService';

export default function AdminTopicsPage() {
  const [topics, setTopics] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    let isMounted = true;
    async function fetchTopics() {
      try {
        if (isMounted) {
          const resData = await TopicService.getTopics();
          setTopics(resData.data || []);
        }
      } catch (error) {
        if (isMounted) {
          const msg = error.response?.data?.message || error.message || 'Error fetching topics';
          toast.error({
            title: 'Fetching Topics Error',
            description: msg,
          });
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }
    fetchTopics();
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
      <TopicList topics={topics} setTopics={setTopics} />
    </DashboardLayout>
  );
}
