type RadarSeries = {
  id: string;
  label: string;
  color: string;
  values: number[];
};

type RadarChartProps = {
  axes: string[];
  series: RadarSeries[];
  size?: number;
};

function pointOnAxis(
  index: number,
  count: number,
  radius: number,
  center: number,
) {
  const angle = -Math.PI / 2 + (index * (2 * Math.PI)) / count;
  return {
    x: center + radius * Math.cos(angle),
    y: center + radius * Math.sin(angle),
  };
}

export function RadarChart({ axes, series, size = 280 }: RadarChartProps) {
  const center = size / 2;
  const maxRadius = size / 2 - 40;
  const ringLevels = [0.25, 0.5, 0.75, 1];

  return (
    <figure>
      <svg
        viewBox={`0 0 ${size} ${size}`}
        width="100%"
        height={size}
        role="img"
        aria-label={`Radar des scores d'affinité par catégorie pour ${series
          .map((s) => s.label)
          .join(", ")}`}
      >
        {ringLevels.map((level) => {
          const pts = axes
            .map((_, i) => {
              const p = pointOnAxis(i, axes.length, maxRadius * level, center);
              return `${p.x},${p.y}`;
            })
            .join(" ");
          return (
            <polygon
              key={level}
              points={pts}
              fill="none"
              stroke="currentColor"
              className="text-border"
              strokeWidth={1}
            />
          );
        })}

        {axes.map((_, i) => {
          const p = pointOnAxis(i, axes.length, maxRadius, center);
          return (
            <line
              key={i}
              x1={center}
              y1={center}
              x2={p.x}
              y2={p.y}
              stroke="currentColor"
              className="text-border"
              strokeWidth={1}
            />
          );
        })}

        {series.map((s) => {
          const pts = s.values
            .map((v, i) => {
              const p = pointOnAxis(
                i,
                axes.length,
                (Math.max(0, Math.min(100, v)) / 100) * maxRadius,
                center,
              );
              return `${p.x},${p.y}`;
            })
            .join(" ");
          return (
            <polygon
              key={s.id}
              points={pts}
              fill={s.color}
              fillOpacity={0.12}
              stroke={s.color}
              strokeWidth={2}
            />
          );
        })}

        {series.map((s) =>
          s.values.map((v, i) => {
            const p = pointOnAxis(
              i,
              axes.length,
              (Math.max(0, Math.min(100, v)) / 100) * maxRadius,
              center,
            );
            return (
              <circle
                key={`${s.id}-${i}`}
                cx={p.x}
                cy={p.y}
                r={3}
                fill={s.color}
              >
                <title>
                  {s.label} — {axes[i]} : {Math.round(v)}%
                </title>
              </circle>
            );
          }),
        )}

        {axes.map((label, i) => {
          const p = pointOnAxis(i, axes.length, maxRadius + 22, center);
          return (
            <text
              key={label}
              x={p.x}
              y={p.y}
              textAnchor="middle"
              dominantBaseline="middle"
              className="fill-muted-foreground text-[10px]"
            >
              {label}
            </text>
          );
        })}
      </svg>
      <figcaption className="mt-3 flex flex-wrap justify-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
        {series.map((s) => (
          <span key={s.id} className="inline-flex items-center gap-1.5">
            <span
              aria-hidden
              className="inline-block size-2.5 rounded-full"
              style={{ backgroundColor: s.color }}
            />
            {s.label}
          </span>
        ))}
      </figcaption>
    </figure>
  );
}
