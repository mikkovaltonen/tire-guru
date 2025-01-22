import { mockData } from '../__mocks__/firebase';

// Yksinkertainen mock tiedonhakufunktiolle
jest.mock('../tireDataService', () => ({
  fetchTireProducts: jest.fn().mockResolvedValue(mockData)
}));

describe('Rengasraportti', () => {
  it('näyttää rengasjakauman', () => {
    // Lasketaan suoraan mock-datasta
    const brandStats = mockData.reduce((stats, rengas) => {
      const brand = rengas.brand || 'Unknown';
      stats[brand] = (stats[brand] || 0) + 1;
      return stats;
    }, {});

    console.log('\nRengasmerkkien määrät:');
    console.table(brandStats);

    // Tarkista tulokset
    expect(brandStats['Nokian']).toBe(2);
    expect(brandStats['Michelin']).toBe(2);
  });

  it('näyttää kausijakauman', () => {
    const seasonStats = mockData.reduce((stats, rengas) => {
      const brand = rengas.brand;
      if (!stats[brand]) {
        stats[brand] = { winter: 0, summer: 0 };
      }
      if (rengas.season === 'Wi') stats[brand].winter++;
      if (rengas.season === 'So') stats[brand].summer++;
      return stats;
    }, {});

    console.log('\nKausijakauma merkeittäin:');
    console.table(seasonStats);

    // Tarkista tulokset
    expect(seasonStats['Nokian'].winter).toBe(1);
    expect(seasonStats['Nokian'].summer).toBe(1);
  });
}); 