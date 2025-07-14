import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, Legend } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../ui/card';
import { FileText, PieChartIcon } from 'lucide-react';

function UserExerciseOverview({ exerciseStats }) {
  const statsData = exerciseStats || {};

  // Xử lý dữ liệu cho chart - chỉ lấy topic có dữ liệu
  const chartData = (statsData?.statsByTopics || [])
    .filter(topic => topic.totalExercises > 0 || topic.totalAnswers > 0)
    .map((topic) => ({
      name: topic.name.length > 12 ? `${topic.name.substring(0, 12)}...` : topic.name,
      fullName: topic.name,
      averageScore: topic.averageScore ? Number(topic.averageScore.toFixed(2)) : 0.00,
      totalExercises: topic.totalExercises || 0,
      totalCorrectAnswers: topic.totalCorrectAnswers || 0,
      totalAnswers: topic.totalAnswers || 0,
      timeSpent: topic.totalTimeSpent ? Number(topic.totalTimeSpent.toFixed(2)) : 0.00,
      passedExercises: topic.totalPassedExercises || 0,
      correctRate: topic.totalAnswers > 0 ? Number(((topic.totalCorrectAnswers / topic.totalAnswers) * 100).toFixed(2)) : 0,
    }));

  // Tính toán các chỉ số tổng quan
  const totalStats = statsData ? {
    averageScore: statsData.averageScore ? Number(statsData.averageScore.toFixed(2)) : 0.00,
    totalExercises: statsData.totalExercises || 0,
    totalPassedExercises: statsData.totalPassedExercises || 0,
    totalTimeSpent: statsData.totalTimeSpent ? Number(statsData.totalTimeSpent.toFixed(2)) : 0.00,
    averageTimeSpent: statsData.totalExercises > 0 ? Number((statsData.totalTimeSpent / statsData.totalExercises).toFixed(2)) : 0.00,
    totalCorrectAnswers: statsData.totalCorrectAnswers || 0,
    totalAnswers: statsData.totalAnswers || 0,
    correctRate: statsData.totalAnswers > 0 ? Number(((statsData.totalCorrectAnswers / statsData.totalAnswers) * 100).toFixed(2)) : 0,
    passRate: statsData.totalExercises > 0 ? Number(((statsData.totalPassedExercises / statsData.totalExercises) * 100).toFixed(2)) : 0,
  } : null;

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg min-w-[200px]">
          <p className="font-semibold text-gray-800 mb-2">{data.fullName}</p>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Điểm TB:</span>
              <span className="font-medium text-orange-600">{data.averageScore} điểm</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Tổng bài:</span>
              <span className="font-medium text-indigo-600">{data.totalExercises} bài</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Hoàn thành:</span>
              <span className="font-medium text-green-600">{data.passedExercises} bài</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Tỷ lệ đúng:</span>
              <span className="font-medium text-purple-600">{data.correctRate}%</span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="border-indigo-200 shadow-lg bg-gradient-to-b from-white to-indigo-50/20">
      <CardHeader className="bg-indigo-200/50 border-b border-indigo-200">
        <CardTitle className="text-xl font-bold text-gray-700/90">Thống kê bài tập</CardTitle>
        <CardDescription className="text-gray-700/80">Thông số làm bài tập của người học</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 pt-6">
        {totalStats ? (
          <>
            {/* Thống kê tổng quan */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-3 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg">
                <p className="text-sm font-semibold text-blue-900 mb-1">Điểm trung bình</p>
                <div className="text-2xl font-bold text-blue-700">{totalStats.averageScore}</div>
                <p className="text-xs text-blue-600">/ 100 điểm</p>
              </div>

              <div className="p-3 bg-gradient-to-r from-indigo-50 to-indigo-100 rounded-lg">
                <p className="text-sm font-semibold text-indigo-900 mb-1">Tổng bài tập</p>
                <div className="text-2xl font-bold text-indigo-700">{totalStats.totalExercises.toLocaleString()}</div>
                <p className="text-xs text-indigo-600">bài tập</p>
              </div>

              <div className="p-3 bg-gradient-to-r from-green-50 to-green-100 rounded-lg">
                <p className="text-sm font-semibold text-green-900 mb-1">Hoàn thành</p>
                <div className="text-2xl font-bold text-green-700">{totalStats.totalPassedExercises.toLocaleString()}</div>
                <p className="text-xs text-green-600">({totalStats.passRate}%)</p>
              </div>

              <div className="p-3 bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg">
                <p className="text-sm font-semibold text-purple-900 mb-1">Tỷ lệ đúng</p>
                <div className="text-2xl font-bold text-purple-700">{totalStats.correctRate}%</div>
                <p className="text-xs text-purple-600">{totalStats.totalCorrectAnswers}/{totalStats.totalAnswers}</p>
              </div>

              <div className="p-3 bg-gradient-to-r from-amber-50 to-amber-100 rounded-lg">
                <p className="text-sm font-semibold text-amber-900 mb-1">Tổng thời gian</p>
                <div className="text-2xl font-bold text-amber-700">{totalStats.totalTimeSpent}</div>
                <p className="text-xs text-amber-600">phút</p>
              </div>

              <div className="p-3 bg-gradient-to-r from-pink-50 to-pink-100 rounded-lg">
                <p className="text-sm font-semibold text-pink-900 mb-1">TB mỗi bài</p>
                <div className="text-2xl font-bold text-pink-700">{totalStats.averageTimeSpent}</div>
                <p className="text-xs text-pink-600">phút/bài</p>
              </div>
            </div>

            {/* Biểu đồ */}
            {chartData.length > 0 ? (
              <div>
                <div className="h-96">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={chartData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis
                        dataKey="name"
                        tick={{
                          dy: 10,
                          fill: '#4b5563',
                          fontSize: 11,
                        }}
                        angle={-45}
                        textAnchor="end"
                        height={80}
                      />
                      <YAxis
                        tick={{
                          dx: -5,
                          fill: '#4b5563',
                          fontSize: 11,
                        }}
                      />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend
                        verticalAlign="top"
                        height={36}
                        formatter={(value) => (
                          <span className="text-sm text-gray-700">{value}</span>
                        )}
                      />
                      <Bar
                        dataKey="totalExercises"
                        fill="#6366f1"
                        name="Tổng bài tập"
                        radius={[4, 4, 0, 0]}
                      />
                      <Bar
                        dataKey="passedExercises"
                        fill="#10b981"
                        name="Bài hoàn thành"
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="text-gray-400 text-6xl mb-4">
                  <FileText className="w-16 h-16 mx-auto text-indigo-500" />
                </div>
                <p className="text-gray-500 text-lg">Chưa có dữ liệu chi tiết theo chủ đề</p>
                <p className="text-gray-400 text-sm mt-2">
                  Hãy bắt đầu làm bài tập để xem thống kê chi tiết
                </p>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-8">
            <div className="text-gray-400 text-6xl mb-4">
              <PieChartIcon className="w-16 h-16 mx-auto text-indigo-500" />
            </div>
            <p className="text-gray-500 text-lg">Chưa có dữ liệu thống kê bài tập</p>
            <p className="text-gray-400 text-sm mt-2">
              Dữ liệu sẽ hiển thị sau khi bạn hoàn thành bài tập đầu tiên
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default UserExerciseOverview;
