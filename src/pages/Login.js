import React from 'react';
import { 
  Container,
  Box,
  Typography,
  Grid,
  Paper
} from '@mui/material';
import TireProductsList from '../components/TireProductsList';
import RengasGuruLogo from '../components/RengasGuruLogo';

// Add background image URLs
const CHATBOT_BG = 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80';

function Login() {
  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: `linear-gradient(to right, rgba(255,255,255,0.9), rgba(255,255,255,0.9)), url(${CHATBOT_BG})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    }}>
      {/* Hero Section */}
      <Container maxWidth="lg" sx={{ pt: 4, pb: 6 }}>
        <Grid container spacing={4}>
          {/* Left Sidebar */}
          <Grid item xs={12} md={4}>
            <Box sx={{ mb: 4 }}>
              <RengasGuruLogo size="large" />
              <Typography variant="body1" color="text.secondary" sx={{ mt: 3, mb: 3 }}>
                Säästä jopa 300€ vuodessa löytämällä parhaat renkaat parhaaseen hintaan.
              </Typography>
            </Box>

            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Paper sx={{ 
                  p: 2, 
                  bgcolor: 'grey.50',
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)'
                  }
                }}>
                  <Typography variant="h6" gutterBottom>
                    💰 Säästä rahaa
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Vertailemme hinnat kaikilta suurilta rengasliikkeiltä
                  </Typography>
                </Paper>
              </Grid>

              <Grid item xs={12}>
                <Paper sx={{ 
                  p: 2, 
                  bgcolor: 'grey.50',
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)'
                  }
                }}>
                  <Typography variant="h6" gutterBottom>
                    🛡️ Paranna turvallisuutta
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Vertailemme jarrutusmatkat ja kulutuskestävyyden
                  </Typography>
                </Paper>
              </Grid>

              <Grid item xs={12}>
                <Paper sx={{ 
                  p: 2, 
                  bgcolor: 'grey.50',
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)'
                  }
                }}>
                  <Typography variant="h6" gutterBottom>
                    ⚡ Säästä aikaa
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Tekoäly analysoi puolestasi parhaat vaihtoehdot
                  </Typography>
                </Paper>
              </Grid>

              <Grid item xs={12}>
                <Paper sx={{ 
                  p: 2, 
                  bgcolor: 'grey.50',
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)'
                  }
                }}>
                  <Typography variant="h6" gutterBottom>
                    🌿 Ympäristöystävällisyys
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Huomioimme polttoainetaloudellisuuden ja kestävyyden
                  </Typography>
                </Paper>
              </Grid>
            </Grid>
          </Grid>

          {/* Main Content */}
          <Grid item xs={12} md={8}>
            <Paper 
              elevation={2} 
              sx={{ 
                height: '100%',
                p: 3,
                borderRadius: 2
              }}
            >
              <TireProductsList />
            </Paper>
          </Grid>
        </Grid>
      </Container>

      {/* Footer */}
      <Box sx={{ bgcolor: 'rgba(255, 255, 255, 0.9)', py: 3, mt: 'auto' }}>
        <Container maxWidth="lg">
          <Typography variant="body2" color="text.secondary" align="center">
            Powered by Rengas Guru - Älykkäämpi tapa ostaa renkaat
          </Typography>
        </Container>
      </Box>
    </Box>
  );
}

export default Login; 