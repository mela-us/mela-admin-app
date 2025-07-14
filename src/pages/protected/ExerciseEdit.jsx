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

  useEffect(() => {
    let isMounted = true;
    async function fetchData() {
      try {
        if (isMounted) {
          const [lecturesResData, exerciseResData] = await Promise.all([
            LectureService.getLectures(),
            ExerciseService.getExerciseById(id),
          ]);
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
        const msg = error.response?.data?.message || error.message || 'Error loading exercise data';
        if (isMounted) {
          toast.error({
            title: 'Fetching Data Error',
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

  if (!exercise) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-10">
          <div className="text-purple-600 text-lg">Không tìm thấy bài luyện tập</div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <ExerciseForm mode="edit" lectures={lectures} initialData={exercise} />
    </DashboardLayout>
  );
}
