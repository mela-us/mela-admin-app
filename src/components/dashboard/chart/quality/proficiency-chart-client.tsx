"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts"

interface ProficiencyData {
  name: string
  value: number
  color: string
  range: string
}
interface Props {
  data: {
    name: string
    value: number
  }[]
}

const COLORS = ["#0f172a", "#2563eb", "#14b8a6", "#facc15", "#e11d48", "#8b5cf6", "#f97316"];
const RANGES = {
  XUAT_XAC: "90-100",
  GIOI: "80-90",
  KHA: "65-80",
  TRUNG_BINH: "50-65",
  YEU: "0-50",
}
const NAME_MAP = {
  XUAT_XAC: "Xuất sắc",
  GIOI: "Giỏi",
  KHA: "Khá",
  TRUNG_BINH: "Trung bình",
  YEU: "Yếu",
}

export function ProficiencyChartClient({ data }: Props) {
  const chartData: ProficiencyData[] = data.map((item, index) => ({
    name: NAME_MAP[item.name as keyof typeof NAME_MAP] || item.name,
    value: item.value,
    color: COLORS[index % COLORS.length],
    range: RANGES[item.name as keyof typeof RANGES],
  }))

  return (
    <Card role="region" aria-label="Biểu đồ phân bố trình độ học tập">
      <CardHeader>
        <CardTitle className="text-xl font-semibold mb-2 text-blue-600">Phân bố trình độ học tập</CardTitle>
        <CardDescription>Phân bố người dùng theo điểm trung bình trên thang 100 của toàn bộ các bài tập</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="w-full md:w-2/3 h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  labelLine={true}
                  outerRadius={100}
                  innerRadius={50}
                  dataKey="value"
                  paddingAngle={2}
                  isAnimationActive={true}
                  animationBegin={0}
                  animationDuration={800}
                  animationEasing="ease-out"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number, name: string, props) => [
                    `${value.toLocaleString()} người dùng`,
                    `${name} (ĐTB thuộc ${props.payload.range})`,
                  ]}
                  contentStyle={{
                    borderRadius: "8px",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                    backgroundColor: "#fff",
                    border: "1px solid #e5e7eb",
                  }}
                  itemStyle={{ color: "#1f2937" }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="w-full md:w-1/3 mr-10">
            <div className="space-y-3">
              {chartData.map((item, index) => (
                <div key={index} className="flex items-center gap-3 pb-2">
                  <div className="w-4 h-4 rounded-full" style={{ backgroundColor: item.color }}></div>
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <span className="font-medium">{item.name}</span>
                      <span className="text-muted-foreground text-sm">{item.range} điểm</span>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {item.value.toLocaleString()} người dùng (
                      {((item.value / chartData.reduce((acc, curr) => acc + curr.value, 0)) * 100).toFixed(0)}%)
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
