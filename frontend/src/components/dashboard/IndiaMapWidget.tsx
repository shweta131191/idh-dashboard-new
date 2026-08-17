import { memo, useEffect, useMemo, useState } from 'react';
import { ComposableMap, Geographies, Geography, Marker, ZoomableGroup } from 'react-simple-maps';
import {
  ACTIVE_STATES,
  INDIA_TOPO_URL,
  STATE_TOPO_URLS,
  applyFiltersToGeoData,
  mergeLiveGeoSummary,
  stateData,
  type BlockNode,
  type DistrictNode,
  type LiveGeoSummary,
  type StateNode,
} from '../../data/geoData';
import { api } from '../../api/client';
import type { Filters } from '../../api/types';

type Layer = 'beneficiaries' | 'partners';

interface TooltipState {
  x: number;
  y: number;
  content: string;
}

interface Props {
  filters: Filters;
  onFilterChange: (next: Filters) => void;
}

// 5-stop HSL choropleth ramp — light blue-gray (near-zero) through darkening green (highest density).
const CHOROPLETH_STOPS: { pct: number; color: [number, number, number] }[] = [
  { pct: 0, color: [210, 30, 95] },
  { pct: 0.25, color: [152, 50, 75] },
  { pct: 0.5, color: [152, 55, 55] },
  { pct: 0.75, color: [152, 60, 40] },
  { pct: 1, color: [152, 65, 25] },
];

function choroplethColor(pct: number): string {
  const clamped = Math.max(0, Math.min(1, pct));
  for (let i = 0; i < CHOROPLETH_STOPS.length - 1; i++) {
    const a = CHOROPLETH_STOPS[i];
    const b = CHOROPLETH_STOPS[i + 1];
    if (clamped >= a.pct && clamped <= b.pct) {
      const t = (clamped - a.pct) / (b.pct - a.pct || 1);
      const h = a.color[0] + (b.color[0] - a.color[0]) * t;
      const s = a.color[1] + (b.color[1] - a.color[1]) * t;
      const l = a.color[2] + (b.color[2] - a.color[2]) * t;
      return `hsl(${h}, ${s}%, ${l}%)`;
    }
  }
  const last = CHOROPLETH_STOPS[CHOROPLETH_STOPS.length - 1].color;
  return `hsl(${last[0]}, ${last[1]}%, ${last[2]}%)`;
}

