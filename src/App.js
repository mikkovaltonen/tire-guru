import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import './App.css';
import DataAnalytics from './components/DataAnalytics';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/analytics" element={<DataAnalytics />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App; 