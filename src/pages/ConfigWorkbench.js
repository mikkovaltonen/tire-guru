import React, { useState, useEffect, useCallback } from 'react';
import { 
  Box, 
  Paper, 
  Typography, 
  TextField, 
  Button,
  Grid,
  Container,
  AppBar,
  Toolbar,
  Stack,
  Alert,
  styled
} from '@mui/material';
import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  deleteDoc,
  getDocs
} from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { useNavigate, useParams } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { auth, db } from '../config/firebase';

// Custom styled buttons
const ActionButton = styled(Button)(({ theme }) => ({
  textTransform: 'none',
  fontSize: '0.875rem',
  padding: '4px 12px',
  borderRadius: '4px',
  minWidth: 'auto'
}));

function ConfigWorkbench() {
  const { botId } = useParams();
  const [config, setConfig] = useState({
    roleDescription: '',
    instructions: '',
    exampleQuestions: '',
    name: '',
    userEmail: '',
    userId: '',
    createdAt: '',
    changedAt: ''
  });
  const [message, setMessage] = useState('');
  const [assistants, setAssistants] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Load assistants from Firebase configs collection
  const loadAssistants = useCallback(async () => {
    try {
      const configsRef = collection(db, 'configs');
      const snapshot = await getDocs(configsRef);
      const assistantsList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt || new Date().toISOString(),
        changedAt: doc.data().changedAt || new Date().toISOString()
      }));
      
      // Sort by most recently changed
      const sortedAssistants = assistantsList.sort((a, b) => 
        new Date(b.changedAt) - new Date(a.changedAt)
      );
      
      setAssistants(sortedAssistants);
    } catch (error) {
      console.error('Error loading assistants:', error);
      setMessage('Error loading assistants: ' + error.message);
    }
  }, [db]);

  // Load specific config when botId changes
  useEffect(() => {
    const loadConfig = async () => {
      if (botId && botId !== 'new') {
        setIsLoading(true);
        try {
          const docRef = doc(db, 'configs', botId);
          const docSnap = await getDoc(docRef);
          
          if (docSnap.exists()) {
            const data = docSnap.data();
            setConfig({
              ...data,
              roleDescription: data.roleDescription || '',
              instructions: data.instructions || '',
              exampleQuestions: data.exampleQuestions || '',
              name: data.name || botId
            });
          } else {
            setMessage('Assistant not found');
            navigate('/config/new');
          }
        } catch (error) {
          setMessage('Error loading assistant: ' + error.message);
        } finally {
          setIsLoading(false);
        }
      } else {
        // Clear form for new assistant
        setConfig({
          roleDescription: '',
          instructions: '',
          exampleQuestions: '',
          name: '',
          userEmail: auth.currentUser?.email || '',
          userId: auth.currentUser?.uid || '',
          createdAt: new Date().toISOString(),
          changedAt: new Date().toISOString()
        });
      }
    };

    loadConfig();
  }, [botId, db, auth.currentUser, navigate]);

  // Initial load of assistants
  useEffect(() => {
    loadAssistants();
  }, [loadAssistants]);

  const handleSave = async () => {
    if (!config.name) {
      setMessage('Please enter a name for your assistant');
      return;
    }

    setIsLoading(true);
    try {
      const timestamp = new Date().toISOString();
      const configRef = doc(db, 'configs', botId === 'new' ? `config_${Date.now()}` : botId);
      
      await setDoc(configRef, {
        ...config,
        changedAt: timestamp,
        userEmail: auth.currentUser?.email,
        userId: auth.currentUser?.uid
      });

      setMessage('Configuration saved successfully!');
      await loadAssistants();
      
      if (botId === 'new') {
        navigate(`/config/${configRef.id}`);
      }
    } catch (error) {
      setMessage('Error saving configuration: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveAsNew = async () => {
    setIsLoading(true);
    try {
      const newId = `config_${Date.now()}`;
      const configRef = doc(db, 'configs', newId);
      
      await setDoc(configRef, {
        ...config,
        createdAt: new Date().toISOString(),
        changedAt: new Date().toISOString(),
        userEmail: auth.currentUser?.email,
        userId: auth.currentUser?.uid
      });

      setMessage('New assistant created successfully!');
      await loadAssistants();
      navigate(`/config/${newId}`);
    } catch (error) {
      setMessage('Error creating new assistant: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Modified handleDelete with force delete option
  const handleDelete = async () => {
    if (!botId || botId === 'new') {
      setMessage('Cannot delete: No assistant selected');
      return;
    }

    try {
      if (window.confirm('Are you sure you want to delete this assistant?')) {
        setIsLoading(true);
        const docRef = doc(db, 'configs', botId);
        await deleteDoc(docRef);
        setMessage('Assistant deleted successfully');
        await loadAssistants();
        navigate('/config/new');
        
        // Clear the form using setConfig instead of setBotName
        setConfig({
          roleDescription: '',
          instructions: '',
          exampleQuestions: '',
          name: '',
          userEmail: auth.currentUser?.email || '',
          userId: auth.currentUser?.uid || '',
          createdAt: new Date().toISOString(),
          changedAt: new Date().toISOString()
        });
      }
    } catch (error) {
      console.error('Delete error:', error);
      setMessage('Error deleting assistant: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/');
    } catch (error) {
      setMessage('Error signing out: ' + error.message);
    }
  };

  return (
    <Box sx={{ 
      display: 'flex',
      minHeight: '100vh',
      bgcolor: '#f8f9fa'
    }}>
      {/* Sidebar */}
      <Box 
        sx={{ 
          width: { xs: 0, md: 250 },
          display: { xs: 'none', md: 'block' },
          transition: 'width 0.3s ease',
          bgcolor: 'background.paper',
          borderRight: 1,
          borderColor: 'divider',
          boxShadow: '2px 0 5px rgba(0,0,0,0.1)',
          overflow: 'hidden'
        }}
      >
        <Sidebar assistants={assistants} />
      </Box>

      {/* Main Content */}
      <Box sx={{ flexGrow: 1 }}>
        {/* Header */}
        <AppBar 
          position="sticky" 
          elevation={0}
          sx={{ 
            bgcolor: 'white',
            borderBottom: '1px solid #e0e0e0'
          }}
        >
          <Toolbar sx={{ minHeight: '56px' }}>
            <Typography 
              variant="h6" 
              sx={{ 
                flexGrow: 1,
                fontSize: '1.1rem',
                fontWeight: 500
              }}
            >
              {config.name || 'New Assistant'}
            </Typography>
            <Stack direction="row" spacing={1}>
              <ActionButton 
                variant="contained" 
                size="small"
                onClick={handleSave}
                disabled={!config.name || isLoading}
                sx={{ 
                  bgcolor: '#1976d2', 
                  '&:hover': { bgcolor: '#1565c0' }
                }}
              >
                Save
              </ActionButton>
              <ActionButton 
                variant="outlined" 
                size="small"
                onClick={handleSaveAsNew}
                disabled={isLoading}
                sx={{ 
                  color: '#2E7D32', 
                  borderColor: '#2E7D32',
                  '&:hover': { 
                    bgcolor: 'rgba(46, 125, 50, 0.04)',
                    borderColor: '#1B5E20'
                  }
                }}
              >
                Save as new
              </ActionButton>
              <ActionButton 
                variant="contained" 
                size="small"
                onClick={handleSave}
                disabled={!config.name || isLoading}
                sx={{ 
                  bgcolor: '#2E7D32', 
                  '&:hover': { bgcolor: '#1B5E20' }
                }}
              >
                Publish
              </ActionButton>
              <ActionButton 
                variant="outlined" 
                size="small"
                onClick={handleDelete}
                disabled={!botId || botId === 'new' || isLoading}
                sx={{ 
                  color: '#d32f2f', 
                  borderColor: '#d32f2f',
                  '&:hover': { 
                    bgcolor: 'rgba(211, 47, 47, 0.04)',
                    borderColor: '#b71c1c'
                  }
                }}
              >
                {isLoading ? 'Deleting...' : 'Delete'}
              </ActionButton>
              <ActionButton 
                variant="text" 
                size="small"
                onClick={handleLogout}
                disabled={isLoading}
                sx={{ color: '#666' }}
              >
                Logout
              </ActionButton>
            </Stack>
          </Toolbar>
        </AppBar>

        {/* Content */}
        <Container maxWidth="lg" sx={{ py: 3 }}>
          <Grid container spacing={2}>
            {message && (
              <Grid item xs={12}>
                <Alert 
                  severity="success" 
                  sx={{ 
                    mb: 2,
                    '& .MuiAlert-message': { fontSize: '0.875rem' }
                  }}
                >
                  {message}
                </Alert>
              </Grid>
            )}

            <Grid item xs={12}>
              <Paper sx={{ p: 3, mb: 2 }}>
                <Typography 
                  variant="h6" 
                  gutterBottom
                  sx={{ 
                    fontSize: '1rem',
                    fontWeight: 500,
                    color: '#333'
                  }}
                >
                  Assistant Name
                </Typography>
                <TextField
                  fullWidth
                  value={config.name}
                  onChange={(e) => setConfig({
                    ...config,
                    name: e.target.value
                  })}
                  placeholder="Enter a name for your assistant"
                  variant="outlined"
                  size="small"
                  sx={{ 
                    '& .MuiOutlinedInput-root': {
                      fontSize: '0.875rem'
                    }
                  }}
                />
              </Paper>
            </Grid>

            <Grid item xs={12}>
              <Paper sx={{ p: 3, mb: 2 }}>
                <Typography 
                  variant="h6" 
                  gutterBottom
                  sx={{ 
                    fontSize: '1rem',
                    fontWeight: 500,
                    color: '#333'
                  }}
                >
                  Role Description
                </Typography>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  value={config.roleDescription}
                  onChange={(e) => setConfig({
                    ...config,
                    roleDescription: e.target.value
                  })}
                  variant="outlined"
                  size="small"
                  sx={{ 
                    '& .MuiOutlinedInput-root': {
                      fontSize: '0.875rem'
                    }
                  }}
                />
              </Paper>
            </Grid>

            <Grid item xs={12}>
              <Paper sx={{ p: 3, mb: 2 }}>
                <Typography 
                  variant="h6" 
                  gutterBottom
                  sx={{ 
                    fontSize: '1rem',
                    fontWeight: 500,
                    color: '#333'
                  }}
                >
                  Chatbot Instructions and Knowledge
                </Typography>
                <TextField
                  fullWidth
                  multiline
                  rows={6}
                  value={config.instructions}
                  onChange={(e) => setConfig({
                    ...config,
                    instructions: e.target.value
                  })}
                  variant="outlined"
                  size="small"
                  sx={{ 
                    '& .MuiOutlinedInput-root': {
                      fontSize: '0.875rem'
                    }
                  }}
                />
              </Paper>
            </Grid>

            <Grid item xs={12}>
              <Paper sx={{ p: 3 }}>
                <Typography 
                  variant="h6" 
                  gutterBottom
                  sx={{ 
                    fontSize: '1rem',
                    fontWeight: 500,
                    color: '#333'
                  }}
                >
                  Example Questions and Answers for Assimilation
                </Typography>
                <TextField
                  fullWidth
                  multiline
                  rows={6}
                  value={config.exampleQuestions}
                  onChange={(e) => setConfig({
                    ...config,
                    exampleQuestions: e.target.value
                  })}
                  variant="outlined"
                  size="small"
                  sx={{ 
                    '& .MuiOutlinedInput-root': {
                      fontSize: '0.875rem'
                    }
                  }}
                />
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
}

export default ConfigWorkbench; 