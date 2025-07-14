import { CheckCircle, Clock, FileText, Users } from 'lucide-react';
import { StatCard } from '../../ui/stat-card';

function OverviewCards({ newUsersStat, completedTestsStat, completedExercisesStat, exerciseAverageTimeStat }) {
  return (
    <div className="grid grid-cols-4 gap-6">
      <StatCard
        title="Người dùng mới"
        value={newUsersStat?.current?.toLocaleString() || '0'}
        description="Người dùng đăng ký mới trong tháng"
        icon={Users}
        color="blue-500"
        comparisonValue={newUsersStat?.percentChange || 0}
        comparisonLabel="so với tháng trước"
        className="border-indigo-200 bg-gradient-to-b from-white to-pink-100/20 hover:border-blue-500"
        isLoading={!newUsersStat}
      />
      <StatCard
        title="Test hoàn thành"
        value={completedTestsStat?.current?.toLocaleString() || '0'}
        description="Số lượt làm bài kiểm tra trong tháng"
        icon={CheckCircle}
        color="green-500"
        comparisonValue={completedTestsStat?.percentChange || 0}
        comparisonLabel="so với tháng trước"
        className="border-indigo-200 bg-gradient-to-b from-white to-pink-100/20 hover:border-green-500"
        isLoading={!completedTestsStat}
      />
      <StatCard
        title="Bài tập hoàn thành"
        value={completedExercisesStat?.current?.toLocaleString() || '0'}
        description="Số lượt làm bài tập trong tháng"
        icon={FileText}
        color="purple-500"
        comparisonValue={completedExercisesStat?.percentChange || 0}
        comparisonLabel="so với tháng trước"
        className="border-indigo-200 bg-gradient-to-b from-white to-pink-100/20 hover:border-purple-500"
        isLoading={!completedExercisesStat}
      />
      <StatCard
        title="Thời gian làm bài"
        value={exerciseAverageTimeStat?.current ? `${exerciseAverageTimeStat.current} phút` : '0 phút'}
        description="Thời gian làm mỗi bài tập trong tháng"
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
