import type { DashboardResponse } from '../api/types';
import { IndicatorCard } from './IndicatorCard';

export function DashboardGrid({ data }: { data: DashboardResponse }) {
  return (
    <>
      {data.subDashboards.map((sub) => (
        <section key={sub.name}>
          <h2 className="sub-dashboard-title">{sub.name}</h2>
          <div className="indicator-grid">
            {sub.indicators.map((item) => (
              <IndicatorCard key={item.id} item={item} />
            ))}
          </div>
        </section>
      ))}
    </>
  );
}
