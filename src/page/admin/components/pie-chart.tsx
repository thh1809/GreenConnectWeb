 'use client';

 import { useMemo } from 'react';
import {
  Cell,
  Pie,
  PieChart as RechartsPieChart,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';

type PieChartProps = {
  data: { label: string; value: number; color?: string }[];
  size?: number;
};

const COLORS = [
  'hsl(var(--primary))',
  'hsl(var(--success))',
  'hsl(var(--warning))',
  'hsl(var(--danger))',
  'hsl(var(--muted-foreground))',
];

type PieDatum = {
  label: string;
  value: number;
  color: string;
};

export function PieChart({ data, size = 220 }: PieChartProps) {
  const total = useMemo(() => data.reduce((sum, item) => sum + item.value, 0), [data]);

  if (total === 0) {
    return (
      <div className="flex items-center justify-center" style={{ width: size, height: size }}>
        <p className="text-sm text-muted-foreground">Không có dữ liệu</p>
      </div>
    );
  }

  const chartData: PieDatum[] = data.map((d, i) => ({
    label: d.label,
    value: d.value,
    color: d.color || COLORS[i % COLORS.length],
  }));

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsPieChart>
          <Tooltip
            content={({ active, payload }) => {
              if (!active || !payload?.length) return null;
              const p = payload[0] as any;
              const label = String(p?.name ?? '');
              const value = Number(p?.value ?? 0);
              const percent = total > 0 ? ((value / total) * 100).toFixed(1) : '0.0';
              return (
                <div className="rounded-lg border bg-card px-3 py-2 text-sm shadow-sm">
                  <div className="font-medium">{label}</div>
                  <div className="text-muted-foreground">Số lượng: <span className="text-foreground font-medium">{value}</span></div>
                  <div className="text-muted-foreground">Tỷ lệ: <span className="text-foreground font-medium">{percent}%</span></div>
                </div>
              );
            }}
          />

          <Pie
            data={chartData}
            dataKey="value"
            nameKey="label"
            innerRadius="62%"
            outerRadius="90%"
            paddingAngle={2}
            stroke="hsl(var(--background))"
            strokeWidth={2}
            isAnimationActive
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} opacity={0.9} />
            ))}
          </Pie>
        </RechartsPieChart>
      </ResponsiveContainer>

      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <div className="text-2xl font-bold leading-none">{total}</div>
          <div className="mt-1 text-xs text-muted-foreground">Tổng</div>
        </div>
      </div>
    </div>
  );
}

