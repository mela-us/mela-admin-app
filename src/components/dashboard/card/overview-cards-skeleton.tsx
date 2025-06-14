import { Clock, FileText, Users, Network, TrendingUp, Check } from "lucide-react"
import { StatCard } from "../stat-card";

export function OverviewCardsSkeleton() {
  return (
    <div>
      <div className="flex flex-col gap-4 md:flex-row md:justify-between md:items-center mb-4">
        <h2 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
          Tổng quát
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array(4).fill(null).map((_, i) => (
          <StatCard
            key={i}
            title=""
            value=""
            description=""
            icon={Users}
            color="blue-500"
            comparisonValue={0}
            comparisonLabel=""
            isLoading={true}
          />
        ))}
      </div>
    </div>
  );
}
