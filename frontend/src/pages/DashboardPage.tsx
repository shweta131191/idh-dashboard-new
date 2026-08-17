import { useParams } from 'react-router-dom';
import { Topbar } from '../components/layout/Topbar';
import { FilterBar } from '../components/layout/FilterBar';
import { DashboardGrid } from '../components/DashboardGrid';
import { IndiaMapWidget } from '../components/dashboard/IndiaMapWidget';
import { useDashboardData } from '../hooks/useDashboardData';
import { useDashboards } from '../hooks/useDashboards';
import { useFilters } from '../state/FiltersContext';

export function DashboardPage() {
  const { id = 'overview' } = useParams();
  const { dashboards } = useDashboards();
  const { filters, setFilters } = useFilters();
  const { data, loading, error } = useDashboardData(id, filters);

  const label = dashboards.find((d) => d.id === id)?.label ?? 'Dashboard';

  return (
    <div className="main-column">
      <Topbar title={label} />
      <FilterBar />
      <div className="dashboard-content">
        {id === 'overview' && <IndiaMapWidget filters={filters} onFilterChange={setFilters} />}
        {loading && <div className="loading-state">Loading indicators…</div>}
        {error && <div className="error-state">Couldn’t load this dashboard: {error}</div>}
        {data && <DashboardGrid data={data} />}
      </div>
    </div>
  );
}
