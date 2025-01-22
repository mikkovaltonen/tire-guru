export const validateTireProduct = (product) => {
  const required = ['season', 'brand', 'width', 'rim_size', 'price'];
  const issues = [];

  required.forEach(field => {
    if (!product[field]) {
      issues.push(`Missing ${field}`);
    }
  });

  // Validate season values
  if (product.season && !['So', 'Ta'].includes(product.season)) {
    issues.push(`Invalid season value: ${product.season}`);
  }

  // Validate numeric fields
  ['width', 'rim_size', 'price'].forEach(field => {
    if (product[field] && isNaN(Number(product[field]))) {
      issues.push(`Invalid ${field} value: ${product[field]}`);
    }
  });

  return issues;
}; 