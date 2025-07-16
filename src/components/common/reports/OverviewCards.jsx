import { CheckCircle, Clock, FileText, Users } from 'lucide-react';
import { StatCard } from '../../ui/stat-card';
import { getCurrentMonthYear } from '../../../lib/utils';

function OverviewCards({ newUsersStat, completedTestsStat, completedExercisesStat, exerciseAverageTimeStat }) {
  return (
    <div className="grid grid-cols-4 gap-6">
      <StatCard
        title="Người Dùng Mới"
        value={`${newUsersStat?.current?.toLocaleString() || '0'} người` }
        description={`Số người dùng mới đăng ký trong ${getCurrentMonthYear()}`}
        icon={Users}
        color="blue-500"
        comparisonValue={newUsersStat?.percentChange || 0}
        comparisonLabel="so với tháng trước"
        className="border-indigo-200 bg-gradient-to-b from-white to-pink-100/20 hover:border-blue-500"
        isLoading={!newUsersStat}
      />
      <StatCard
        title="Bài Kiểm Tra"
        value={`${completedTestsStat?.current?.toLocaleString() || '0'} lượt`}
        description={`Số lượt làm bài kiểm tra trong ${getCurrentMonthYear()}`}
        icon={CheckCircle}
        color="green-500"
        comparisonValue={completedTestsStat?.percentChange || 0}
        comparisonLabel="so với tháng trước"
        className="border-indigo-200 bg-gradient-to-b from-white to-pink-100/20 hover:border-green-500"
        isLoading={!completedTestsStat}
      />
      <StatCard
        title="Bài Luyện Tập"
        value={`${completedExercisesStat?.current?.toLocaleString() || '0'} lượt`}
        description={`Số lượt làm bài luyện tập trong ${getCurrentMonthYear()}`}
        icon={FileText}
        color="purple-500"
        comparisonValue={completedExercisesStat?.percentChange || 0}
        comparisonLabel="so với tháng trước"
        className="border-indigo-200 bg-gradient-to-b from-white to-pink-100/20 hover:border-purple-500"
        isLoading={!completedExercisesStat}
      />
      <StatCard
        title="Thời Gian Luyện Tập"
        value={exerciseAverageTimeStat?.current ? `${exerciseAverageTimeStat.current} phút` : '0 phút'}
        description= {`Thời gian trung bình cho 1 bài luyện tập trong ${getCurrentMonthYear()}`}
        icon={Clock}
        color="orange-500"
        comparisonValue={exerciseAverageTimeStat?.percentChange || 0}
        comparisonLabel="so với tháng trước"
        className="border-indigo-200 bg-gradient-to-b from-white to-pink-100/20 hover:border-orange-500"
        isLoading={!exerciseAverageTimeStat}
      />
    </div>
  );
}

export default OverviewCards;
