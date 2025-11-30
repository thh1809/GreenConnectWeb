import { useMemo } from 'react';

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

export function PieChart({ data, size = 200 }: PieChartProps) {
  const total = useMemo(() => data.reduce((sum, item) => sum + item.value, 0), [data]);
  
  const segments = useMemo(() => {
    if (total === 0) return [];

    const center = size / 2;
    const radius = size / 2 - 10;

    // Use reduce to avoid mutation - calculate cumulative angles
    return data.reduce<Array<{
      pathData: string;
      percentage: number;
      label: string;
      value: number;
      color: string;
      midAngle: number;
      startAngle: number;
      endAngle: number;
    }>>((acc, item, index) => {
      const percentage = (item.value / total) * 100;
      const angle = (item.value / total) * 360;
      // Calculate start angle from previous segment's end angle
      const startAngle = acc.length > 0 ? acc[acc.length - 1].endAngle : -90;
      const endAngle = startAngle + angle;

      const startAngleRad = (startAngle * Math.PI) / 180;
      const endAngleRad = (endAngle * Math.PI) / 180;

      const x1 = center + radius * Math.cos(startAngleRad);
      const y1 = center + radius * Math.sin(startAngleRad);
      const x2 = center + radius * Math.cos(endAngleRad);
      const y2 = center + radius * Math.sin(endAngleRad);

      const largeArcFlag = angle > 180 ? 1 : 0;

      const pathData = [
        `M ${center} ${center}`,
        `L ${x1} ${y1}`,
        `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
        'Z',
      ].join(' ');

      const color = item.color || COLORS[index % COLORS.length];

      acc.push({
        pathData,
        percentage,
        label: item.label,
        value: item.value,
        color,
        midAngle: startAngle + angle / 2,
        startAngle,
        endAngle,
      });
      return acc;
    }, []);
  }, [data, total, size]);

  if (total === 0) {
    return (
      <div className="flex items-center justify-center" style={{ width: size, height: size }}>
        <p className="text-sm text-muted-foreground">Không có dữ liệu</p>
      </div>
    );
  }

  const center = size / 2;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        {segments.map((segment, index) => (
          <path
            key={index}
            d={segment.pathData}
            fill={segment.color}
            className="transition-all duration-300 hover:opacity-80"
            style={{ opacity: 0.8 }}
          />
        ))}
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <div className="text-2xl font-bold">{total}</div>
          <div className="text-xs text-muted-foreground">Tổng</div>
        </div>
      </div>
    </div>
  );
}

