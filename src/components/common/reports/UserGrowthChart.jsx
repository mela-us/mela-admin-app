import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/card';

function UserGrowthChart({ data }) {
  const formattedData = (data || []).map((item) => {
    const [year, month] = (item.month || '2000-01').split('-');
    return {
      ...item,
      displayMonth: `${month}/${year.slice(2)}`,
    };
  });

  return (
    <Card className="border-indigo-200 shadow-lg bg-gradient-to-b from-white to-indigo-50/20">
      <CardHeader className="bg-indigo-200/50 border-b border-indigo-200">
        <CardTitle className="text-xl font-bold text-indigo-600">Tăng trưởng người dùng</CardTitle>
        <CardDescription className="text-gray-500">Số lượng người dùng mới đăng ký theo tháng</CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        {formattedData.length > 0 ? (
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={formattedData} margin={{ top: 10, right: 30, left: 10, bottom: 10 }}>
                <defs>
                  <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="displayMonth" tick={{ dy: 10, fill: '#4b5563', fontSize: 12 }} />
                <YAxis tick={{ dx: -5, fill: '#4b5563', fontSize: 12 }} />
                <CartesianGrid strokeDasharray="3 3" />
                <Tooltip
                  formatter={(value) => [`${value.toLocaleString()} người`, 'Người dùng mới']}
                  labelFormatter={(label) => `Tháng ${label}`}
                  contentStyle={{ borderRadius: 8, fontSize: 14, backgroundColor: '#fff', border: '1px solid #e5e7eb' }}
                />
                <Area
                  type="monotone"
                  dataKey="users"
                  stroke="#8884d8"
                  fillOpacity={1}
                  fill="url(#colorUsers)"
                  name="Người dùng mới"
                  activeDot={{ r: 6, strokeWidth: 2, stroke: '#8884d8', fill: 'white' }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <p className="text-gray-500 text-center py-4">Chưa có dữ liệu tăng trưởng người dùng</p>
        )}
      </CardContent>
    </Card>
  );
}

export default UserGrowthChart;
