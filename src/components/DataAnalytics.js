import React, { useState, useEffect } from 'react';
import { Box, Paper, Typography, ToggleButton, ToggleButtonGroup, CircularProgress, IconButton, Alert, LinearProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { fetchTireProducts, SEASONS } from '../services/tireDataService';

function DataAnalytics() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [metric, setMetric] = useState('price');
  const [season, setSeason] = useState('So');
  const navigate = useNavigate();

  const createBarChart = React.useCallback((filteredData) => {
    // Group data by metric
    const groups = {};
    filteredData.forEach(item => {
      const value = Number(item[metric]);
      if (!isNaN(value)) {
        const roundedValue = Math.round(value);
        groups[roundedValue] = (groups[roundedValue] || 0) + 1;
      }
    });

    // Convert to array and sort
    const values = Object.entries(groups)
      .sort((a, b) => Number(a[0]) - Number(b[0]));

    // Find max count for percentage calculation
    const maxCount = Math.max(...values.map(v => v[1]));

    return (
      <Box sx={{ mt: 2 }}>
        {values.map(([value, count]) => (
          <Box key={value} sx={{ mb: 1 }}>
            <Typography variant="caption">
              {metric === 'price' ? `${value}€` : value}
            </Typography>
            <LinearProgress 
              variant="determinate" 
              value={(count / maxCount) * 100}
              sx={{ height: 20, borderRadius: 1 }}
            />
            <Typography variant="caption" sx={{ ml: 1 }}>
              {count} kpl
            </Typography>
          </Box>
        ))}
      </Box>
    );
  }, [metric]);

  // Fetch data
  useEffect(() => {
    const loadData = async () => {
      try {
        const tireData = await fetchTireProducts({ season });
        setData(tireData);
      } catch (error) {
        setError('Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [season]);

  // Create visualization
  useEffect(() => {
    if (!loading && data.length > 0) {
      try {
        createBarChart(data);
      } catch (error) {
        console.error('Error creating visualization:', error);
        setError('Failed to create visualization');
      }
    }
  }, [data, metric, loading, createBarChart]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <IconButton 
        onClick={() => navigate('/')}
        sx={{ mb: 2 }}
      >
        <ArrowBackIcon /> 
      </IconButton>
      
      <Typography variant="h4" gutterBottom>
        Rengastietojen analyysi
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Paper sx={{ p: 2, mb: 2 }}>
        <Box sx={{ mb: 2 }}>
          <Typography variant="h6" gutterBottom>
            Valitse mittari:
          </Typography>
          <ToggleButtonGroup
            value={metric}
            exclusive
            onChange={(e, value) => value && setMetric(value)}
            sx={{ mb: 2 }}
          >
            <ToggleButton value="price">Hinta</ToggleButton>
            <ToggleButton value="noise_level">Melutaso</ToggleButton>
            <ToggleButton value="width">Leveys</ToggleButton>
            <ToggleButton value="profile">Profiili</ToggleButton>
            <ToggleButton value="rim_size">Vannekoko</ToggleButton>
          </ToggleButtonGroup>

          <Typography variant="h6" gutterBottom>
            Valitse kausi:
          </Typography>
          <ToggleButtonGroup
            value={season}
            exclusive
            onChange={(e, value) => value && setSeason(value)}
          >
            <ToggleButton value={SEASONS.SUMMER}>Kesä</ToggleButton>
            <ToggleButton value={SEASONS.WINTER}>Talvi</ToggleButton>
          </ToggleButtonGroup>
        </Box>

        {createBarChart(data)}

        <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
          Yhteensä {data.length} rengasta analysoitu
        </Typography>
      </Paper>
    </Box>
  );
}

export default DataAnalytics; 