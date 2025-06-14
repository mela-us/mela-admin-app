
import { StatCard } from "@/components/dashboard/stat-card"
import { Clock, FileText, Users, Network, TrendingUp, Check } from "lucide-react"
import { getMonth } from "date-fns";
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

const getNewUsersStat = async () => {
  await new Promise((resolve) => setTimeout(resolve, 100))
  return {
    data: {
      current: 1250,
      previous: 1120,
      percentChange: 11.6,
    }
  }
};

const getMUIStat = async () => {
  await new Promise((resolve) => setTimeout(resolve, 100))
  return {
    data: {
      current: 1250,
      previous: 1120,
      percentChange: 11.6,
    }
  }
};

const getCompletedExercisesStat = async () => {
  await new Promise((resolve) => setTimeout(resolve, 300))
  return {
    data: {
      current: 8540,
      previous: 7200,
      percentChange: 18.6,
    }
  }
};

const getExerciseAverageTimeStat = async () => {
  await new Promise((resolve) => setTimeout(resolve, 500))
  return {
    data: {
      current: 24.5,
      previous: 26.8,
      percentChange: -8.6,
    }
  }
};

export async function OverviewCards() {
  const [newUsersStat, muiStat, completedExercisesStat, exerciseAverageTimeStat] = await Promise.all([
    getNewUsersStat(),
    getMUIStat(),
    getCompletedExercisesStat(),
    getExerciseAverageTimeStat()
  ]);

  const currentMonth = getMonth(new Date()) + 1;

  return (
    <div>
      <div className="flex flex-col gap-4 md:flex-row md:justify-between md:items-center mb-4">
        <h2 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
          Tổng quát
        </h2>
        <div className="text-sm text-gray-500 flex items-center">
          <Clock className="h-4 w-4 mr-1 opacity-70" />
          Dữ liệu cập nhật: {new Date().toLocaleDateString('vi-VN')}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Người dùng mới"
          value={newUsersStat.data.current.toLocaleString()}
          description={`Số người dùng đăng ký mới trên app trong tháng ${currentMonth}`}
          icon={Users}
          color="blue-500"
          comparisonValue={newUsersStat.data.percentChange}
          comparisonLabel="so với tháng trước"
          className="hover:border-blue-500"
        />

        <StatCard
          title="MAU"
          value={muiStat.data.current.toLocaleString()}
          description={`Monthly Active Users - Số người dùng sử dụng app trong tháng ${currentMonth}`}
          icon={Network}
          color="green-500"
          comparisonValue={muiStat.data.percentChange}
          comparisonLabel="so với tháng trước"
          className="hover:border-green-500"
        />

        <StatCard
          title="Bài tập hoàn thành"
          value={completedExercisesStat.data.current.toLocaleString()}
          description={`Tổng số lượt làm bài tập exercise trên app trong tháng ${currentMonth}`}
          icon={FileText}
          color="indigo-500"
          comparisonValue={completedExercisesStat.data.percentChange}
          comparisonLabel="so với tháng trước"
          className="hover:border-indigo-500"
        />

        <StatCard
          title="Thời gian làm bài"
          value={`${exerciseAverageTimeStat.data.current} phút`}
          description={`Số phút trung bình mỗi exercise được làm trên app trong tháng ${currentMonth}`}
          icon={Clock}
          color="purple-500"
          comparisonValue={exerciseAverageTimeStat.data.percentChange}
          comparisonLabel="so với tháng trước"
          className="hover:border-purple-500"
        />
      </div>
    </div>
  );
}
