import { UserGrowthChartClient } from "./user-growth-chart-client"
const getUserGrowthData = async () => {
  await new Promise((resolve) => setTimeout(resolve, 1000))
  return {
    data: [
      { month: "2024-6", users: 640 },
      { month: "2024-7", users: 640 },
      { month: "2024-8", users: 640 },
      { month: "2024-9", users: 640 },
      { month: "2024-10", users: 640 },
      { month: "2024-11", users: 640 },
      { month: "2024-12", users: 640 },
      { month: "2025-01", users: 800 },
      { month: "2025-02", users: 900 },
      { month: "2025-03", users: 1100 },
      { month: "2025-04", users: 1230 },
      { month: "2025-05", users: 1230 },
    ],
  }
}

export async function UserGrowthChart() {
  const { data } = await getUserGrowthData();

  return <UserGrowthChartClient data={data} />;
}
