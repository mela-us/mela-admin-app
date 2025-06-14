import { TopicLevelHeatmapClient } from "./topic-level-heatmap-client"
const getTopicLevelHeatmaphData = async () => {
  await new Promise((resolve) => setTimeout(resolve, 3000))
  return {
    data: [
      {
        level: "Lớp 1",
        topics: [
          { name: "Đại số", value: 560 },
          { name: "Hình học", value: 480 },
          { name: "Số học", value: 620 },
          { name: "Giải tích", value: 20 },
          { name: "Xác suất", value: 50 },
        ],
      },
      {
        level: "Lớp 2",
        topics: [
          { name: "Đại số", value: 160 },
          { name: "Hình học", value: 380 },
          { name: "Số học", value: 420 },
          { name: "Giải tích", value: 10 },
          { name: "Xác suất", value: 60 },
        ],
      },
      {
        level: "Lớp 3",
        topics: [
          { name: "Đại số", value: 280 },
          { name: "Hình học", value: 340 },
          { name: "Số học", value: 390 },
          { name: "Giải tích", value: 30 },
          { name: "Xác suất", value: 40 },
        ],
      },
      {
        level: "Lớp 4",
        topics: [
          { name: "Đại số", value: 320 },
          { name: "Hình học", value: 280 },
          { name: "Số học", value: 350 },
          { name: "Giải tích", value: 50 },
          { name: "Xác suất", value: 50 },
        ],
      },
      {
        level: "Lớp 5",
        topics: [
          { name: "Đại số", value: 420 },
          { name: "Hình học", value: 380 },
          { name: "Số học", value: 290 },
          { name: "Giải tích", value: 60 },
          { name: "Xác suất", value: 60 },
        ],
      },
      {
        level: "Lớp 6",
        topics: [
          { name: "Đại số", value: 480 },
          { name: "Hình học", value: 420 },
          { name: "Số học", value: 180 },
          { name: "Giải tích", value: 120 },
          { name: "Xác suất", value: 90 },
        ],
      },
      {
        level: "Lớp 7",
        topics: [
          { name: "Đại số", value: 520 },
          { name: "Hình học", value: 460 },
          { name: "Số học", value: 140 },
          { name: "Giải tích", value: 180 },
          { name: "Xác suất", value: 120 },
        ],
      },
      {
        level: "Lớp 8",
        topics: [
          { name: "Đại số", value: 580 },
          { name: "Hình học", value: 490 },
          { name: "Số học", value: 120 },
          { name: "Giải tích", value: 240 },
          { name: "Xác suất", value: 160 },
        ],
      },
      {
        level: "Lớp 9",
        topics: [
          { name: "Đại số", value: 620 },
          { name: "Hình học", value: 540 },
          { name: "Số học", value: 90 },
          { name: "Giải tích", value: 320 },
          { name: "Xác suất", value: 220 },
        ],
      },
    ]
  }
}

export async function TopicLevelHeatmap() {
  const { data } = await getTopicLevelHeatmaphData();

  return <TopicLevelHeatmapClient data={data} />;
}
