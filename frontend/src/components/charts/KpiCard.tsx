interface Props {
  value: number;
  unit?: string;
}

function formatNumber(value: number): string {
  if (!Number.isFinite(value)) return '—';
  return new Intl.NumberFormat('en-IN', { maximumFractionDigits: 1 }).format(value);
}

export function KpiCard({ value, unit }: Props) {
  return (
    <div className="kpi-value">
      {formatNumber(value)}
      {unit && <small>{unit}</small>}
    </div>
  );
}
