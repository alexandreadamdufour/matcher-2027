type Segment = {
  category: string;
  total: number;
  answered: number;
  active: boolean;
};

export function SegmentedProgress({ segments }: { segments: Segment[] }) {
  const totalCount = segments.reduce((sum, s) => sum + s.total, 0);

  return (
    <div
      className="flex w-full gap-1.5"
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={totalCount}
      aria-valuenow={segments.reduce((sum, s) => sum + s.answered, 0)}
      aria-label="Progression par catégorie"
    >
      {segments.map((segment) => {
        const widthPercent = totalCount > 0 ? (segment.total / totalCount) * 100 : 0;
        const fillPercent =
          segment.total > 0 ? (segment.answered / segment.total) * 100 : 0;
        return (
          <div
            key={segment.category}
            style={{ width: `${widthPercent}%` }}
            className="flex flex-col gap-1"
          >
            <div
              className={`h-1 overflow-hidden rounded-full bg-border ${
                segment.active ? "ring-2 ring-brand/40 ring-offset-1 ring-offset-background" : ""
              }`}
            >
              <div
                className="h-full rounded-full bg-brand transition-[width] duration-300"
                style={{ width: `${fillPercent}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
