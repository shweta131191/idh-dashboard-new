# IDH Regenerative Coffee Program — Dashboard

A leadership + program-team dashboard covering all 9 sections of the IDH Logic Sheet
(Overview, Farmer Mobilization, Regen Agricultural Practices, Soil Health, Water
Management, Biodiversity, Climate/GHG, Livelihood Diversification, Others) — 69
indicators in total, rendered with Highcharts (column charts) and ECharts (pie/donut
charts).

## How this repo is organized

```
shared/indicators.json        canonical registry — every indicator's dashboard,
                               chart type, source form/table/column, logic, and
                               real SQL — the single source of truth
docs/INDICATOR_MAPPING.md     human-readable version of the registry, regenerate
                               with `node scripts/generate-mapping-doc.js`
backend/                      Express + TypeScript API
frontend/                     React + Vite + TypeScript app
```

The registry is the source of truth on purpose: the API's data shape, the
generated mapping doc, and (indirectly) the frontend's rendering are all driven
from `shared/indicators.json` so the three can't drift out of sync. To change an
indicator's logic, chart type, or source column, edit the registry, then run
`node scripts/generate-mapping-doc.js` to refresh the docs.

## Prerequisites

**Node.js 18+ and npm are required and were not available in the environment this
was built in — none of this has been run or type-checked yet.** Before anything
else:

```bash
node -v   # confirm 18+
npm -v
```

## Setup

```bash
npm install                       # installs both workspaces (backend + frontend)
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

By default `DATA_MODE=mock` in `backend/.env` — the API serves realistic sample
data (some numbers taken directly from the logic sheet's manually-verified counts,
e.g. gender and landholding distributions) without needing a database connection.

## Running

```bash
npm run dev:backend     # http://localhost:4000
npm run dev:frontend    # http://localhost:5173
```

Open http://localhost:5173 — it should redirect to the Overview dashboard.

## Typecheck / build

```bash
npm run typecheck
npm run build:backend
npm run build:frontend
```

**These have not been run yet in this environment (no Node.js was available while
building it).** Please run them after `npm install` and report back anything that
fails — most likely candidates are dependency version pins in `package.json` that
may need bumping, since versions were hand-written rather than resolved by npm.

## Connecting to the real database

Set `DATA_MODE=live` in `backend/.env` and fill in `DB_HOST` / `DB_PORT` / `DB_USER`
/ `DB_PASSWORD` / `DB_NAME` (matching `idh_prod_sync_driver (1).sql`). The query
layer (`backend/src/services/liveQuery.ts`) builds parameterized SQL from the same
registry metadata used for mock mode — every indicator should start returning real
numbers with no frontend changes.

Two things to verify against the real data before going live, flagged in
`shared/indicators.json` / `docs/INDICATOR_MAPPING.md` as `notes`:

1. **Multi-select storage format.** The live query layer assumes multi-select
   answers (e.g. `demonstrated_practices`, `biodiversity_practices`) are stored as
   comma-separated values compatible with MySQL's `FIND_IN_SET()`. Confirm this
   against real rows — if the actual export format differs (JSON array, pipe
   separated, etc.), only `liveQuery.ts` needs to change; the registry doesn't.
2. **Sheet ambiguities.** A handful of indicators had contradictory or incomplete
   instructions in the logic sheet itself (e.g. row 6's "Access to Inputs" category,
   row 22's bar-vs-pie conflict between the Validations and Revised Logic columns,
   row 44's undefined "any activity" column set, row 54's "Bark Scrubbing" indicator
   reusing another indicator's question verbatim). Each is called out in that
   indicator's `notes` field with the assumption made — worth a quick client
   confirmation pass before sign-off.

## Filters

State → District → Block (from `backend/src/services/geography.ts`, illustrative
Karnataka coffee geography — swap for a real query once `DATA_MODE=live`) plus a
date range, applied uniformly across every indicator via
`backend/src/services/sqlBuilder.ts`.

## India map widget

The Overview dashboard includes a drill-down map (India → state → district →
block) with a beneficiary-density choropleth layer and a partner-presence marker
layer, built per `Dashboard Design Sheet/map_widget_reference.md`:

- `frontend/src/data/geoData.ts` — static geography skeleton (names, hierarchy,
  approximate centroids) plus `mergeLiveGeoSummary()`, which overlays live counts
  from `GET /api/geo-summary` on top of it.
- `frontend/src/components/dashboard/IndiaMapWidget.tsx` — the map itself
  (react-simple-maps + d3-geo), sharing the same `Filters` state as the FilterBar
  dropdowns, so clicking a state/district on the map and choosing one from the
  dropdown stay in sync in both directions.
- `backend/src/services/geoSummary.ts` / `routes/geoSummary.ts` — mock
  beneficiary/partner aggregates today; replace with a real
  `GROUP BY state_id/district_id/block_id` query when `DATA_MODE=live`.

It fetches India/state TopoJSON at runtime from `cdn.jsdelivr.net` (per the
reference doc) — this needs outbound network access from the browser; if you're
behind a restrictive proxy/CSP, mirror those TopoJSON files locally and update
`INDIA_TOPO_URL` / `STATE_TOPO_URLS`. Only Karnataka (Kodagu, Chikmagalur, Hassan)
has real districts/blocks/villages populated in the mock skeleton — extend
`ACTIVE_STATES` and `stateData` in `geoData.ts` if the program expands to other
states.

## Design system

Chart colors follow the validated default palette from the project's `dataviz`
skill (`shared` categorical hues, unmodified) — see
`frontend/src/theme/tokens.css` and `frontend/src/theme/palette.ts`. Both light
and dark mode are supported (auto via OS preference, or toggled from the topbar).
