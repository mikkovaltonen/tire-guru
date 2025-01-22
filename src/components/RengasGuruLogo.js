import React from 'react';
import { Box, Typography } from '@mui/material';

function RengasGuruLogo({ size = 'medium' }) {
  const sizes = {
    small: { icon: 32, text: '1.5rem' },
    medium: { icon: 48, text: '2rem' },
    large: { icon: 64, text: '2.5rem' }
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
      <Box 
        sx={{ 
          width: sizes[size].icon,
          height: sizes[size].icon,
          borderRadius: '50%',
          background: 'linear-gradient(45deg, #2196F3, #1976D2)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontSize: sizes[size].icon * 0.5,
          fontWeight: 'bold',
          boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
        }}
      >
        R
      </Box>
      <Typography 
        variant="h4" 
        sx={{ 
          fontSize: sizes[size].text,
          fontWeight: 'bold',
          background: 'linear-gradient(45deg, #2196F3, #1976D2)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          textShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}
      >
        Rengas Guru
      </Typography>
    </Box>
  );
}

export default RengasGuruLogo; 