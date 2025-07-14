import { Pie, Cell, PieChart, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../ui/card';
import { PieChartIcon } from 'lucide-react';

function ContributorTopicChart({ lectureContributions }) {
  // Kiểm tra và xử lý dữ liệu đầu vào
  const rawData = lectureContributions?.totalCreatedNumberCountByTopic || [];

  const lectureData = rawData
    .filter((topic) => topic && topic.verifiedCount > 0)
    .map((topic) => ({
      name: topic.name || 'Không xác định',
      value: Number(topic.verifiedCount) || 0,
    }));

  const COLORS = ['#ff8042', '#8884d8', '#82ca9d', '#ffc107', '#00c4b4', '#ff4d4f', '#9c27b0', '#795548'];

  // Custom label formatter cho pie chart
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
    if (percent < 0.05) return null; // Không hiển thị label nếu phần trăm < 5%

    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? 'start' : 'end'}
        dominantBaseline="central"
        fontSize={12}
        fontWeight="bold"
      >
        {percent ? `${(percent * 100).toFixed(0)}%` : '0%'}
      </text>
    );
  };

  return (
    <Card className="border-indigo-200 shadow-lg bg-gradient-to-b from-white to-indigo-50/20">
      <CardHeader className="bg-indigo-200/50 border-b border-indigo-200">
        <CardTitle className="text-xl font-bold text-gray-700/90">
          Đóng góp bài học theo chủ đề
        </CardTitle>
        <CardDescription className="text-gray-700/80">
          Các thông tin đóng góp bài học được xét duyệt theo các chủ đề
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 pt-6">
        {lectureData.length > 0 ? (
          <div>
            <div className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={lectureData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={120}
                    fill="#8884d8"
                    labelLine={false}
                    label={renderCustomizedLabel}
                  >
                    {lectureData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value, name) => [
                      `${Number(value).toLocaleString()} bài giảng`,
                      name,
                    ]}
                    labelFormatter={(label) => `Chủ đề: ${label}`}
                    contentStyle={{
                      borderRadius: 8,
                      fontSize: 14,
                      backgroundColor: '#fff',
                      border: '1px solid #e5e7eb',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                    }}
                  />
                  <Legend
                    verticalAlign="bottom"
                    height={36}
                    formatter={(value, entry) => (
                      <span style={{ color: entry.color, fontSize: '12px' }}>
                        {value}
                      </span>
                    )}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="text-gray-400 text-6xl mb-4">
              <PieChartIcon className="w-16 h-16 mx-auto text-indigo-500" />
            </div>
            <p className="text-gray-500 text-lg">Chưa có dữ liệu đóng góp theo chủ đề</p>
            <p className="text-gray-400 text-sm mt-2">
              Dữ liệu sẽ hiển thị khi có bài giảng được xác minh
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default ContributorTopicChart;
