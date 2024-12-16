import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Header from './Header';
import MainContent from './MainContent';
import MovieDetails from './MovieDetails';
import SearchResults from './SearchResults';
import CategoryPage from './CategoryPage';
import FavoritesPage from './FavoritesPage';
import './App.css';

const App = () => {
  return (
    <div className="app">
      <Header />
      <Routes>
        <Route path="/" element={<MainContent />} />
        <Route path="/movie/:id" element={<MovieDetails />} />
        <Route path="/search" element={<SearchResults />} />
        <Route path="/category" element={<CategoryPage />} />
        <Route path="/category/:id" element={<CategoryPage />} />
        <Route path="/favorite" element={<FavoritesPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
};

export default App;