function IndiaMapWidgetImpl({ filters, onFilterChange }: Props) {
  const [activeLayer, setActiveLayer] = useState<Layer>('beneficiaries');
  const [tooltip, setTooltip] = useState<TooltipState | null>(null);
  const [liveSummary, setLiveSummary] = useState<LiveGeoSummary | null>(null);

  // Live data: fetched once and merged over the static structural skeleton, so the
  // widget shows real aggregates as soon as DATA_MODE=live without any UI changes.
  useEffect(() => {
    let cancelled = false;
    api
      .getGeoSummary()
      .then((data) => {
        if (!cancelled) setLiveSummary(data);
      })
      .catch(() => {
        /* fall back to static mock silently — this is a non-critical enhancement layer */
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const geoData = useMemo(() => mergeLiveGeoSummary(stateData, liveSummary), [liveSummary]);

  // Drill level is derived directly from the shared filter state (not local
  // component state) so the map, the breadcrumb, and the FilterBar dropdowns in
  // the top bar always agree on the current selection.
  const currentState: StateNode | undefined = filters.stateId
    ? geoData.states.find((s) => s.id === filters.stateId)
    : undefined;
  const currentDistrict: DistrictNode | undefined = filters.districtId
    ? currentState?.districts.find((d) => d.id === filters.districtId)
    : undefined;
  const currentBlock: BlockNode | undefined = filters.blockId
    ? currentDistrict?.blocks.find((b) => b.id === filters.blockId)
    : undefined;

  const level: 'india' | 'state' | 'district' | 'block' = currentBlock
    ? 'block'
    : currentDistrict
      ? 'district'
      : currentState
        ? 'state'
        : 'india';

  const maxBeneficiaries = useMemo(() => {
    if (level === 'state' && currentState) {
      return Math.max(...currentState.districts.map((d) => d.beneficiaries), 1);
    }
    return Math.max(...geoData.states.map((s) => s.beneficiaries), 1);
  }, [level, currentState, geoData]);

  function selectState(state: StateNode) {
    onFilterChange({ ...filters, stateId: state.id, districtId: undefined, blockId: undefined });
  }
  function selectDistrict(district: DistrictNode) {
    onFilterChange({ ...filters, districtId: district.id, blockId: undefined });
  }
  function selectBlock(block: BlockNode) {
    onFilterChange({ ...filters, blockId: block.id });
  }
  function goToIndia() {
    onFilterChange({ ...filters, stateId: undefined, districtId: undefined, blockId: undefined });
  }
  function goToState() {
    onFilterChange({ ...filters, districtId: undefined, blockId: undefined });
  }
  function goToDistrict() {
    onFilterChange({ ...filters, blockId: undefined });
  }

  function renderMap() {
    const isIndia = level === 'india';
    const topoUrl = isIndia ? INDIA_TOPO_URL : STATE_TOPO_URLS[currentState!.name];
    const projConfig = isIndia
      ? { scale: 1000, center: [82, 22] as [number, number] }
      : { scale: 3500, center: currentState!.center };

    if (!isIndia && !topoUrl) {
      return <div className="loading-state">No map data available for {currentState!.name} yet.</div>;
    }

    return (
      <div style={{ position: 'relative' }}>
        {/* 3D hover shadow filter, applied to the active geography on hover */}
        <svg width={0} height={0}>
          <defs>
            <filter id="geo-hover-shadow">
              <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="hsl(152, 55%, 32%)" floodOpacity="0.4" />
            </filter>
          </defs>
        </svg>

        <ComposableMap
          projection="geoMercator"
          projectionConfig={projConfig}
          width={800}
          height={500}
          style={{ width: '100%', height: 'auto' }}
        >
          <ZoomableGroup center={projConfig.center} zoom={1}>
            <Geographies geography={topoUrl}>
              {({ geographies }) =>
                geographies.map((geo) => {
                  const props = geo.properties as Record<string, string | undefined>;
                  const name = isIndia ? props.st_nm ?? props.NAME_1 : props.dt_nm ?? props.district ?? props.NAME_2;

                  const match = isIndia
                    ? geoData.states.find((s) => s.name === name)
                    : currentState?.districts.find((d) => d.name === name);

                  const isActive = isIndia ? Boolean(name && ACTIVE_STATES.includes(name)) : Boolean(match);
                  const value = match?.beneficiaries ?? 0;
                  const fill =
                    activeLayer === 'beneficiaries' && isActive
                      ? choroplethColor(value / maxBeneficiaries)
                      : isActive
                        ? '#cde2fb'
                        : '#eef0ee';

                  return (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      fill={fill}
                      stroke="#ffffff"
                      strokeWidth={0.5}
                      style={{
                        default: { outline: 'none' },
                        hover: {
                          outline: 'none',
                          filter: isActive ? 'url(#geo-hover-shadow)' : undefined,
                          cursor: isActive && match ? 'pointer' : 'default',
                        },
                        pressed: { outline: 'none' },
                      }}
                      onMouseMove={(evt) => {
                        if (!match || !name) return;
                        setTooltip({
                          x: evt.clientX,
                          y: evt.clientY,
                          content: `${name} — ${match.beneficiaries.toLocaleString('en-IN')} beneficiaries`,
                        });
                      }}
                      onMouseLeave={() => setTooltip(null)}
                      onClick={() => {
                        if (!match) return;
                        if (isIndia) selectState(match as StateNode);
                        else selectDistrict(match as DistrictNode);
                      }}
                    />
                  );
                })
              }
            </Geographies>

            {/* Partner markers — India level only, one circle per active state sized by partner count */}
            {activeLayer === 'partners' &&
              isIndia &&
              geoData.states.map((s) => (
                <Marker key={s.id} coordinates={s.center}>
                  <circle
                    r={4 + Math.sqrt(s.partners)}
                    style={{ fill: 'var(--series-2)', fillOpacity: 0.75 }}
                    stroke="#fff"
                    strokeWidth={1}
                  />
                </Marker>
              ))}
          </ZoomableGroup>
        </ComposableMap>

        {tooltip && (
          <div className="map-tooltip" style={{ left: tooltip.x, top: tooltip.y }}>
            {tooltip.content}
          </div>
        )}
      </div>
    );
  }

  function renderListView() {
    if (level === 'district' && currentDistrict) {
      return (
        <div className="geo-card-grid">
          {currentDistrict.blocks.map((b) => (
            <button key={b.id} type="button" className="geo-card" onClick={() => selectBlock(b)}>
              <div className="geo-card-name">{b.name}</div>
              <div className="geo-card-value">{b.beneficiaries.toLocaleString('en-IN')} beneficiaries</div>
            </button>
          ))}
        </div>
      );
    }
    if (level === 'block' && currentBlock) {
      return (
        <div className="geo-card-grid">
          {currentBlock.villages.map((v) => (
            <div key={v.id} className="geo-card geo-card-static">
              <div className="geo-card-name">{v.name}</div>
              <div className="geo-card-value">{v.beneficiaries.toLocaleString('en-IN')} beneficiaries</div>
            </div>
          ))}
        </div>
      );
    }
    return null;
  }

  const breadcrumbs: { label: string; onClick?: () => void }[] = [
    { label: 'India', onClick: level !== 'india' ? goToIndia : undefined },
  ];
  if (currentState) breadcrumbs.push({ label: currentState.name, onClick: level !== 'state' ? goToState : undefined });
  if (currentDistrict) breadcrumbs.push({ label: currentDistrict.name, onClick: level !== 'district' ? goToDistrict : undefined });
  if (currentBlock) breadcrumbs.push({ label: currentBlock.name });

  const totalBeneficiaries = geoData.states.reduce((sum, s) => sum + s.beneficiaries, 0);
  const totalPartners = geoData.states.reduce((sum, s) => sum + s.partners, 0);
  const totalDistricts = geoData.states.reduce((sum, s) => sum + s.districts.length, 0);

  return (
    <div className="map-widget">
      <div className="map-widget-header">
        <div className="breadcrumbs">
          {breadcrumbs.map((crumb, idx) => (
            <span key={idx}>
              {idx > 0 && <span className="breadcrumb-sep">/</span>}
              {crumb.onClick ? (
                <button type="button" className="breadcrumb-link" onClick={crumb.onClick}>
                  {crumb.label}
                </button>
              ) : (
                <span className="breadcrumb-current">{crumb.label}</span>
              )}
            </span>
          ))}
        </div>
        <div className="layer-toggle">
          <button
            type="button"
            className={activeLayer === 'beneficiaries' ? 'active' : ''}
            onClick={() => setActiveLayer('beneficiaries')}
          >
            Beneficiaries
          </button>
          <button type="button" className={activeLayer === 'partners' ? 'active' : ''} onClick={() => setActiveLayer('partners')}>
            Partners
          </button>
        </div>
      </div>

      <div className="map-widget-body">
        <div className="map-widget-main">{level === 'district' || level === 'block' ? renderListView() : renderMap()}</div>

        <aside className="map-widget-sidebar">
          {activeLayer === 'beneficiaries' ? (
            <div className="map-legend">
              <div className="map-legend-title">Beneficiary density</div>
              <div className="map-legend-ramp">
                {CHOROPLETH_STOPS.map((stop) => (
                  <span key={stop.pct} style={{ background: choroplethColor(stop.pct) }} />
                ))}
              </div>
              <div className="map-legend-scale">
                <span>Low</span>
                <span>High</span>
              </div>
            </div>
          ) : (
            <div className="map-legend">
              <div className="map-legend-title">Partner presence</div>
              <div className="map-legend-note">Circle size scales with number of implementing partners per state.</div>
            </div>
          )}

          <div className="map-coverage">
            <div className="map-coverage-title">Program coverage</div>
            <div className="map-coverage-row">
              <span>States</span>
              <b>{geoData.states.length}</b>
            </div>
            <div className="map-coverage-row">
              <span>Districts</span>
              <b>{totalDistricts}</b>
            </div>
            <div className="map-coverage-row">
              <span>Beneficiaries</span>
              <b>{totalBeneficiaries.toLocaleString('en-IN')}</b>
            </div>
            <div className="map-coverage-row">
              <span>Partners</span>
              <b>{totalPartners}</b>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

export const IndiaMapWidget = memo(IndiaMapWidgetImpl);

// Re-exported for callers that only need to pre-filter the static skeleton
// without rendering the widget (e.g. server-side summaries, tests).
export { applyFiltersToGeoData };
