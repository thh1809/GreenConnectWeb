 'use client';

 import {
  Bar,
  BarChart as RechartsBarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

type BarChartProps = {
  data: { label: string; value: number }[];
  height?: number;
  color?: string;
};

type ChartDatum = {
  label: string;
  value: number;
  color: string;
};

function normalizeLabel(label: string) {
  return label.trim().toLowerCase();
}

function colorForLabel(label: string, fallback: string) {
  const l = normalizeLabel(label);

  if (l.includes('hoàn thành') || l.includes('completed') || l.includes('thành công') || l.includes('success')) {
    return 'hsl(var(--success))';
  }
  if (l.includes('thất bại') || l.includes('failed') || l.includes('lỗi') || l.includes('error')) {
    return 'hsl(var(--danger))';
  }
  if (l.includes('đã lên lịch') || l.includes('scheduled') || l.includes('đang xử lý') || l.includes('pending')) {
    return 'hsl(var(--primary))';
  }
  if (l.includes('hủy') || l.includes('cancel')) {
    return 'hsl(var(--warning))';
  }

  return fallback;
}

export function BarChart({ data, height = 300, color = 'hsl(var(--primary))' }: BarChartProps) {
  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center" style={{ height }}>
        <p className="text-sm text-muted-foreground">Không có dữ liệu</p>
      </div>
    );
  }

  const chartData: ChartDatum[] = data.map((d) => ({
    label: d.label,
    value: d.value,
    color: colorForLabel(d.label, color),
  }));

  const maxValue = Math.max(...chartData.map((d) => d.value), 0);
  const yMax = maxValue <= 1 ? 2 : Math.ceil(maxValue * 1.15);

  return (
    <div className="w-full" style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsBarChart
          data={chartData}
          margin={{ top: 18, right: 16, left: 0, bottom: 12 }}
          barCategoryGap="24%"
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" opacity={0.35} />
          <XAxis
            dataKey="label"
            axisLine={false}
            tickLine={false}
            interval={0}
            height={40}
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
            cursor={{ fill: 'hsl(var(--muted))', opacity: 0.25 }}
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
          <Bar dataKey="value" radius={[8, 8, 0, 0]} maxBarSize={56}>
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} opacity={0.9} />
            ))}
          </Bar>
        </RechartsBarChart>
      </ResponsiveContainer>
    </div>
  );
}
