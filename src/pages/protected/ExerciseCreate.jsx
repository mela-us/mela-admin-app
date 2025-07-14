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
        if (isMounted) {
          const response = await LectureService.getLectures();
          setLectures(response.data || []);
        }
      } catch (error) {
        const msg = error.response?.data?.message || error.message || 'Error loading lectures';
        if (isMounted) {
          toast.error({
            title: 'Fetch Data Error',
            description: msg,
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
