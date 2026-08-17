// Aggregated beneficiary/partner counts per state → district → block, for the
// India map widget's choropleth + partner layers. In DATA_MODE=live this would
// GROUP BY state_id/district_id/block_id over farmer_master_form (+ partner)
// instead of returning this fixed mock breakdown.
export const geoSummary = {
  states: [
    {
      id: '1',
      name: 'Karnataka',
      beneficiaries: 26162,
      partners: 14,
      districts: [
        {
          id: '11',
          name: 'Kodagu',
          beneficiaries: 12000,
          partners: 6,
          blocks: [
            { id: '111', name: 'Madikeri', beneficiaries: 5200 },
            { id: '112', name: 'Virajpet', beneficiaries: 4100 },
            { id: '113', name: 'Somwarpet', beneficiaries: 2700 },
          ],
        },
        {
          id: '12',
          name: 'Chikmagalur',
          beneficiaries: 9000,
          partners: 5,
          blocks: [
            { id: '121', name: 'Mudigere', beneficiaries: 3600 },
            { id: '122', name: 'Koppa', beneficiaries: 3000 },
            { id: '123', name: 'Sringeri', beneficiaries: 2400 },
          ],
        },
        {
          id: '13',
          name: 'Hassan',
          beneficiaries: 5162,
          partners: 3,
          blocks: [
            { id: '131', name: 'Sakleshpur', beneficiaries: 3162 },
            { id: '132', name: 'Belur', beneficiaries: 2000 },
          ],
        },
      ],
    },
  ],
};
