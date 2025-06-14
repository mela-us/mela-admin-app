import { ProficiencyChartClient } from "./proficiency-chart-client"

const getProficiencyData = async () => {
  await new Promise((resolve) => setTimeout(resolve, 3000))
  return {
    data: [
      { name: "XUAT_XAC", value: 150 },
      { name: "GIOI", value: 250 },
      { name: "KHA", value: 300 },
      { name: "TRUNG_BINH", value: 350 },
      { name: "YEU", value: 200 },
    ]
  }
}

export async function ProficiencyChart() {
  const { data } = await getProficiencyData();

  return <ProficiencyChartClient data={data} />;
}
