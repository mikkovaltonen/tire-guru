import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { sendChatMessage } from '../services/openai';
import { 
  Box, 
  Container, 
  Typography, 
  Paper, 
  TextField,
  Button,
  CircularProgress,
  Avatar
} from '@mui/material';
import Logo from '../components/Logo';

function ChatPage() {
  const { publishId } = useParams();
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Load chatbot config
  useEffect(() => {
    const loadConfig = async () => {
      try {
        const docRef = doc(db, 'published', publishId);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          const data = docSnap.data();
          setConfig(data);
          // Add initial bot message
          setMessages([{
            role: 'assistant',
            content: `Hello! I'm your ${data.name}. How can I help you today?`
          }]);
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

  const handleSend = async () => {
    if (!input.trim()) return;

    setSending(true);
    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');

    try {
      const response = await sendChatMessage([...messages, userMessage], config);
      
      const botMessage = { 
        role: 'assistant', 
        content: response
      };
      setMessages(prev => [...prev, botMessage]);

    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: "I'm sorry, I encountered an error. Please try again."
      }]);
    } finally {
      setSending(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!config) return <div>Chatbot not found</div>;

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f8f9fa' }}>
      {/* Header */}
      <Paper 
        elevation={1} 
        sx={{ 
          p: 2, 
          mb: 2, 
          borderRadius: 0,
          display: 'flex',
          alignItems: 'center',
          gap: 2
        }}
      >
        <Logo size="small" />
        <Typography variant="h6">{config.name}</Typography>
      </Paper>

      {/* Chat Container */}
      <Container maxWidth="md" sx={{ pb: 10 }}>
        <Paper 
          sx={{ 
            p: 2,
            minHeight: 'calc(100vh - 180px)',
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          {/* Messages */}
          <Box sx={{ flexGrow: 1, mb: 2, overflowY: 'auto' }}>
            {messages.map((message, index) => (
              <Box
                key={index}
                sx={{
                  display: 'flex',
                  gap: 2,
                  mb: 2,
                  bgcolor: message.role === 'assistant' ? '#f8f9fa' : 'transparent',
                  p: 2,
                  borderRadius: 1
                }}
              >
                <Avatar 
                  sx={{ 
                    bgcolor: message.role === 'assistant' ? 'primary.main' : 'secondary.main',
                    width: 32,
                    height: 32
                  }}
                >
                  {message.role === 'assistant' ? '🤖' : '👤'}
                </Avatar>
                <Typography 
                  variant="body1" 
                  sx={{ 
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word'
                  }}
                >
                  {message.content}
                </Typography>
              </Box>
            ))}
            <div ref={messagesEndRef} />
          </Box>

          {/* Input */}
          <Box sx={{ display: 'flex', gap: 1 }}>
            <TextField
              fullWidth
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
              placeholder="Type your message..."
              multiline
              maxRows={4}
              disabled={sending}
              sx={{ 
                '& .MuiOutlinedInput-root': {
                  bgcolor: 'white'
                }
              }}
            />
            <Button
              variant="contained"
              onClick={handleSend}
              disabled={sending || !input.trim()}
              sx={{ minWidth: 100 }}
            >
              {sending ? <CircularProgress size={24} /> : 'Send'}
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}

export default ChatPage; 