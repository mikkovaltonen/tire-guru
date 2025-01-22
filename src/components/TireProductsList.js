import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase';
import { Box, Typography, Alert } from '@mui/material';
import TireDataVisualization from './TireDataVisualization';

function TireProductsList({ filters, preferences }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Only fetch if season, diameter AND width are selected
    if (filters?.season && filters?.diameter && filters?.width) {
      fetchProducts();
    } else {
      setProducts([]);
    }
  }, [filters]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      let q = collection(db, 'tire_products');
      const constraints = [];

      // Required filters
      constraints.push(where('season', '==', filters.season));
      const rimSize = parseInt(filters.diameter, 10);
      constraints.push(where('rim_size', '==', rimSize));
      const widthValue = parseInt(filters.width, 10);
      constraints.push(where('width', '==', widthValue));

      // Optional profile filter
      if (filters?.profile && filters.profile !== '') {
        const profileValue = parseInt(filters.profile, 10);
        if (!isNaN(profileValue)) {
          constraints.push(where('profile', '==', profileValue));
        }
      }

      q = query(q, ...constraints);
      const querySnapshot = await getDocs(q);
      
      const productsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      setProducts(productsData);
    } catch (error) {
      console.error('Error details:', error);
      setError('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

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