import { useGeography } from '../../hooks/useGeography';
import { useFilters } from '../../state/FiltersContext';

export function FilterBar() {
  const geography = useGeography();
  const { filters, setFilters } = useFilters();

  const state = geography?.states.find((s) => s.id === filters.stateId);
  const district = state?.districts.find((d) => d.id === filters.districtId);

  return (
    <div className="filter-bar">
      <label>
        State
        <select
          value={filters.stateId ?? ''}
          onChange={(e) =>
            setFilters({
              dateFrom: filters.dateFrom,
              dateTo: filters.dateTo,
              stateId: e.target.value || undefined,
              districtId: undefined,
              blockId: undefined,
            })
          }
        >
          <option value="">All States</option>
          {geography?.states.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>
      </label>

      <label>
        District
        <select
          value={filters.districtId ?? ''}
          disabled={!state}
          onChange={(e) => setFilters({ ...filters, districtId: e.target.value || undefined, blockId: undefined })}
        >
          <option value="">All Districts</option>
          {state?.districts.map((d) => (
            <option key={d.id} value={d.id}>
              {d.name}
            </option>
          ))}
        </select>
      </label>

      <label>
        Block
        <select
          value={filters.blockId ?? ''}
          disabled={!district}
          onChange={(e) => setFilters({ ...filters, blockId: e.target.value || undefined })}
        >
          <option value="">All Blocks</option>
          {district?.blocks.map((b) => (
            <option key={b.id} value={b.id}>
              {b.name}
            </option>
          ))}
        </select>
      </label>

      <label>
        From
        <input
          type="date"
          value={filters.dateFrom ?? ''}
          onChange={(e) => setFilters({ ...filters, dateFrom: e.target.value || undefined })}
        />
      </label>

      <label>
        To
        <input
          type="date"
          value={filters.dateTo ?? ''}
          onChange={(e) => setFilters({ ...filters, dateTo: e.target.value || undefined })}
        />
      </label>

      {(filters.stateId || filters.districtId || filters.blockId || filters.dateFrom || filters.dateTo) && (
        <button className="theme-toggle" onClick={() => setFilters({})}>
          Clear filters
        </button>
      )}
    </div>
  );
}
