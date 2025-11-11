type Point = { label: string; value: number };

type LineAreaChartProps = {
  data: Point[];
  height?: number;
};

export function LineAreaChart({ data, height = 220 }: LineAreaChartProps) {
  const width = 900;
  const paddingX = 32;
  const paddingY = 24;
  const innerW = width - paddingX * 2;
  const innerH = height - paddingY * 2;

  const max = Math.max(...data.map((d) => d.value), 1);
  const stepX = innerW / Math.max(data.length - 1, 1);

  const points = data.map((d, i) => {
    const x = paddingX + i * stepX;
    const y = paddingY + innerH - (d.value / max) * innerH;
    return [x, y] as const;
  });

  const path = points
    .map((p, i) => (i === 0 ? `M ${p[0]},${p[1]}` : `L ${p[0]},${p[1]}`))
    .join(" ");

  const area = `${path} L ${paddingX + innerW},${paddingY + innerH} L ${paddingX},${paddingY + innerH} Z`;

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full">
      <defs>
        <linearGradient id="gcArea" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="currentColor" stopOpacity="0.25" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
        </linearGradient>
      </defs>
      {/* grid */}
      <g className="text-border">
        {Array.from({ length: 4 }).map((_, i) => {
          const y = paddingY + (i * innerH) / 4;
          return (
            <line key={i} x1={paddingX} x2={paddingX + innerW} y1={y} y2={y} stroke="currentColor" />
          );
        })}
      </g>
      {/* area + line + points use primary color */}
      <g className="text-primary">
        <path d={area} fill="url(#gcArea)" />
        <path d={path} fill="none" stroke="currentColor" strokeWidth={2} />
        {points.map((p, i) => (
          <circle key={i} cx={p[0]} cy={p[1]} r={3} fill="currentColor" />
        ))}
      </g>
    </svg>
  );
}


