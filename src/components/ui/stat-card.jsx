import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './card';
import { ArrowDownIcon, ArrowUpIcon } from 'lucide-react';
import { cn } from '../../lib/utils';

function StatCard({
  title,
  value,
  description,
  icon: Icon,
  color,
  comparisonValue,
  comparisonLabel,
  isLoading = false,
  className = '',
}) {
  const isPositive = comparisonValue >= 0;

  return (
    <Card
      className={cn('overflow-hidden border-t-4 transition-all duration-300 hover:shadow-lg', className)}
      style={{ borderTopColor: `var(--${color})` }}
    >
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle>{isLoading ? <div className="h-6 w-24 bg-gray-200 rounded animate-pulse" /> : title}</CardTitle>
        {isLoading ? (
          <div className="h-9 w-9 bg-gray-200 rounded-full animate-pulse" />
        ) : (
          <div className={cn(`p-2 rounded-full bg-${color}/15 text-${color}`)}>
            <Icon className="h-5 w-5" />
          </div>
        )}
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <>
            <div className="h-8 w-24 bg-gray-200 rounded mb-1 animate-pulse" />
            <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
            <div className="h-4 w-24 bg-gray-200 rounded mt-2 animate-pulse" />
          </>
        ) : (
          <>
            <div className="text-4xl font-bold">{value}</div>
            <CardDescription className="mt-3 line-clamp-2">{description}</CardDescription>
            <div
              className={cn(
                'flex items-center gap-1 mt-3 text-sm font-medium',
                isPositive ? 'text-green-600' : 'text-red-600',
              )}
            >
              {isPositive ? <ArrowUpIcon className="h-4 w-4" /> : <ArrowDownIcon className="h-4 w-4" />}
              <span>
                {isPositive ? '+' : ''}
                {comparisonValue.toFixed(1)}%
              </span>
              <span className="text-gray-500 font-normal">{comparisonLabel}</span>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}

export { StatCard };
