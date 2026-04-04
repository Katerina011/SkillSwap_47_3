import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom'; 
import { App } from './App';
import './styles/variables.css';
import './styles/fonts.css';
import './styles/layout.css';

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>          
      <App />
    </BrowserRouter>
  </React.StrictMode>
);