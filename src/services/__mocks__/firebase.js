// Mock Firebase config
export const mockFirebase = {
  collection: jest.fn(),
  getDocs: jest.fn(),
  query: jest.fn(),
  where: jest.fn()
};

// Mock data
export const mockData = [
  { id: '1', brand: "Nokian", season: "Wi", price: 120 },
  { id: '2', brand: "Nokian", season: "So", price: 100 },
  { id: '3', brand: "Michelin", season: "Wi", price: 150 },
  { id: '4', brand: "Michelin", season: "So", price: 130 }
]; 