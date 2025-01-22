import React, { useState, useEffect } from 'react';
import { collection, query, limit, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase';
import { Box, Card, CardContent, Typography, Grid, Skeleton, Link } from '@mui/material';

function TireProductsList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const q = query(collection(db, 'tire_products'), limit(10));
        const querySnapshot = await getDocs(q);
        const productsList = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setProducts(productsList);
      } catch (err) {
        console.error('Error fetching tire products:', err);
        setError('Failed to load tire products');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (error) {
    return (
      <Box sx={{ p: 2, textAlign: 'center', color: 'error.main' }}>
        {error}
      </Box>
    );
  }

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h5" gutterBottom>
        Featured Tire Products
      </Typography>
      <Grid container spacing={2}>
        {loading
          ? Array.from(new Array(10)).map((_, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card>
                  <CardContent>
                    <Skeleton variant="text" width="60%" />
                    <Skeleton variant="text" width="40%" />
                    <Skeleton variant="text" width="80%" />
                  </CardContent>
                </Card>
              </Grid>
            ))
          : products.map((product) => (
              <Grid item xs={12} sm={6} md={4} key={product.id}>
                <Card sx={{ height: '100%' }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      {product.brand} {product.model}
                    </Typography>
                    <Box sx={{ mb: 1 }}>
                      <Typography color="text.secondary" component="div">
                        Size: {product.width}/{product.profile}R{product.rim_size}
                      </Typography>
                      <Typography color="text.secondary" component="div">
                        Season: {product.season}
                      </Typography>
                      <Typography color="text.secondary" component="div">
                        Fuel Efficiency: {product.fuel_efficiency}
                      </Typography>
                      <Typography color="text.secondary" component="div">
                        Noise Level: {product.noise_level}
                      </Typography>
                    </Box>
                    <Typography variant="h6" color="primary" gutterBottom>
                      €{product.price?.toFixed(2)}
                    </Typography>
                    {product.url && (
                      <Link 
                        href={product.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        sx={{ 
                          display: 'block',
                          mt: 1,
                          fontSize: '0.875rem'
                        }}
                      >
                        View at {product.vendor}
                      </Link>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            ))}
      </Grid>
    </Box>
  );
}

export default TireProductsList; 