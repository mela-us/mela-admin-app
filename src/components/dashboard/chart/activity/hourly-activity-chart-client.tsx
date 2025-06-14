"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

interface Props {
  data: {
    hour: string;
    count: number;
  }[];
}

export function HourlyActivityChartClient({ data }: Props) {
  const formattedData = data.map((item) => ({
    ...item,
    displayHour: `${String(item.hour).padStart(2, "0")}:00`,
  }))

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-semibold mb-2 text-blue-600">Phân bổ khung giờ làm bài tập</CardTitle>
        <CardDescription>Số lượt làm bài tập theo từng khung giờ trong ngày của tất cả người dùng</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={formattedData}
              margin={{ top: 10, right: 30, left: 10, bottom: 10 }}>
              <defs>
                <linearGradient id="colorActivity" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ff8042" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#ff8042" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="displayHour"
                tick={{ dy: 10 }}
                interval={2}
              />
              <YAxis tick={{ dx: -5 }} />
              <Tooltip
                formatter={(value) => [`${value} lượt`, "Số lượt làm bài"]}
                labelFormatter={(label) => {
                  const hour = parseInt(label, 10)
                  const start = String(hour).padStart(2, "0")
                  const end = String((hour + 1) % 24).padStart(2, "0")
                  return `Từ ${start}:00 đến ${end}:00`
                }}
                contentStyle={{ borderRadius: 8, fontSize: 14 }}
              />
              <Area
                type="monotone"
                dataKey="count"
                stroke="#ff8042"
                fillOpacity={1}
                fill="url(#colorActivity)"
                name="Số lượt làm bài"
                activeDot={{ r: 6, strokeWidth: 2, stroke: "#ff8042", fill: "white" }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
