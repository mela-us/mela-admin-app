import { useEffect, useState } from 'react';
import { FileText } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import ExerciseList from '../../components/common/exercises/ExerciseList';
import Loader from '../../components/Loader';
import { useToast } from '../../contexts/ToastContext';
import DashboardLayout from '../../layouts/DashboardLayout';
import { ExerciseService } from '../../services/ExerciseService';
import { LectureService } from '../../services/LectureService';

export default function ExercisesPage() {
  const [lectures, setLectures] = useState([]);
  const [exercises, setExercises] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const lectureParam = searchParams.get('lecture');

  useEffect(() => {
    let isMounted = true;
    async function fetchData() {
      try {
        const [lecturesResData, exercisesResData] = await Promise.all([
          LectureService.getLectures(),
          ExerciseService.getExercises(),
        ]);
        console.log('Exercise:', exercisesResData.data);
        if (isMounted) {
          setLectures(lecturesResData.data || []);
          setExercises(exercisesResData.data || []);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        if (isMounted) {
          toast.error({
            title: 'Lỗi!',
            description: 'Không thể tải dữ liệu bài luyện tập. Vui lòng thử lại.',
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
      <ExerciseList initialLectures={lectures} initialExercises={exercises} lectureParam={lectureParam} />
    </DashboardLayout>
  );
}
