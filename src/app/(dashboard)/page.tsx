import { Suspense } from "react";
import { Star, Plus, BarChart3, Clock, Brain } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { OverviewCards } from "@/components/dashboard/card/overview-cards";
import { OverviewCardsSkeleton } from "@/components/dashboard/card/overview-cards-skeleton";
import { UserGrowthChart } from "@/components/dashboard/chart/activity/user-growth-chart";
import { UserGrowthChartSkeleton } from "@/components/dashboard/chart/activity/user-growth-chart-skeleton";
import { DifficultQuestionsList } from "@/components/dashboard/chart/quality/difficult-questions-list";
import { DifficultQuestionsListSkeleton } from "@/components/dashboard/chart/quality/difficult-questions-list-skeleton";
import { ProficiencyChart } from "@/components/dashboard/chart/quality/proficiency-chart";
import { ProficiencyChartSkeleton } from "@/components/dashboard/chart/quality/proficiency-chart-skeleton";
import { TopicLevelHeatmap } from "@/components/dashboard/chart/favorite/topic-level-heatmap";
import { TopicLevelHeatmapSkeleton } from "@/components/dashboard/chart/favorite/topic-level-heatmap-skeleton";
import { AverageTimeByLevel } from "@/components/dashboard/chart/favorite/average-time-by-level";
import { AverageTimeByLevelSkeleton } from "@/components/dashboard/chart/favorite/average-time-by-level-skeleton";
import { HourlyActivityChart } from "@/components/dashboard/chart/activity/hourly-activity-chart";
import { HourlyActivityChartSkeleton } from "@/components/dashboard/chart/activity/hourly-activity-chart-skeleton";

export default async function DashboardContentPage() {
  try {
    return (
      <div className="space-y-8">
        {/* Hero section - improved with more modern styling */}
        <header className="bg-gradient-to-r from-blue-500 to-indigo-600 relative rounded-xl p-8 text-white overflow-hidden shadow-lg">
          <div className="absolute inset-0 bg-black/10" />
          <div className="relative flex flex-col md:flex-row justify-between items-start md:items-center">
            <div>
              <h1 className="text-3xl font-bold mb-2 tracking-tight">Trang chủ MELA Admin</h1>
              <p className="text-blue-50 max-w-2xl">
                Theo dõi các chỉ số thống kê để cải thiện app và nội dung học tập.
              </p>
            </div>
          </div>
          <Star className="absolute right-0 bottom-0 opacity-20" size={180} />
        </header>

        {/* Stats cards */}
        <Suspense fallback={<OverviewCardsSkeleton />}>
          <OverviewCards />
        </Suspense>

        {/* Analytics section - improved styling */}
        <div>
          <div className="flex flex-col gap-4 md:flex-row md:justify-between md:items-center mb-4">
            <h2 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Phân tích
            </h2>
          </div>

          <Tabs defaultValue="activity" className="w-full">
            <TabsList className="mb-6 bg-slate-100 p-1 rounded-lg">
              <TabsTrigger value="activity" className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-md">
                <BarChart3 className="h-4 w-4" /> Phân Tích Hành Vi
              </TabsTrigger>
              <TabsTrigger value="favorite" className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-md">
                <Clock className="h-4 w-4" /> Chủ Đề Yêu Thích
              </TabsTrigger>
              <TabsTrigger value="quality" className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-md">
                <Brain className="h-4 w-4" /> Trình Độ Học Tập
              </TabsTrigger>
            </TabsList>

            <TabsContent value="activity" className="grid gap-8 mt-2 data-[state=inactive]:hidden">
              <Suspense fallback={<UserGrowthChartSkeleton />}>
                <UserGrowthChart />
              </Suspense>
              <Suspense fallback={<HourlyActivityChartSkeleton />}>
                <HourlyActivityChart />
              </Suspense>
            </TabsContent>

            <TabsContent value="favorite" className="grid gap-8 mt-2 data-[state=inactive]:hidden">
              <Suspense fallback={<AverageTimeByLevelSkeleton />}>
                <AverageTimeByLevel />
              </Suspense>
              <Suspense fallback={<TopicLevelHeatmapSkeleton />}>
                <TopicLevelHeatmap />
              </Suspense>
            </TabsContent>

            <TabsContent value="quality" className="grid gap-8 mt-2 data-[state=inactive]:hidden">
              <Suspense fallback={<ProficiencyChartSkeleton />}>
                <ProficiencyChart />
              </Suspense>
              <Suspense fallback={<DifficultQuestionsListSkeleton />}>
                <DifficultQuestionsList />
              </Suspense>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    );
  } catch (error) {
    console.error("Lỗi khi tải dữ liệu dashboard:", error);
    throw error;
  }
}
