import type { IndicatorWithResult } from '../api/types';
import { KpiCard } from './charts/KpiCard';
import { HighchartsColumnChart } from './charts/HighchartsColumnChart';
import { EChartsPieChart } from './charts/EChartsPieChart';

export function IndicatorCard({ item }: { item: IndicatorWithResult }) {
  const tooltip = [item.logic, item.notes ? `Note: ${item.notes}` : null].filter(Boolean).join('\n\n');

  return (
    <div className="indicator-card">
      <div className="indicator-card-header">
        <div className="indicator-title">{item.indicator}</div>
        <span className="info-dot" title={tooltip}>
          i
        </span>
      </div>
      {renderBody(item)}
    </div>
  );
}

function renderBody(item: IndicatorWithResult) {
  if (item.result.type === 'kpi') {
    return <KpiCard value={item.result.value} />;
  }

  const data = item.result.series;

  if (item.chartType === 'column') {
    return <HighchartsColumnChart data={data} />;
  }
  if (item.chartType === 'donut') {
    return <EChartsPieChart data={data} donut />;
  }
  return <EChartsPieChart data={data} />;
}
