import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import './index.css';
import AOS from 'aos';
import 'aos/dist/aos.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import MoviesProvider from './contexts/MoviesContext';
import { FavoritesProvider } from './contexts/FavoritesContext';

// Initialize AOS
AOS.init({
  duration: 800,
  once: false,
  mirror: true
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Router>
      <MoviesProvider>
        <FavoritesProvider>
          <App />
        </FavoritesProvider>
      </MoviesProvider>
    </Router>
  </React.StrictMode>
);

reportWebVitals();
