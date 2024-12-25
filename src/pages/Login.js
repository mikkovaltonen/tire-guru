import React, { useState } from 'react';
import { 
  Box, 
  TextField, 
  Button, 
  Typography, 
  Container,
  Link,
  Alert,
  Paper,
  Grid,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import Logo from '../components/Logo';
import { auth } from '../config/firebase';

// Add background image URLs (replace these with your actual image URLs)
const CHATBOT_BG = 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80';
const REAL_ESTATE_BG = 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&q=80';

function Login() {
  const navigate = useNavigate();
  const theme = useTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      if (isSignUp) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      navigate('/config');
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <Container 
      maxWidth="lg" 
      sx={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center',
        background: `linear-gradient(to right, rgba(255,255,255,0.9), rgba(255,255,255,0.9)), url(${CHATBOT_BG})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <Grid container spacing={4} alignItems="center" justifyContent="center">
        {/* Marketing Content */}
        <Grid item xs={12} md={6}>
          <Box sx={{ p: 3 }}>
            <Logo size="large" />
            <Typography variant="h6" sx={{ mb: 3, color: 'text.secondary' }}>
              Create and distribute custom AI assistants like OpenAI's GPT builder, but without the restrictions.
            </Typography>
            <Box sx={{ mb: 4 }}>
              <Typography variant="body1" paragraph>
                ✨ Create unlimited AI assistants
              </Typography>
              <Typography variant="body1" paragraph>
                🚀 Distribute to anyone, anywhere
              </Typography>
              <Typography variant="body1" paragraph>
                🔒 Full control over your assistants
              </Typography>
              <Typography variant="body1" paragraph>
                💡 Customize behavior and responses
              </Typography>
            </Box>

            {/* Customer Testimonial with background image */}
            <Paper 
              sx={{ 
                p: 3, 
                mt: 4, 
                borderRadius: 2,
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
                position: 'relative',
                overflow: 'hidden',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundImage: `url(${REAL_ESTATE_BG})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  opacity: 0.1,
                  zIndex: 0
                }
              }}
            >
              <Box sx={{ position: 'relative', zIndex: 1 }}>
                <Typography 
                  variant="h6" 
                  sx={{ 
                    mb: 2,
                    display: 'flex',
                    alignItems: 'center',
                    color: theme.palette.primary.main
                  }}
                >
                  ⭐⭐⭐⭐⭐
                </Typography>
                <Typography 
                  variant="body1" 
                  paragraph 
                  sx={{ 
                    fontStyle: 'italic',
                    mb: 2,
                    textShadow: '0 1px 2px rgba(255,255,255,0.8)'
                  }}
                >
                  "As an Airbnb host managing multiple properties, this tool has been a game-changer. 
                  I've created dedicated chatbots for each of my listings, handling guest inquiries 24/7. 
                  It saves me hours every week and my guests love getting instant, accurate responses about 
                  check-in procedures, local recommendations, and house rules."
                </Typography>
                <Box 
                  sx={{ 
                    display: 'flex', 
                    alignItems: 'center',
                    backgroundColor: 'rgba(255,255,255,0.9)',
                    p: 1,
                    borderRadius: 1
                  }}
                >
                  <Typography 
                    variant="subtitle1" 
                    sx={{ 
                      fontWeight: 'bold',
                      mr: 1
                    }}
                  >
                    Heidi K.
                  </Typography>
                  <Typography 
                    variant="body2" 
                    sx={{ color: 'text.secondary' }}
                  >
                    Airbnb Superhost, Helsinki
                  </Typography>
                </Box>
              </Box>
            </Paper>
          </Box>
        </Grid>

        {/* Login Form */}
        <Grid item xs={12} md={6}>
          <Paper 
            elevation={3} 
            sx={{ 
              p: 4, 
              borderRadius: 2,
              backgroundColor: 'background.paper',
              maxWidth: 400,
              mx: 'auto',
              backdropFilter: 'blur(10px)',
              background: 'rgba(255, 255, 255, 0.95)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
            }}
          >
            <Typography 
              component="h2" 
              variant="h4" 
              sx={{ 
                mb: 4, 
                textAlign: 'center',
                fontWeight: 500
              }}
            >
              {isSignUp ? 'Get Started' : 'Welcome Back'}
            </Typography>
            <Box component="form" onSubmit={handleSubmit}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                sx={{ mb: 2 }}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                sx={{ mb: 2 }}
              />
              {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {error}
                </Alert>
              )}
              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                sx={{ 
                  mt: 2, 
                  mb: 3,
                  py: 1.5,
                  fontSize: '1.1rem'
                }}
              >
                {isSignUp ? 'Create Account' : 'Sign In'}
              </Button>
              <Box sx={{ textAlign: 'center' }}>
                <Link 
                  href="#" 
                  variant="body2" 
                  onClick={(e) => {
                    e.preventDefault();
                    setIsSignUp(!isSignUp);
                    setError('');
                  }}
                  sx={{ 
                    textDecoration: 'none',
                    '&:hover': {
                      textDecoration: 'underline'
                    }
                  }}
                >
                  {isSignUp 
                    ? "Already have an account? Sign In" 
                    : "Don't have an account? Sign Up"}
                </Link>
              </Box>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}

export default Login; 