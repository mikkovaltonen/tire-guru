import React from 'react';
import ReactDOM from 'react-dom/client';
import './config/firebase'; // Import firebase initialization
import './index.css';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
); 