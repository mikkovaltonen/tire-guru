import React, { useState, useEffect } from 'react';
import { 
  Box, 
  FormControl, 
  Select, 
  MenuItem, 
  Typography,
  CircularProgress
} from '@mui/material';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase';

// Static values
const RIM_SIZES = ['14', '15', '16', '17', '18', '19', '20', '21'];
const SEASONS = [
  { value: 'So', label: 'Kesä' },
  { value: 'Ta', label: 'Talvi' }
];

// Fixed width options for each rim size
const WIDTH_OPTIONS = {
  '14': ['165', '175', '185', '195', '205'],
  '15': ['185', '195', '205', '215', '225'],
  '16': ['195', '205', '215', '225', '235'],
  '17': ['205', '215', '225', '235', '245', '255'],
  '18': ['225', '235', '245', '255', '265'],
  '19': ['235', '245', '255', '265', '275'],
  '20': ['245', '255', '265', '275', '285'],
  '21': ['255', '265', '275', '285', '295']
};

// Fixed profile options for common widths
const PROFILE_OPTIONS = {
  '165': ['60', '65', '70'],
  '175': ['60', '65', '70'],
  '185': ['55', '60', '65'],
  '195': ['50', '55', '60', '65'],
  '205': ['45', '50', '55', '60'],
  '215': ['45', '50', '55', '60'],
  '225': ['40', '45', '50', '55'],
  '235': ['35', '40', '45', '50'],
  '245': ['35', '40', '45', '50'],
  '255': ['35', '40', '45'],
  '265': ['30', '35', '40'],
  '275': ['30', '35', '40'],
  '285': ['30', '35'],
  '295': ['30', '35']
};

function TireFilters({ filters, onFilterChange }) {
  const { width, profile, diameter, season } = filters;
  const [loading, setLoading] = useState(false);
  const [availableWidths, setAvailableWidths] = useState([]);
  const [availableProfiles, setAvailableProfiles] = useState([]);

  // Fetch available widths when season and diameter are selected
  useEffect(() => {
    const fetchAvailableWidths = async () => {
      if (!season || !diameter) {
        setAvailableWidths([]);
        return;
      }

      setLoading(true);
      try {
        const q = query(
          collection(db, 'tire_products'),
          where('season', '==', season),
          where('rim_size', '==', parseInt(diameter, 10))
        );

        const snapshot = await getDocs(q);
        const widths = [...new Set(snapshot.docs.map(doc => doc.data().width))]
          .filter(Boolean)
          .sort((a, b) => a - b);

        setAvailableWidths(widths);
      } catch (error) {
        console.error('Error fetching widths:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAvailableWidths();
  }, [season, diameter]);

  // Fetch available profiles when width is selected
  useEffect(() => {
    const fetchAvailableProfiles = async () => {
      if (!season || !diameter || !width) {
        setAvailableProfiles([]);
        return;
      }

      setLoading(true);
      try {
        const q = query(
          collection(db, 'tire_products'),
          where('season', '==', season),
          where('rim_size', '==', parseInt(diameter, 10)),
          where('width', '==', parseInt(width, 10))
        );

        const snapshot = await getDocs(q);
        const profiles = [...new Set(snapshot.docs.map(doc => doc.data().profile))]
          .filter(Boolean)
          .sort((a, b) => a - b);

        setAvailableProfiles(profiles);
      } catch (error) {
        console.error('Error fetching profiles:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAvailableProfiles();
  }, [season, diameter, width]);

  const handleSeasonChange = (e) => {
    onFilterChange({
      ...filters,
      season: e.target.value,
      width: '',
      profile: ''
    });
  };

  const handleDiameterChange = (e) => {
    onFilterChange({
      ...filters,
      diameter: e.target.value,
      width: '',
      profile: ''
    });
  };

  const handleWidthChange = (e) => {
    onFilterChange({
      ...filters,
      width: e.target.value,
      profile: ''
    });
  };

  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h5" gutterBottom>
        Rengashaku
      </Typography>

      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center',
        gap: 2,
        mb: 4
      }}>
        {/* Season first */}
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="body1" gutterBottom>
            Kausi
          </Typography>
          <FormControl sx={{ minWidth: 100 }}>
            <Select
              value={season}
              onChange={handleSeasonChange}
              variant="outlined"
              sx={{ bgcolor: 'white' }}
            >
              <MenuItem value="">
                <em>Select</em>
              </MenuItem>
              {SEASONS.map(s => (
                <MenuItem key={s.value} value={s.value}>{s.label}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        {/* Diameter second */}
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="body1" gutterBottom>
            Halkaisija
          </Typography>
          <FormControl sx={{ minWidth: 100 }}>
            <Select
              value={diameter}
              onChange={handleDiameterChange}
              variant="outlined"
              sx={{ bgcolor: 'white' }}
              disabled={!season}
            >
              <MenuItem value="">
                <em>Select</em>
              </MenuItem>
              {RIM_SIZES.map(d => (
                <MenuItem key={d} value={d}>{d}"</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="body1" gutterBottom>
            Leveys
          </Typography>
          <FormControl sx={{ minWidth: 100 }}>
            <Select
              value={width}
              onChange={handleWidthChange}
              variant="outlined"
              sx={{ bgcolor: 'white' }}
              disabled={!diameter || loading}
            >
              <MenuItem value="">
                <em>Select</em>
              </MenuItem>
              {availableWidths.map(w => (
                <MenuItem key={w} value={w}>{w}</MenuItem>
              ))}
            </Select>
            {loading && <CircularProgress size={20} sx={{ ml: 1 }} />}
          </FormControl>
        </Box>

        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="body1" gutterBottom>
            Profiili
          </Typography>
          <FormControl sx={{ minWidth: 100 }}>
            <Select
              value={profile}
              onChange={(e) => onFilterChange({ ...filters, profile: e.target.value })}
              variant="outlined"
              sx={{ bgcolor: 'white' }}
              disabled={!width || loading}
            >
              <MenuItem value="">
                <em>Select</em>
              </MenuItem>
              {availableProfiles.map(p => (
                <MenuItem key={p} value={p}>{p}</MenuItem>
              ))}
            </Select>
            {loading && <CircularProgress size={20} sx={{ ml: 1 }} />}
          </FormControl>
        </Box>
      </Box>
    </Box>
  );
}

export default TireFilters; 