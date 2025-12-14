'use client'

import { AreaChart as RechartsAreaChart, Area, XAxis, YAxis, CartesianGrid } from 'recharts'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'

type Point = { label: string; value: number };

type LineAreaChartProps = {
  data: Point[];
  height?: number;
};

export function LineAreaChart({ data, height = 300 }: LineAreaChartProps) {
  const chartData = data.map((item) => ({
    name: item.label,
    value: item.value,
  }))

  const chartConfig = {
    value: {
      label: 'Số lượng',
      color: 'hsl(var(--chart-1))',
    },
  }

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center" style={{ height }}>
        <p className="text-sm text-muted-foreground">Không có dữ liệu</p>
      </div>
    )
  }

  return (
    <ChartContainer config={chartConfig} className="w-full min-h-[300px]">
      <RechartsAreaChart
        data={chartData}
        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
      >
        <defs>
          <linearGradient id="fillValue" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="var(--color-value)" stopOpacity={0.8} />
            <stop offset="95%" stopColor="var(--color-value)" stopOpacity={0.1} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
        <XAxis
          dataKey="name"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          className="text-xs"
        />
        <YAxis
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          className="text-xs"
        />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Area
          type="monotone"
          dataKey="value"
          stroke="var(--color-value)"
          fill="url(#fillValue)"
          strokeWidth={2}
          dot={{ fill: "var(--color-value)", r: 4 }}
          activeDot={{ r: 6 }}
        />
      </RechartsAreaChart>
    </ChartContainer>
  )
}



