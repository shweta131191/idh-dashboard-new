// Geographic data & filters for the India map widget.
// Structural skeleton (names, hierarchy, approximate centroids) lives here as
// static mock data; beneficiary/partner counts are overwritten at runtime by
// GET /api/geo-summary when it's reachable (see IndiaMapWidget's live-data fetch).

const TOPO_BASE = 'https://cdn.jsdelivr.net/gh/udit-001/india-maps-data@ef25ebc/topojson';

export const INDIA_TOPO_URL = `${TOPO_BASE}/india.json`;

export const STATE_TOPO_URLS: Record<string, string> = {
  Karnataka: `${TOPO_BASE}/states/karnataka.json`,
  Kerala: `${TOPO_BASE}/states/kerala.json`,
  'Tamil Nadu': `${TOPO_BASE}/states/tamil-nadu.json`,
};

// States the program currently operates in — only these get real data;
// any other state on the India map renders as an inactive/neutral fill.
export const ACTIVE_STATES = ['Karnataka'];

export interface VillageNode {
  id: string;
  name: string;
  beneficiaries: number;
}

export interface BlockNode {
  id: string;
  name: string;
  beneficiaries: number;
  villages: VillageNode[];
}

export interface DistrictNode {
  id: string;
  name: string;
  beneficiaries: number;
  partners: number;
  center: [number, number];
  blocks: BlockNode[];
}

export interface StateNode {
  id: string;
  name: string;
  beneficiaries: number;
  partners: number;
  center: [number, number];
  districts: DistrictNode[];
}

export interface GeoLocationData {
  states: StateNode[];
}

export const stateData: GeoLocationData = {
  states: [
    {
      id: '1',
      name: 'Karnataka',
      beneficiaries: 26162,
      partners: 14,
      center: [75.7, 15.3],
      districts: [
        {
          id: '11',
          name: 'Kodagu',
          beneficiaries: 12000,
          partners: 6,
          center: [75.73, 12.42],
          blocks: [
            {
              id: '111',
              name: 'Madikeri',
              beneficiaries: 5200,
              villages: [
                { id: '111-1', name: 'Madikeri Cluster 1', beneficiaries: 2800 },
                { id: '111-2', name: 'Madikeri Cluster 2', beneficiaries: 2400 },
              ],
            },
            {
              id: '112',
              name: 'Virajpet',
              beneficiaries: 4100,
              villages: [
                { id: '112-1', name: 'Virajpet Cluster 1', beneficiaries: 2200 },
                { id: '112-2', name: 'Virajpet Cluster 2', beneficiaries: 1900 },
              ],
            },
            {
              id: '113',
              name: 'Somwarpet',
              beneficiaries: 2700,
              villages: [
                { id: '113-1', name: 'Somwarpet Cluster 1', beneficiaries: 1500 },
                { id: '113-2', name: 'Somwarpet Cluster 2', beneficiaries: 1200 },
              ],
            },
          ],
        },
        {
          id: '12',
          name: 'Chikmagalur',
          beneficiaries: 9000,
          partners: 5,
          center: [75.77, 13.32],
          blocks: [
            {
              id: '121',
              name: 'Mudigere',
              beneficiaries: 3600,
              villages: [
                { id: '121-1', name: 'Mudigere Cluster 1', beneficiaries: 2000 },
                { id: '121-2', name: 'Mudigere Cluster 2', beneficiaries: 1600 },
              ],
            },
            {
              id: '122',
              name: 'Koppa',
              beneficiaries: 3000,
              villages: [
                { id: '122-1', name: 'Koppa Cluster 1', beneficiaries: 1700 },
                { id: '122-2', name: 'Koppa Cluster 2', beneficiaries: 1300 },
              ],
            },
            {
              id: '123',
              name: 'Sringeri',
              beneficiaries: 2400,
              villages: [
                { id: '123-1', name: 'Sringeri Cluster 1', beneficiaries: 1300 },
                { id: '123-2', name: 'Sringeri Cluster 2', beneficiaries: 1100 },
              ],
            },
          ],
        },
        {
          id: '13',
          name: 'Hassan',
          beneficiaries: 5162,
          partners: 3,
          center: [76.1, 13.0],
          blocks: [
            {
              id: '131',
              name: 'Sakleshpur',
              beneficiaries: 3162,
              villages: [
                { id: '131-1', name: 'Sakleshpur Cluster 1', beneficiaries: 1700 },
                { id: '131-2', name: 'Sakleshpur Cluster 2', beneficiaries: 1462 },
              ],
            },
            {
              id: '132',
              name: 'Belur',
              beneficiaries: 2000,
              villages: [
                { id: '132-1', name: 'Belur Cluster 1', beneficiaries: 1100 },
                { id: '132-2', name: 'Belur Cluster 2', beneficiaries: 900 },
              ],
            },
          ],
        },
      ],
    },
  ],
};

export interface GeoFilters {
  stateId?: string;
  districtId?: string;
  blockId?: string;
}

/** Client-side filtering of the geo tree down to a matching state/district/block. */
export function applyFiltersToGeoData(data: GeoLocationData, filters: GeoFilters): GeoLocationData {
  let states = data.states;
  if (filters.stateId) states = states.filter((s) => s.id === filters.stateId);

  states = states.map((s) => {
    let districts = s.districts;
    if (filters.districtId) districts = districts.filter((d) => d.id === filters.districtId);
    if (filters.blockId) {
      districts = districts
        .map((d) => ({ ...d, blocks: d.blocks.filter((b) => b.id === filters.blockId) }))
        .filter((d) => d.blocks.length > 0);
    }
    return { ...s, districts };
  });

  return { states };
}

// Shape returned by GET /api/geo-summary — counts only, no map-rendering fields
// (center/villages) since those are frontend presentation concerns.
export interface LiveGeoSummary {
  states: {
    id: string;
    name: string;
    beneficiaries: number;
    partners: number;
    districts: {
      id: string;
      name: string;
      beneficiaries: number;
      partners: number;
      blocks: { id: string; name: string; beneficiaries: number }[];
    }[];
  }[];
}

/** Merges live beneficiary/partner counts (from /api/geo-summary) over the static skeleton. */
export function mergeLiveGeoSummary(base: GeoLocationData, live: LiveGeoSummary | null): GeoLocationData {
  if (!live) return base;
  const liveStates = new Map(live.states.map((s) => [s.id, s]));

  return {
    states: base.states.map((s) => {
      const liveState = liveStates.get(s.id);
      if (!liveState) return s;
      const liveDistricts = new Map(liveState.districts.map((d) => [d.id, d]));
      return {
        ...s,
        beneficiaries: liveState.beneficiaries,
        partners: liveState.partners,
        districts: s.districts.map((d) => {
          const liveDistrict = liveDistricts.get(d.id);
          if (!liveDistrict) return d;
          const liveBlocks = new Map(liveDistrict.blocks.map((b) => [b.id, b]));
          return {
            ...d,
            beneficiaries: liveDistrict.beneficiaries,
            partners: liveDistrict.partners,
            blocks: d.blocks.map((b) => {
              const liveBlock = liveBlocks.get(b.id);
              return liveBlock ? { ...b, beneficiaries: liveBlock.beneficiaries } : b;
            }),
          };
        }),
      };
    }),
  };
}
