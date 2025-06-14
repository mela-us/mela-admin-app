import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { ArrowDownIcon, ArrowUpIcon } from "lucide-react"
import type { LucideIcon } from "lucide-react"

interface StatCardProps {
  title: string
  value: string | number
  description: string
  icon: LucideIcon
  color: string
  comparisonValue: number
  comparisonLabel: string
  isLoading?: boolean
  className?: string
  iconClassName?: string
}

export function StatCard({
  title,
  value,
  description,
  icon: Icon,
  color,
  comparisonValue,
  comparisonLabel,
  isLoading = false,
  className = "",
  iconClassName = "",
}: StatCardProps) {
  const isPositive = comparisonValue >= 0

  return (
    <Card
      className={`overflow-hidden border-t-4 transition-all duration-300 hover:shadow-lg ${className}`}
      style={{ borderTopColor: `var(--${color})` }}
    >
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-medium">{isLoading ? <Skeleton className="h-6 w-24" /> : title}</CardTitle>
        {isLoading ? (
          <Skeleton className="h-9 w-9 rounded-full" />
        ) : (
          <div className={`p-2 rounded-full bg-${color}/15 text-${color} ${iconClassName}`}>
            <Icon className="h-5 w-5" />
          </div>
        )}
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <>
            <Skeleton className="h-8 w-24 mb-1" />
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-24 mt-2" />
          </>
        ) : (
          <>
            <div className="text-4xl font-bold">{value}</div>
            <CardDescription className="mt-3 line-clamp-2">{description}</CardDescription>
            <div className={`flex items-center gap-1 mt-3 text-sm font-medium ${isPositive ? "text-green-600" : "text-red-600"}`}>
              {isPositive ? <ArrowUpIcon className="h-4 w-4" /> : <ArrowDownIcon className="h-4 w-4" />}
              <span>
                {isPositive ? "+" : ""}
                {comparisonValue.toFixed(1)}%
              </span>
              <span className="text-gray-500 font-normal">{comparisonLabel}</span>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}
