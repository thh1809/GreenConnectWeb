type BarChartProps = {
  data: { label: string; value: number }[];
  height?: number;
  color?: string;
};

export function BarChart({ data, height = 300, color = 'hsl(var(--primary))' }: BarChartProps) {
  const max = Math.max(...data.map((d) => d.value), 1);
  const barWidth = 100 / data.length;

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center" style={{ height }}>
        <p className="text-sm text-muted-foreground">Không có dữ liệu</p>
      </div>
    );
  }

  return (
    <div className="w-full" style={{ height }}>
      <div className="relative h-full flex items-end justify-between gap-2">
        {data.map((item, index) => {
          const barHeight = (item.value / max) * 100;
          return (
            <div key={index} className="flex-1 flex flex-col items-center gap-2 h-full">
              <div className="relative w-full h-full flex items-end">
                <div
                  className="w-full rounded-t transition-all duration-500 hover:opacity-80"
                  style={{
                    height: `${barHeight}%`,
                    backgroundColor: color,
                    minHeight: item.value > 0 ? '4px' : '0',
                  }}
                >
                  <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-medium whitespace-nowrap">
                    {item.value}
                  </div>
                </div>
              </div>
              <div className="text-xs text-muted-foreground text-center px-1 break-words">
                {item.label}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}


