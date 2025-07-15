import { PieChartIcon } from 'lucide-react';
import { PolarAngleAxis, PolarGrid, PolarRadiusAxis, Radar, RadarChart, ResponsiveContainer, Tooltip } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/card';

function UserSkillsRadar({ skills }) {
  const abbreviateTopicName = (name, index) => {
    if (!name) return `Topic ${index + 1}`;
    if (name.length <= 15) return name;
    const words = name.split(' ').filter((word) => word.length > 0);
    if (words.length === 1) {
      return `${name.substring(0, 10)}...`;
    }
    const abbreviation = words.map((word) => word.charAt(0).toUpperCase()).join('');
    if (abbreviation.length <= 3 && words[0].length > 3) {
      return abbreviation + words[0].substring(1, 4).toLowerCase();
    }
    return abbreviation;
  };

  // Xử lý dữ liệu
  const processedData = (skills || []).map((skill, index) => ({
    topicName: abbreviateTopicName(skill.topicName, index),
    fullName: skill.topicName || `Topic ${index + 1}`,
    points: Math.max(0, Number(skill.points) || 0),
  }));
  const domainMax = 100;

  const hasData = processedData.length > 0;

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold text-gray-800">{data.fullName}</p>
          <p className="text-indigo-600">
            <span className="font-medium">Điểm: </span>
            {data.points.toLocaleString()}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="border-indigo-200 shadow-lg bg-gradient-to-b from-white to-indigo-50/20">
      <CardHeader className="bg-indigo-200/50 border-b border-indigo-200">
        <CardTitle className="text-xl font-bold text-gray-700/90">Kỹ năng theo chủ đề</CardTitle>
        <CardDescription className="text-gray-700/80">Thông tin các kỹ năng của người học</CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        {hasData ? (
          <div>
            <div className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={processedData} margin={{ top: 20, right: 40, left: 40, bottom: 20 }}>
                  <PolarGrid stroke="#e5e7eb" />
                  <PolarAngleAxis
                    dataKey="topicName"
                    tick={{
                      fill: '#4b5563',
                      fontSize: 11,
                      fontWeight: 500,
                    }}
                    className="text-xs"
                  />
                  <PolarRadiusAxis
                    angle={90}
                    domain={[0, domainMax]}
                    tick={{
                      fill: '#6b7280',
                      fontSize: 10,
                    }}
                    tickCount={6}
                  />
                  <Radar
                    name="Điểm kỹ năng"
                    dataKey="points"
                    stroke="#6366f1"
                    fill="#6366f1"
                    fillOpacity={0.3}
                    strokeWidth={2}
                    dot={{ r: 4, fill: '#6366f1' }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="text-gray-400 text-6xl mb-4">
              <PieChartIcon className="w-16 h-16 mx-auto text-indigo-500" />
            </div>
            <p className="text-gray-500 text-lg">Chưa có dữ liệu đóng góp theo chủ đề</p>
            <p className="text-gray-400 text-sm mt-2">Dữ liệu sẽ hiển thị khi có bài giảng được xác minh</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default UserSkillsRadar;
