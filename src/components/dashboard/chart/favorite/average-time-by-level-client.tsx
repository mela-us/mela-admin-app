"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  LabelList
} from "recharts"

interface Props {
  data: {
    level: string
    averageMinutes: number
  }[]
}

export function AverageTimeByLevelClient({ data }: Props) {
  const formattedData = data.map((item) => ({
    ...item,
    displayLevel: `${item.level}`,
  }));

  const maxData = Math.max(...formattedData.map(item => item.averageMinutes), 0);
  const yAxisMax = Math.ceil(maxData * 1.1);

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle className="text-xl font-semibold mb-2 text-blue-600">Thời gian làm bài tập trung bình theo khối lớp</CardTitle>
        <CardDescription>Thời gian trung bình (số phút) mà học sinh dành cho mỗi bài tập</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={formattedData} margin={{ top: 20, right: 30, left: 10, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="displayLevel"
                tick={{ dy: 10, fill: "#4b5563", fontSize: 12 }}
                axisLine={{ stroke: "#9ca3af" }}
                tickLine={{ stroke: "#9ca3af" }}
              />
              <YAxis
                domain={[0, yAxisMax]}
                tick={{ dx: -5, fill: "#4b5563", fontSize: 12 }}
                axisLine={{ stroke: "#9ca3af" }}
                tickLine={{ stroke: "#9ca3af" }}
                label={{
                  value: 'Phút',
                  angle: -90,
                  position: 'insideLeft',
                  style: { fill: '#4b5563', fontSize: 12 },
                  dx: 10
                }}
              />
              <Tooltip
                formatter={(value) => [`${value} phút`, "Thời gian trung bình"]}
                labelFormatter={(label) => `${label}`}
                contentStyle={{
                  borderRadius: 8,
                  fontSize: 14,
                  backgroundColor: "#fff",
                  border: "1px solid #e5e7eb",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.05)"
                }}
              />
              <Bar
                dataKey="averageMinutes"
                name="Thời gian trung bình (phút)"
                fill="#166534"
                radius={[4, 4, 0, 0]}
                barSize={40}
              >
                <LabelList
                  dataKey="averageMinutes"
                  position="top"
                  style={{ fill: "#166534", fontSize: 12 }}
                  formatter={(value: number) => `${value.toLocaleString()}`}
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
