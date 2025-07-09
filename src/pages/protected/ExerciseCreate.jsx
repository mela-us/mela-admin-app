import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import ExerciseForm from '../../components/common/exercises/ExerciseForm';
import Loader from '../../components/Loader';
import { useToast } from '../../contexts/ToastContext';
import DashboardLayout from '../../layouts/DashboardLayout';
import { LectureService } from '../../services/LectureService';

export default function ExerciseCreate() {
  const [lectures, setLectures] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const lectureParam = searchParams.get('lecture');

  useEffect(() => {
    let isMounted = true;

    async function fetchLectures() {
      try {
        const response = await LectureService.getLectures();
        if (isMounted) {
          setLectures(response.data || []);
        }
      } catch (error) {
        console.error('Error fetching lectures:', error);
        if (isMounted) {
          toast.error({
            title: 'Lỗi tải dữ liệu',
            description: 'Không thể tải danh sách bài học. Vui lòng thử lại.',
          });
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    fetchLectures();

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
      <ExerciseForm mode="add" lectures={lectures} lectureParam={lectureParam} />
    </DashboardLayout>
  );
}
