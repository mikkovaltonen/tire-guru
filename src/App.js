import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import ConfigWorkbench from './pages/ConfigWorkbench';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import './App.css';
import ChatPage from './pages/ChatPage';

function App() {
  const [user, setUser] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Routes>
      <Route 
        path="/" 
        element={user ? <Navigate to="/config" /> : <Login />} 
      />
      <Route 
        path="/config" 
        element={user ? <ConfigWorkbench /> : <Navigate to="/" />} 
      />
      <Route 
        path="/config/:botId" 
        element={user ? <ConfigWorkbench /> : <Navigate to="/" />} 
      />
      <Route 
        path="/chat/:publishId" 
        element={<ChatPage />} 
      />
      <Route 
        path="/published/:publishId" 
        element={<ChatPage />} 
      />
    </Routes>
  );
}

export default App; 