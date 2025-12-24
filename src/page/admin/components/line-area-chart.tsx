 'use client';

 import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

type Point = { label: string; value: number };

type LineAreaChartProps = {
  data: Point[];
  height?: number;
};

export function LineAreaChart({ data, height = 260 }: LineAreaChartProps) {
  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center" style={{ height }}>
        <p className="text-sm text-muted-foreground">Không có dữ liệu</p>
      </div>
    );
  }

  const maxValue = Math.max(...data.map((d) => d.value), 0);
  const yMax = maxValue <= 1 ? 2 : Math.ceil(maxValue * 1.15);

  return (
    <div className="w-full" style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 12, right: 16, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="gcAreaFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.22} />
              <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" opacity={0.35} />
          <XAxis
            dataKey="label"
            axisLine={false}
            tickLine={false}
            interval="preserveStartEnd"
            tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            width={32}
            domain={[0, yMax]}
            allowDecimals={false}
            tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
          />
          <Tooltip
            cursor={{ stroke: 'hsl(var(--border))', strokeDasharray: '3 3' }}
            content={({ active, payload, label }) => {
              if (!active || !payload?.length) return null;
              const value = payload[0]?.value;
              return (
                <div className="rounded-lg border bg-card px-3 py-2 text-sm shadow-sm">
                  <div className="font-medium">{label}</div>
                  <div className="text-muted-foreground">Số lượng: <span className="text-foreground font-medium">{String(value)}</span></div>
                </div>
              );
            }}
          />
          <Area
            type="monotone"
            dataKey="value"
            stroke="hsl(var(--primary))"
            strokeWidth={2}
            fill="url(#gcAreaFill)"
            dot={{ r: 3, strokeWidth: 2, fill: 'hsl(var(--background))', stroke: 'hsl(var(--primary))' }}
            activeDot={{ r: 5, strokeWidth: 2, fill: 'hsl(var(--background))', stroke: 'hsl(var(--primary))' }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
