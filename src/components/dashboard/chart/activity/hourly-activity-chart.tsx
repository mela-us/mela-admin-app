import { HourlyActivityChartClient } from "./hourly-activity-chart-client";
const getHourlyActivityData = async () => {
  await new Promise((resolve) => setTimeout(resolve, 2000))
  return {
    data: [
      { hour: "00", count: 20 },
      { hour: "01", count: 10 },
      { hour: "02", count: 5 },
      { hour: "03", count: 2 },
      { hour: "04", count: 1 },
      { hour: "05", count: 3 },
      { hour: "06", count: 15 },
      { hour: "07", count: 45 },
      { hour: "08", count: 120 },
      { hour: "09", count: 180 },
      { hour: "10", count: 210 },
      { hour: "11", count: 190 },
      { hour: "12", count: 150 },
      { hour: "13", count: 130 },
      { hour: "14", count: 170 },
      { hour: "15", count: 220 },
      { hour: "16", count: 280 },
      { hour: "17", count: 320 },
      { hour: "18", count: 350 },
      { hour: "19", count: 380 },
      { hour: "20", count: 340 },
      { hour: "21", count: 250 },
      { hour: "22", count: 150 },
      { hour: "23", count: 80 },
    ],
  }
}

export async function HourlyActivityChart() {
  const { data } = await getHourlyActivityData();

  return <HourlyActivityChartClient data={data} />;
}
