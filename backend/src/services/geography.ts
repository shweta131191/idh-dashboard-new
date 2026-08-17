// Illustrative geography tree for the filter bar (mock mode). In DATA_MODE=live this
// would be replaced by SELECT id, name FROM state / district / block joined on parent id.
export const geography = {
  states: [
    {
      id: '1',
      name: 'Karnataka',
      districts: [
        {
          id: '11',
          name: 'Kodagu',
          blocks: [
            { id: '111', name: 'Madikeri' },
            { id: '112', name: 'Virajpet' },
            { id: '113', name: 'Somwarpet' },
          ],
        },
        {
          id: '12',
          name: 'Chikmagalur',
          blocks: [
            { id: '121', name: 'Mudigere' },
            { id: '122', name: 'Koppa' },
            { id: '123', name: 'Sringeri' },
          ],
        },
        {
          id: '13',
          name: 'Hassan',
          blocks: [
            { id: '131', name: 'Sakleshpur' },
            { id: '132', name: 'Belur' },
          ],
        },
      ],
    },
  ],
};
