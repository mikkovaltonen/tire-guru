import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../config/firebase';

// Käytetään vain tietokannan alkuperäisiä koodeja
export const SEASONS = {
  SUMMER: 'So',
  WINTER: 'Wi'
};

// Yksinkertainen hakufunktio ilman ylimääräisiä validointeja
export const fetchTireProducts = async (filters = {}) => {
  try {
    let q = collection(db, 'tire_products');
    const constraints = [];

    // Debug: Tarkistetaan filtterit ja niiden tyypit
    console.log('Filter analysis:', {
      filters,
      types: {
        width: typeof filters.width,
        profile: typeof filters.profile,
        diameter: typeof filters.diameter,
        season: typeof filters.season
      }
    });

    if (filters.season) {
      constraints.push(where('season', '==', filters.season));
    }
    // Käytetään diameter-arvoa rim_size-kentän hakuun
    if (filters.diameter) {
      console.log('Adding rim_size filter:', Number(filters.diameter));
      constraints.push(where('rim_size', '==', Number(filters.diameter)));
    }
    if (filters.width && filters.width !== '') {
      constraints.push(where('width', '==', Number(filters.width)));
    }
    if (filters.profile && filters.profile !== '') {
      constraints.push(where('profile', '==', Number(filters.profile)));
    }

    if (constraints.length > 0) {
      q = query(q, ...constraints);
    }

    const snapshot = await getDocs(q);
    
    // Debug: Tarkistetaan kaikki renkaat ja niiden kentät
    const allTires = snapshot.docs.map(doc => doc.data());
    console.log('Data analysis:', {
      totalFound: snapshot.size,
      filters: constraints.map(c => c.toString()),
      sampleSizes: allTires.map(t => ({
        brand: t.brand,
        rim_size: t.rim_size,
        size: t.size,
        diameter: t.diameter
      })).slice(0, 5)
    });

    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

  } catch (error) {
    console.error('Error fetching tire data:', error);
    throw error;
  }
};

// Data normalization utilities
const normalizeSeasonCode = (season) => {
  if (SEASONS.SUMMER.includes(season)) return 'Su';
  if (SEASONS.WINTER.includes(season)) return 'Wi';
  return season;
};

const normalizeNumericValue = (value) => {
  const num = Number(value);
  return !isNaN(num) && num > 0 ? num : null;
};

const normalizeNoiseLevel = (noise) => {
  if (!noise) return null;
  const cleanedValue = noise.toString().replace(/[^\d.]/g, '');
  const parsed = parseFloat(cleanedValue);
  return (!isNaN(parsed) && parsed >= 50 && parsed <= 100) ? parsed : null;
};

// Data fetching and processing
export const fetchTireData = async () => {
  try {
    const snapshot = await getDocs(collection(db, 'tire_products'));
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      // Normalize data
      season: normalizeSeasonCode(doc.data().season),
      price: normalizeNumericValue(doc.data().price),
      width: normalizeNumericValue(doc.data().width),
      profile: normalizeNumericValue(doc.data().profile),
      rim_size: normalizeNumericValue(doc.data().rim_size),
      noise_level: normalizeNoiseLevel(doc.data().noise_level)
    }));
  } catch (error) {
    console.error('Error fetching tire data:', error);
    throw error;
  }
};

// Data filtering
export const filterTireData = (data, { season, metric }) => {
  return data.filter(product => {
    const hasValidValue = !isNaN(Number(product[metric])) && Number(product[metric]) > 0;
    const hasValidSeason = season === 'all' || product.season === season;
    return hasValidValue && hasValidSeason;
  });
};

// Apufunktio analytiikkaa varten
export const analyzeTireData = (data, metric) => {
  const values = data
    .map(d => Number(d[metric]))
    .filter(v => !isNaN(v) && v > 0);

  return {
    total: values.length,
    min: Math.min(...values),
    max: Math.max(...values),
    average: values.reduce((a, b) => a + b, 0) / values.length,
    seasonBreakdown: {
      winter: data.filter(d => d.season === SEASONS.WINTER).length,
      summer: data.filter(d => d.season === SEASONS.SUMMER).length
    }
  };
}; 