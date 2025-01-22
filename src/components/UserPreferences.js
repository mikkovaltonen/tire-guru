import React from 'react';
import { 
  Box, 
  Typography, 
  Slider, 
  Paper,
  Tooltip,
  Grid
} from '@mui/material';
import EuroIcon from '@mui/icons-material/Euro';
import WaterDropIcon from '@mui/icons-material/WaterDrop';
import LocalGasStationIcon from '@mui/icons-material/LocalGasStation';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import VolumeDownIcon from '@mui/icons-material/VolumeDown';

const importanceMarks = [
  { value: 0, label: 'Not important' },
  { value: 33, label: 'Somewhat' },
  { value: 66, label: 'Important' },
  { value: 100, label: 'Very important' }
];

const PreferenceSlider = ({ value, onChange, icon, label, tooltip }) => (
  <Box sx={{ mb: 3 }}>
    <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
      {icon}
      <Box sx={{ ml: 1 }}>{label}</Box>
    </Typography>
    
    <Box sx={{ px: 3, py: 1 }}>
      <Tooltip 
        title={`Current value: ${value}%`}
        placement="top"
        arrow
      >
        <Slider
          value={value}
          onChange={onChange}
          step={null}
          marks={importanceMarks}
          min={0}
          max={100}
          sx={{
            '& .MuiSlider-markLabel': {
              fontSize: '0.75rem'
            }
          }}
        />
      </Tooltip>
    </Box>
  </Box>
);

function UserPreferences({ preferences, onPreferenceChange }) {
  // Normalize values to sum to 100
  const normalizePreferences = (newPreferences) => {
    const values = Object.values(newPreferences);
    const sum = values.reduce((a, b) => a + b, 0);
    
    if (sum === 0) return newPreferences;

    // Calculate normalization factor
    const factor = 100 / sum;
    
    // Create new object with normalized values
    return Object.keys(newPreferences).reduce((acc, key) => {
      acc[key] = Math.round(newPreferences[key] * factor);
      return acc;
    }, {});
  };

  const handlePreferenceChange = (key) => (event, newValue) => {
    const updatedPreferences = {
      ...preferences,
      [key]: newValue
    };
    
    // Normalize all values when any slider changes
    const normalizedPreferences = normalizePreferences(updatedPreferences);
    onPreferenceChange(normalizedPreferences);
  };

  // Calculate current total for display
  const totalImportance = Object.values(preferences).reduce((a, b) => a + b, 0);

  return (
    <Paper sx={{ p: 3, mb: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h5">
          Your Preferences
        </Typography>
        <Tooltip title="Total importance should sum to 100%" arrow>
          <Typography 
            variant="subtitle1" 
            color={totalImportance === 100 ? 'success.main' : 'warning.main'}
          >
            Total: {totalImportance}%
          </Typography>
        </Tooltip>
      </Box>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <PreferenceSlider
            value={preferences.priceImportance}
            onChange={handlePreferenceChange('priceImportance')}
            icon={<EuroIcon sx={{ mr: 1 }} />}
            label="Price"
            tooltip={`Price importance: ${preferences.priceImportance}% of total`}
          />
          
          <PreferenceSlider
            value={preferences.wetGripImportance}
            onChange={handlePreferenceChange('wetGripImportance')}
            icon={<WaterDropIcon sx={{ mr: 1 }} />}
            label="Wet Grip"
            tooltip={`Wet grip importance: ${preferences.wetGripImportance}% of total`}
          />
          
          <PreferenceSlider
            value={preferences.fuelEfficiencyImportance}
            onChange={handlePreferenceChange('fuelEfficiencyImportance')}
            icon={<LocalGasStationIcon sx={{ mr: 1 }} />}
            label="Fuel Economy"
            tooltip={`Fuel efficiency importance: ${preferences.fuelEfficiencyImportance}% of total`}
          />
        </Grid>
        
        <Grid item xs={12} md={6}>
          <PreferenceSlider
            value={preferences.satisfactionImportance}
            onChange={handlePreferenceChange('satisfactionImportance')}
            icon={<ThumbUpIcon sx={{ mr: 1 }} />}
            label="Customer Satisfaction"
            tooltip={`Customer satisfaction importance: ${preferences.satisfactionImportance}% of total`}
          />
          
          <PreferenceSlider
            value={preferences.noiseImportance}
            onChange={handlePreferenceChange('noiseImportance')}
            icon={<VolumeDownIcon sx={{ mr: 1 }} />}
            label="Low Noise"
            tooltip={`Noise level importance: ${preferences.noiseImportance}% of total`}
          />
        </Grid>
      </Grid>
    </Paper>
  );
}

export default UserPreferences; 