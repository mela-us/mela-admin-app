"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useState, useRef, useEffect, useMemo } from "react"

interface Props {
  data: {
    level: string
    topics: {
      name: string
      value: number
    }[]
  }[]
}

const generateColorClasses = (maxValue: number) => {
  const step = 100;
  const roundedMax = Math.ceil(maxValue / step) * step;
  const steps = roundedMax / step;
  let styles = '';

  for (let i = 0; i <= steps; i++) {
    const value = i * step;
    const percentage = value / roundedMax;
    const r = Math.round(173 - (173 - 79) * percentage);
    const g = Math.round(216 - (216 - 70) * percentage);
    const b = Math.round(230 - (230 - 229) * percentage);
    const color = percentage === 0 ? "transparent" : `rgb(${r}, ${g}, ${b})`;

    styles += `
      .heatmap-color-${i} {
        background-color: ${color};
      }
    `;
  }

  styles += `
    .heatmap-tooltip {
      pointer-events: none;
    }
  `;

  return styles;
};

export function TopicLevelHeatmapClient({ data }: Props) {
  const [hoveredCell, setHoveredCell] = useState<{ level: string; topic: string; value: number; x: number; y: number } | null>(null)
  const tableRef = useRef<HTMLTableElement>(null)
  const tooltipRef = useRef<HTMLDivElement>(null)

  const allTopics = Array.from(new Set(data.flatMap((item) => item.topics.map((topic) => topic.name))))
  const maxValue = Math.max(...data.flatMap((item) => item.topics.map((topic) => topic.value)))
  const sortedData = [...data].sort((a, b) => { return a.level.localeCompare(b.level) });

  const getColorIntensity = (value: number) => {
    if (value === 0) return "transparent";
    const percentage = Math.min(value / maxValue, 1)
    return `rgba(79, 70, 229, ${percentage * 0.9 + 0.1})`
  }

  const getCellValue = (level: string, topicName: string) => {
    const levelData = data.find((item) => item.level === level)
    if (!levelData) return 0
    const topicData = levelData.topics.find((topic) => topic.name === topicName)
    return topicData ? topicData.value : 0
  }

  const handleMouseEnter = (e: React.MouseEvent<HTMLTableCellElement>, level: string, topicName: string, value: number) => {
    if (value === 0) return;

    setHoveredCell({
      level,
      topic: topicName,
      value,
      x: e.clientX,
      y: e.clientY
    })
  }

  const renderLegend = () => {
    const step = 100;
    const roundedMax = Math.ceil(maxValue / step) * step;
    const steps = roundedMax / step;
    const legendItems = [];

    for (let i = 0; i <= steps; i++) {
      const value = i * step;
      const percentage = value / roundedMax;
      const r = Math.round(173 - (173 - 79) * percentage);
      const g = Math.round(216 - (216 - 70) * percentage);
      const b = Math.round(230 - (230 - 229) * percentage);
      const color = percentage === 0 ? "transparent" : `rgb(${r}, ${g}, ${b})`;

      legendItems.push(
        <div key={i} className="flex items-center text-xs">
          <div
            className="w-5 h-5 mr-1 rounded"
            style={{ backgroundColor: color }}
          ></div>
          <span>{value}</span>
        </div>
      );
    }

    return (
      <div className="flex gap-3 mt-4 justify-end">
        <div className="flex gap-2">
          {legendItems}
        </div>
      </div>
    );
  };

  useEffect(() => {
    if (hoveredCell && tooltipRef.current) {
      const tooltipWidth = tooltipRef.current.offsetWidth;
      const tooltipHeight = tooltipRef.current.offsetHeight;
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      let left = hoveredCell.x + 10;
      let top = hoveredCell.y + 10;

      if (left + tooltipWidth > viewportWidth) {
        left = hoveredCell.x - tooltipWidth - 10;
      }

      if (top + tooltipHeight > viewportHeight) {
        top = hoveredCell.y - tooltipHeight - 10;
      }

      tooltipRef.current.style.left = `${left}px`;
      tooltipRef.current.style.top = `${top}px`;
    }
  }, [hoveredCell]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-semibold mb-2 text-blue-600">Biểu đồ nhiệt lượt làm bài theo chủ đề và lớp học</CardTitle>
        <CardDescription>Số lượt làm bài tập của tất cả người dùng theo chủ đề và lớp học</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="relative overflow-x-auto pr-3">
          <div className="overflow-x-auto pb-2">
            <table ref={tableRef} className="w-full text-sm border-collapse">
              <thead>
                <tr>
                  <th className="p-2 text-left font-medium sticky left-0 bg-white z-10">Lớp</th>
                  {allTopics.map((topic) => (
                    <th key={topic} className="p-2 text-center font-medium min-w-24">
                      {topic}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sortedData.map((levelData) => (
                  <tr key={levelData.level}>
                    <td className="p-2 font-medium sticky left-0 bg-white z-10">{levelData.level}</td>
                    {allTopics.map((topicName) => {
                      const value = getCellValue(levelData.level, topicName)
                      return (
                        <td
                          key={`${levelData.level}-${topicName}`}
                          className="p-0 text-center relative"
                          onMouseEnter={(e) => handleMouseEnter(e, levelData.level, topicName, value)}
                          onMouseLeave={() => setHoveredCell(null)}
                        >
                          <div
                            className="absolute inset-0 transition-all duration-200 hover:brightness-95"
                            style={{ backgroundColor: getColorIntensity(value) }}
                          ></div>
                          <span className="relative z-10 font-medium text-xs text-black p-2 block">
                            {value > 0 ? value : "-"}
                          </span>
                        </td>
                      )
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {renderLegend()}

          {hoveredCell && (
            <div
              ref={tooltipRef}
              className="fixed bg-white shadow-xl rounded-lg p-3 text-sm z-50 max-w-xs"
              style={{
                pointerEvents: "none",
              }}
            >
              <div className="font-semibold text-gray-800">
                {hoveredCell.topic} - {hoveredCell.level}
              </div>
              <div className="text-gray-600">Số lượt làm bài: {hoveredCell.value}</div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
