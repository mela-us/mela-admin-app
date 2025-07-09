import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import ExerciseForm from '../../components/common/exercises/ExerciseForm';
import Loader from '../../components/Loader';
import { useToast } from '../../contexts/ToastContext';
import DashboardLayout from '../../layouts/DashboardLayout';
import { ExerciseService } from '../../services/ExerciseService';
import { LectureService } from '../../services/LectureService';

export default function ExerciseEdit() {
  const [lectures, setLectures] = useState([]);
  const [exercise, setExercise] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const lectureParam = searchParams.get('lecture');

  useEffect(() => {
    let isMounted = true;
    async function fetchData() {
      try {
        const [lecturesResData, exerciseResData] = await Promise.all([
          LectureService.getLectures(),
          ExerciseService.getExerciseById(id),
        ]);
        if (isMounted) {
          setLectures(lecturesResData.data || []);
          const exerciseData = {
            exerciseId: exerciseResData.data.exerciseId,
            exerciseName: exerciseResData.data.exerciseName,
            ordinalNumber: exerciseResData.data.ordinalNumber,
            lectureId: exerciseResData.data.lectureId,
            questions: exerciseResData.data.questions.map((q) => ({
              questionId: q.questionId,
              ordinalNumber: q.ordinalNumber,
              content: q.content,
              questionType: q.questionType,
              blankAnswer: q.blankAnswer || '',
              options: q.options
                ? q.options.map((opt) => ({
                  ordinalNumber: opt.ordinalNumber,
                  content: opt.content,
                  isCorrect: opt.isCorrect,
                }))
                : [],
              solution: q.solution || '',
              guide: q.guide || '',
              terms: q.terms || '',
            })),
          };
          setExercise(exerciseData);
        }
      } catch (error) {
        let msg = '';
        if (error.response) {
          msg = error.response.data?.message;
        } else {
          msg = error.message;
        }
        console.error('Error fetching data:', msg);
        if (isMounted) {
          toast.error({
            title: 'Lỗi!',
            description: msg || 'Không thể tải dữ liệu bài tập. Vui lòng thử lại.',
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

  if (!exercise) {
    return <DashboardLayout></DashboardLayout>;
  }

  return (
    <DashboardLayout>
      <ExerciseForm mode="edit" lectures={lectures} lectureParam={lectureParam} initialData={exercise} />
    </DashboardLayout>
  );
}
