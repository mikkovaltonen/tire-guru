import React from 'react';
import { 
  Container,
  Box,
  Typography,
  Grid,
  Paper,
  IconButton,
  Fade,
  Tooltip
} from '@mui/material';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';
import RengasGuruLogo from '../components/RengasGuruLogo';
import TireFilters from '../components/TireFilters';
import TireProductsList from '../components/TireProductsList';
import UserPreferences from '../components/UserPreferences';
import ErrorBoundary from '../components/ErrorBoundary';
import { useNavigate } from 'react-router-dom';
import BarChartIcon from '@mui/icons-material/BarChart';

// Add background image URLs
const CHATBOT_BG = 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80';

function Login() {
  const [filters, setFilters] = React.useState({
    width: '',
    profile: '',
    diameter: '',
    season: 'So'  // Default to summer tires
  });
  const [isFullScreen, setIsFullScreen] = React.useState(false);
  const [preferences, setPreferences] = React.useState({
    priceImportance: 33,
    wetGripImportance: 33,
    fuelEfficiencyImportance: 33,
    satisfactionImportance: 33,
    noiseImportance: 33
  });
  const navigate = useNavigate();

  // Determine if we should show the compact layout
  const showCompactLayout = Boolean(filters.season && filters.diameter);

  const handleFilterChange = (newFilters) => {
    console.log('Filters changing from:', filters);
    console.log('Filters changing to:', newFilters);
    setFilters(newFilters);
  };

  const handleFullScreenToggle = () => {
    setIsFullScreen(!isFullScreen);
  };

  const handlePreferenceChange = (newPreferences) => {
    console.log('Preferences changing from:', preferences);
    console.log('Preferences changing to:', newPreferences);
    setPreferences(newPreferences);
  };

  // Add this near your fullscreen button
  const AnalyticsButton = (
    <Tooltip title="Rengastilastot">
      <IconButton 
        onClick={() => navigate('/analytics')}
        sx={{ 
          position: 'absolute',
          top: 16,
          right: 70, // Position it next to fullscreen button
          zIndex: 1,
          bgcolor: 'background.paper',
          boxShadow: 1,
          '&:hover': {
            bgcolor: 'grey.100'
          }
        }}
      >
        <BarChartIcon />
      </IconButton>
    </Tooltip>
  );

  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: `linear-gradient(to right, rgba(255,255,255,0.9), rgba(255,255,255,0.9)), url(${CHATBOT_BG})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    }}>
      <Container maxWidth={isFullScreen ? false : "lg"} sx={{ 
        pt: isFullScreen ? 0 : 4, 
        pb: isFullScreen ? 0 : 6,
        px: isFullScreen ? 0 : undefined // Remove padding in fullscreen
      }}>
        <Grid container spacing={isFullScreen ? 0 : 4}>
          {/* Left Sidebar - Hidden in fullscreen mode */}
          <Fade in={!isFullScreen}>
            <Grid item xs={12} md={showCompactLayout ? 3 : 4} 
              sx={{ display: isFullScreen ? 'none' : 'block' }}
            >
              <Box sx={{ 
                mb: 4,
                transition: 'all 0.3s ease-in-out' // Smooth transition
              }}>
                <RengasGuruLogo size={showCompactLayout ? "small" : "large"} />
                {!showCompactLayout && (
                  <Typography variant="body1" color="text.secondary" sx={{ mt: 3, mb: 3 }}>
                    Säästä jopa 300€ vuodessa löytämällä parhaat renkaat parhaaseen hintaan.
                  </Typography>
                )}
              </Box>

              <Grid container spacing={2}>
                {['💰 Säästä rahaa', '🛡️ Paranna turvallisuutta', '⚡ Säästä aikaa', '🌿 Ympäristöystävällisyys'].map((title, index) => (
                  <Grid item xs={12} key={index}>
                    <Paper sx={{ 
                      p: showCompactLayout ? 1 : 2,
                      bgcolor: 'grey.50',
                      transition: 'all 0.3s ease-in-out',
                      '&:hover': {
                        transform: 'translateY(-4px)'
                      }
                    }}>
                      <Typography variant={showCompactLayout ? "body2" : "h6"} gutterBottom>
                        {title}
                      </Typography>
                      {!showCompactLayout && (
                        <Typography variant="body2" color="text.secondary">
                          {getPromoText(index)}
                        </Typography>
                      )}
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </Grid>
          </Fade>

          {/* Main Content */}
          <Grid item xs={12} md={isFullScreen ? 12 : (showCompactLayout ? 9 : 8)}>
            <Paper 
              elevation={isFullScreen ? 0 : 2}
              sx={{ 
                height: isFullScreen ? '100vh' : '100%',
                p: 3,
                borderRadius: isFullScreen ? 0 : 2,
                transition: 'all 0.3s ease-in-out',
                position: 'relative' // For positioning the fullscreen button
              }}
            >
              {/* Add the analytics button next to fullscreen button */}
              {AnalyticsButton}
              {/* Fullscreen toggle button */}
              <IconButton 
                onClick={handleFullScreenToggle}
                sx={{ 
                  position: 'absolute',
                  top: 16,
                  right: 16,
                  zIndex: 1,
                  bgcolor: 'background.paper',
                  boxShadow: 1,
                  '&:hover': {
                    bgcolor: 'grey.100'
                  }
                }}
              >
                {isFullScreen ? <FullscreenExitIcon /> : <FullscreenIcon />}
              </IconButton>

              <Box sx={{ 
                height: '100%',
                overflow: 'auto',
                pt: isFullScreen ? 2 : 0
              }}>
                <ErrorBoundary>
                  <TireFilters 
                    filters={filters} 
                    onFilterChange={handleFilterChange} 
                  />
                </ErrorBoundary>
                <UserPreferences 
                  preferences={preferences} 
                  onPreferenceChange={handlePreferenceChange}
                />
                <TireProductsList 
                  filters={filters} 
                  preferences={preferences}
                />
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>

      {/* Footer - Hidden in fullscreen mode */}
      <Fade in={!isFullScreen}>
        <Box sx={{ 
          bgcolor: 'rgba(255, 255, 255, 0.9)', 
          py: 3, 
          mt: 'auto',
          display: isFullScreen ? 'none' : 'block'
        }}>
          <Container maxWidth="lg">
            <Typography variant="body2" color="text.secondary" align="center">
              Powered by Rengas Guru - Älykkäämpi tapa ostaa renkaat
            </Typography>
          </Container>
        </Box>
      </Fade>
    </Box>
  );
}

// Helper function for promo text
function getPromoText(index) {
  const texts = [
    'Vertailemme hinnat kaikilta suurilta rengasliikkeiltä',
    'Vertailemme jarrutusmatkat ja kulutuskestävyyden',
    'Tekoäly analysoi puolestasi parhaat vaihtoehdot',
    'Huomioimme polttoainetaloudellisuuden ja kestävyyden'
  ];
  return texts[index];
}

export default Login; 