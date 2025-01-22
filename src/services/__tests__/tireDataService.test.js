import { SEASONS, analyzeTireData, fetchTireProducts } from '../tireDataService';
import { collection, getDocs } from 'firebase/firestore';

// Mock Firebase
jest.mock('firebase/firestore', () => ({
  collection: jest.fn(),
  getDocs: jest.fn(),
  query: jest.fn(),
  where: jest.fn()
}));

// Testidataa
const mockTireData = [
  { id: '1', season: SEASONS.SUMMER, price: 100, noise_level: 72 },
  { id: '2', season: SEASONS.WINTER, price: 120, noise_level: 75 },
  { id: '3', season: SEASONS.SUMMER, price: 90, noise_level: 70 },
  { id: '4', season: SEASONS.WINTER, price: 150, noise_level: 73 }
];

describe('tireDataService', () => {
  describe('analyzeTireData', () => {
    it('laskee hintatilastot oikein', () => {
      const analysis = analyzeTireData(mockTireData, 'price');
      
      expect(analysis.total).toBe(4);
      expect(analysis.min).toBe(90);
      expect(analysis.max).toBe(150);
      expect(analysis.average).toBe(115);
      expect(analysis.seasonBreakdown.summer).toBe(2);
      expect(analysis.seasonBreakdown.winter).toBe(2);
    });

    it('laskee melutason tilastot oikein', () => {
      const analysis = analyzeTireData(mockTireData, 'noise_level');
      
      expect(analysis.total).toBe(4);
      expect(analysis.min).toBe(70);
      expect(analysis.max).toBe(75);
      expect(analysis.average).toBe(72.5);
    });

    it('käsittelee tyhjän datan oikein', () => {
      const analysis = analyzeTireData([], 'price');
      
      expect(analysis.total).toBe(0);
      expect(analysis.seasonBreakdown.summer).toBe(0);
      expect(analysis.seasonBreakdown.winter).toBe(0);
    });
  });

  describe('fetchTireProducts', () => {
    beforeEach(() => {
      // Nollataan mockit ennen jokaista testiä
      jest.clearAllMocks();
    });

    it('hakee renkaat oikeilla filttereillä', async () => {
      // Mockataan Firebase-vastaus
      getDocs.mockResolvedValueOnce({
        docs: mockTireData.map(data => ({
          id: data.id,
          data: () => data
        }))
      });

      const filters = {
        season: SEASONS.SUMMER,
        rim_size: '17'
      };

      const result = await fetchTireProducts(filters);

      expect(result.length).toBe(4);
      expect(getDocs).toHaveBeenCalled();
    });

    it('käsittelee virhetilanteet oikein', async () => {
      getDocs.mockRejectedValueOnce(new Error('Firebase error'));

      await expect(fetchTireProducts({})).rejects.toThrow('Firebase error');
    });
  });
}); 