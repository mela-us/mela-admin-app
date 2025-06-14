"use client";

import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface Props {
  data: {
    month: string;
    users: number;
  }[];
}

export function UserGrowthChartClient({ data }: Props) {
  const formattedData = data.map((item) => {
    const [year, month] = item.month.split("-");
    return {
      ...item,
      displayMonth: `${month}/${year.slice(2)}`,
    };
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-semibold mb-2 text-blue-600">Tăng trưởng người dùng</CardTitle>
        <CardDescription>Số lượng người dùng mới đăng ký theo tháng</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={formattedData}
              margin={{ top: 10, right: 30, left: 10, bottom: 10 }}>
              <defs>
                <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="displayMonth" tick={{ dy: 10 }} />
              <YAxis tick={{ dx: -5 }} />
              <CartesianGrid strokeDasharray="3 3" />
              <Tooltip
                formatter={(value) => [`${value.toLocaleString()} người`, "Người dùng mới"]}
                labelFormatter={(label) => `Tháng ${label}`}
                contentStyle={{ borderRadius: 8, fontSize: 14 }}
              />
              <Area
                type="monotone"
                dataKey="users"
                stroke="#8884d8"
                fillOpacity={1}
                fill="url(#colorUsers)"
                name="Người dùng mới"
                activeDot={{ r: 6, strokeWidth: 2, stroke: "#8884d8", fill: "white" }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
