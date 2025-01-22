import React, { useState, useEffect } from 'react';
import { Box, Typography, Alert } from '@mui/material';
import TireDataVisualization from './TireDataVisualization';
import { fetchTireProducts } from '../services/tireDataService';

function TireProductsList({ filters, preferences }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadProducts = async () => {
      if (!filters?.season || !filters?.diameter || !filters?.width || !filters?.profile) {
        return;
      }

      setLoading(true);
      try {
        const data = await fetchTireProducts(filters);
        console.log('Products loaded:', {
          filters,
          count: data.length,
          sample: data.slice(0, 2)
        });
        setProducts(data);
      } catch (error) {
        console.error('Error loading products:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [filters]);

  if (error) {
    return (
      <Box sx={{ p: 2, textAlign: 'center', color: 'error.main' }}>
        {error}
      </Box>
    );
  }

  const getMissingSelections = () => {
    const missing = [];
    if (!filters.season) missing.push('season');
    if (!filters.diameter) missing.push('rim size');
    if (!filters.width) missing.push('width');
    return missing;
  };

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h5" gutterBottom>
        Tire Products Analysis
      </Typography>
      
      {getMissingSelections().length > 0 ? (
        <Alert severity="info" sx={{ mb: 2 }}>
          Please select {getMissingSelections().join(', ')} to view products
        </Alert>
      ) : loading ? (
        <Typography>Loading...</Typography>
      ) : products.length > 0 ? (
        <TireDataVisualization 
          products={products} 
          preferences={preferences}
        />
      ) : (
        <Typography textAlign="center" color="text.secondary">
          No products found with the selected filters
        </Typography>
      )}
    </Box>
  );
}

export default TireProductsList; 