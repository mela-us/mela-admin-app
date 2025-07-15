import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/card';

function HourlyExerciseChart({ data }) {
  const formattedData = (data || []).map((item) => ({
    ...item,
    displayHour: `${String(item.hour || 0).padStart(2, '0')}:00`,
  }));

  return (
    <Card className="border-indigo-200 shadow-lg bg-gradient-to-b from-white to-indigo-50/20">
      <CardHeader className="bg-indigo-200/50 border-b border-indigo-200">
        <CardTitle className="text-xl font-bold text-indigo-600">Phân bổ khung giờ làm bài tập</CardTitle>
        <CardDescription className="text-gray-500">Số lượt làm bài tập theo từng khung giờ trong tháng</CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        {formattedData.length > 0 ? (
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={formattedData} margin={{ top: 10, right: 30, left: 10, bottom: 10 }}>
                <defs>
                  <linearGradient id="colorActivity" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ff8042" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#ff8042" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="displayHour" tick={{ dy: 10, fill: '#4b5563', fontSize: 12 }} interval={2} />
                <YAxis tick={{ dx: -5, fill: '#4b5563', fontSize: 12 }} />
                <Tooltip
                  formatter={(value) => [`${value.toLocaleString()} lượt`, 'Số lượt làm bài']}
                  labelFormatter={(label) => {
                    const hour = parseInt(label, 10);
                    const start = String(hour).padStart(2, '0');
                    const end = String((hour + 1) % 24).padStart(2, '0');
                    return `Từ ${start}:00 đến ${end}:00`;
                  }}
                  contentStyle={{ borderRadius: 8, fontSize: 14, backgroundColor: '#fff', border: '1px solid #e5e7eb' }}
                />
                <Area
                  type="monotone"
                  dataKey="count"
                  stroke="#ff8042"
                  fillOpacity={1}
                  fill="url(#colorActivity)"
                  name="Số lượt làm bài"
                  activeDot={{ r: 6, strokeWidth: 2, stroke: '#ff8042', fill: 'white' }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <p className="text-gray-500 text-center py-4">Chưa có dữ liệu phân bổ khung giờ</p>
        )}
      </CardContent>
    </Card>
  );
}

export default HourlyExerciseChart;
