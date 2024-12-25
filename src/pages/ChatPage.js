import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { Box, Container, Typography, Paper } from '@mui/material';

function ChatPage() {
  const { publishId } = useParams();
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadConfig = async () => {
      try {
        const docRef = doc(db, 'published', publishId);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          setConfig(docSnap.data());
        } else {
          setError('Chatbot not found');
        }
      } catch (err) {
        setError('Error loading chatbot: ' + err.message);
      } finally {
        setLoading(false);
      }
    };

    loadConfig();
  }, [publishId]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!config) return <div>Chatbot not found</div>;

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          {config.name}
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          {config.roleDescription}
        </Typography>
        {/* Add chat interface here */}
      </Paper>
    </Container>
  );
}

export default ChatPage; 