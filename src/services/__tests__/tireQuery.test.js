import { fetchTireProducts, SEASONS } from '../tireDataService';

describe('Rengashaku', () => {
  it('hakee talvirenkaat oikein', async () => {
    const filters = {
      season: SEASONS.WINTER,
      rim_size: '17'
    };
    
    const renkaat = await fetchTireProducts(filters);
    console.log('Talvirengashaku:', {
      filters,
      löytyi: renkaat.length,
      esimerkki: renkaat[0]
    });
    
    expect(renkaat.length).toBeGreaterThan(0);
    expect(renkaat[0].season).toBe(SEASONS.WINTER);
  });
}); 