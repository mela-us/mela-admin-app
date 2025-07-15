import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import ExerciseList from '../../components/common/exercises/ExerciseList';
import Loader from '../../components/Loader';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import DashboardLayout from '../../layouts/DashboardLayout';
import { ExerciseService } from '../../services/ExerciseService';
import { LectureService } from '../../services/LectureService';
import { UserService } from '../../services/UserService';

export default function ExercisesPage() {
  const [lectures, setLectures] = useState([]);
  const [exercises, setExercises] = useState([]);
  const [contributors, setContributors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const { state } = useAuth();
  const [searchParams] = useSearchParams();
  const lectureParam = searchParams.get('lecture');

  useEffect(() => {
    let isMounted = true;
    async function fetchData() {
      try {
        if (isMounted && state.user.userRole?.toUpperCase() === 'CONTRIBUTOR') {
          const [lecturesResData, exercisesResData] = await Promise.all([
            LectureService.getLectures(),
            ExerciseService.getExercises(),
          ]);
          setLectures(lecturesResData.data || []);
          setExercises(exercisesResData.data || []);
        } else if (isMounted && state.user.userRole?.toUpperCase() === 'ADMIN') {
          const [lecturesResData, exercisesResData, contributorsResData] = await Promise.all([
            LectureService.getLectures(),
            ExerciseService.getExercises(),
            UserService.getUsers('CONTRIBUTOR'),
          ]);
          setLectures(lecturesResData.data || []);
          setExercises(exercisesResData.data || []);
          setContributors(contributorsResData.data || []);
        }
        setLectures((prevLectures) => prevLectures.sort((a, b) => a.name?.localeCompare(b.name)));
      } catch (error) {
        const msg = error.response?.data?.message || error.message || 'Error when fetching data';
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
      <ExerciseList
        exercises={exercises}
        setExercises={setExercises}
        lectures={lectures}
        contributors={contributors}
        lectureParam={lectureParam}
      />
    </DashboardLayout>
  );
}
