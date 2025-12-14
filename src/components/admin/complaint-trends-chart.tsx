'use client';

import { AreaChart as RechartsAreaChart, Area, XAxis, YAxis, CartesianGrid } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';

export interface ComplaintTrendData {
  day: string;
  count: number;
}

interface ComplaintTrendsChartProps {
  data: ComplaintTrendData[];
  height?: number;
}

/**
 * Component hiển thị biểu đồ xu hướng khiếu nại theo tuần
 * Sử dụng Recharts với shadcn/ui Chart components
 */
export function ComplaintTrendsChart({ data, height = 300 }: ComplaintTrendsChartProps) {
  const chartData = data.map((item) => ({
    name: item.day,
    complaints: item.count,
  }));

  const chartConfig = {
    complaints: {
      label: 'Số lượng khiếu nại',
      color: 'hsl(142, 76%, 36%)', // Green color similar to the image
    },
  };

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center" style={{ height }}>
        <p className="text-sm text-muted-foreground">Không có dữ liệu</p>
      </div>
    );
  }

  const maxValue = Math.max(...data.map((d) => d.count), 0);
  const yAxisMax = Math.ceil((maxValue * 1.2) / 5) * 5; // Round up to nearest 5

  return (
    <div className="w-full" style={{ height }}>
      <ChartContainer config={chartConfig} className="w-full h-full">
        <RechartsAreaChart
          data={chartData}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <defs>
            <linearGradient id="fillComplaints" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(142, 76%, 36%)" stopOpacity={0.8} />
              <stop offset="95%" stopColor="hsl(142, 76%, 36%)" stopOpacity={0.1} />
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
            domain={[0, yAxisMax]}
            // ticks={Array.from({ length: 6 }, (_, i) => (i * yAxisMax) / 5)}
          />
          <ChartTooltip 
            content={<ChartTooltipContent />}
            labelFormatter={(value) => `Ngày: ${value}`}
          />
          <Area
            type="monotone"
            dataKey="complaints"
            stroke="hsl(142, 76%, 36%)"
            strokeWidth={2}
            fill="url(#fillComplaints)"
            dot={{ fill: 'hsl(142, 76%, 36%)', r: 4, strokeWidth: 2, stroke: '#fff' }}
            activeDot={{ r: 6, strokeWidth: 2, stroke: '#fff' }}
          />
        </RechartsAreaChart>
      </ChartContainer>
    </div>
  );
}

