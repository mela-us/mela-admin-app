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
        const resData = await TopicService.getTopics();
        if (isMounted) {
          setTopics(resData.data || []);
        }
      } catch (error) {
        if (isMounted) {
          let msg = '';
          if (error.response && error.response.data) {
            msg = error.response.data.message;
          } else {
            msg = error.message;
          }
          toast.error({
            title: 'Lỗi lấy chủ đề',
            description: msg || 'Có lỗi xảy ra khi lấy danh sách chủ đề.',
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
      isMounted = false; // cleanup
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
