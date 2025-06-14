import { AverageTimeByLevelClient } from "./average-time-by-level-client";

const getAverageTimeByLevelData = async () => {
  await new Promise((resolve) => setTimeout(resolve, 2000))
  return {
    data: [
      { level: "Lớp 1", averageMinutes: 20 },
      { level: "Lớp 2", averageMinutes: 18 },
      { level: "Lớp 3", averageMinutes: 20 },
      { level: "Lớp 4", averageMinutes: 5 },
      { level: "Lớp 5", averageMinutes: 25 },
      { level: "Lớp 6", averageMinutes: 28 },
      { level: "Lớp 7", averageMinutes: 32 },
      { level: "Lớp 8", averageMinutes: 8 },
      { level: "Lớp 9", averageMinutes: 9 },
    ]
  }
}

export async function AverageTimeByLevel() {
  const { data } = await getAverageTimeByLevelData();

  return <AverageTimeByLevelClient data={data} />;
}
