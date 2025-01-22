// Utility function to normalize scores between 0 and 1
export const normalizeScore = (value, allValues, isHigherBetter = true) => {
  if (!value || !allValues.length) return 0;
  
  const min = Math.min(...allValues);
  const max = Math.max(...allValues);
  
  if (max === min) return 1;
  
  // For attributes where higher is better (e.g., ratings)
  if (isHigherBetter) {
    return (value - min) / (max - min);
  }
  
  // For attributes where lower is better (e.g., price, noise)
  return 1 - ((value - min) / (max - min));
};

// Convert letter grades to numbers (A=5, B=4, etc.)
const letterToNumber = (letter) => {
  if (!letter) return 0;
  const grades = { 'A': 5, 'B': 4, 'C': 3, 'D': 2, 'E': 1, 'F': 0 };
  return grades[letter.toUpperCase()] || 0;
};

// Get normalized scores for all criteria
export const getNormalizedScores = (product, allProducts) => {
  // Get arrays of all values for each criterion
  const allPrices = allProducts.map(p => p.price).filter(Boolean);
  const allNoises = allProducts.map(p => parseFloat(p.noise_level)).filter(Boolean);
  const allWetGrips = allProducts.map(p => letterToNumber(p.wet_grip)).filter(Boolean);
  const allFuelEfficiencies = allProducts.map(p => letterToNumber(p.fuel_efficiency)).filter(Boolean);
  const allDexRatings = allProducts.map(p => parseInt(p.dex_rating, 10)).filter(Boolean);

  // Log raw values for debugging
  console.log('Raw values for product:', {
    id: product.id,
    price: product.price,
    noise: parseFloat(product.noise_level),
    wetGrip: letterToNumber(product.wet_grip),
    fuelEff: letterToNumber(product.fuel_efficiency),
    dex: parseInt(product.dex_rating, 10)
  });

  const scores = {
    price: normalizeScore(product.price, allPrices, false), // Lower is better
    noise: normalizeScore(parseFloat(product.noise_level), allNoises, false), // Lower is better
    wetGrip: normalizeScore(letterToNumber(product.wet_grip), allWetGrips, true), // Higher is better
    fuelEfficiency: normalizeScore(letterToNumber(product.fuel_efficiency), allFuelEfficiencies, true), // Higher is better
    satisfaction: normalizeScore(parseInt(product.dex_rating, 10), allDexRatings, true) // Higher is better
  };

  // Log normalized scores for debugging
  console.log('Normalized scores:', scores);

  return scores;
};

// Calculate weighted score based on preferences
export const calculateWeightedScore = (normalizedScores, preferences) => {
  if (!preferences) return 0;

  const weights = {
    price: (preferences.priceImportance || 0) / 100,
    wetGrip: (preferences.wetGripImportance || 0) / 100,
    fuelEfficiency: (preferences.fuelEfficiencyImportance || 0) / 100,
    satisfaction: (preferences.satisfactionImportance || 0) / 100,
    noise: (preferences.noiseImportance || 0) / 100
  };

  // Log weights for debugging
  console.log('Weights:', weights);

  const weightedScore = (
    (normalizedScores.price * weights.price) +
    (normalizedScores.wetGrip * weights.wetGrip) +
    (normalizedScores.fuelEfficiency * weights.fuelEfficiency) +
    (normalizedScores.satisfaction * weights.satisfaction) +
    (normalizedScores.noise * weights.noise)
  );

  // Log final score for debugging
  console.log('Final weighted score:', weightedScore);

  return weightedScore;
}; 