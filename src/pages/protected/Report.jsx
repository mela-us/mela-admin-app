import { useEffect, useState } from 'react';
import { BarChart3 } from 'lucide-react';
import HourlyExerciseChart from '../../components/common/reports/HourlyExerciseChart';
import OverviewCards from '../../components/common/reports/OverviewCards';
import UserGrowthChart from '../../components/common/reports/UserGrowthChart';
import Loader from '../../components/Loader';
import { useToast } from '../../contexts/ToastContext';
import DashboardLayout from '../../layouts/DashboardLayout';
import { ReportService } from '../../services/ReportService';

export default function ReportPage() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [newUsersStat, setNewUsersStat] = useState(null);
  const [completedTestsStat, setCompletedTestsStat] = useState(null);
  const [completedExercisesStat, setCompletedExercisesStat] = useState(null);
  const [exerciseAverageTimeStat, setExerciseAverageTimeStat] = useState(null);
  const [hourlyExerciseData, setHourlyExerciseData] = useState([]);
  const [userGrowthData, setUserGrowthData] = useState([]);

  useEffect(() => {
    let isMounted = true;
    async function fetchData() {
      try {
        if (isMounted) {
          const [
            newUsersRes,
            completedTestsRes,
            completedExercisesRes,
            exerciseAverageTimeRes,
            hourlyExerciseRes,
            userGrowthRes,
          ] = await Promise.all([
            ReportService.getNewUsersStat(),
            ReportService.getCompletedTestsStat(),
            ReportService.getCompletedExercisesStat(),
            ReportService.getExerciseAverageTimeStat(),
            ReportService.getHourlyExerciseData(),
            ReportService.getUserGrowthData(),
          ]);
          setNewUsersStat(newUsersRes.data || null);
          setCompletedTestsStat(completedTestsRes.data || null);
          setCompletedExercisesStat(completedExercisesRes.data || null);
          setExerciseAverageTimeStat(exerciseAverageTimeRes.data || null);
          setHourlyExerciseData(hourlyExerciseRes.data || []);
          setUserGrowthData(userGrowthRes.data || []);
        }
      } catch (error) {
        const msg = error.response?.data?.message || error.message || 'Error fetching report data';
        if (isMounted) {
          toast.error({
            title: 'Report Error',
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
      <div className="space-y-8">
        {/* Header */}
        <div className="flex gap-4 flex-row justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-purple-400 to-pink-400 rounded-lg shadow-lg">
              <BarChart3 className="h-7 w-7 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-700">Báo cáo thống kê</h2>
              <p className="text-gray-600 text-sm">Tổng quan và phân tích hành vi người dùng</p>
            </div>
          </div>
        </div>

        {/* Overview Cards */}
        <OverviewCards
          newUsersStat={newUsersStat}
          completedTestsStat={completedTestsStat}
          completedExercisesStat={completedExercisesStat}
          exerciseAverageTimeStat={exerciseAverageTimeStat}
        />

        {/* Charts */}
        <div className="grid gap-8">
          <UserGrowthChart data={userGrowthData} />
          <HourlyExerciseChart data={hourlyExerciseData} />
        </div>
      </div>
    </DashboardLayout>
  );
}
