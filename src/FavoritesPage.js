import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useFavorites } from './contexts/FavoritesContext';
import MovieCard from './MovieCard';
import './FavoritesPage.css';

const FavoritesPage = () => {
    const navigate = useNavigate();
    const { favorites, loading } = useFavorites();

    if (loading) {
        return <div className="favorites-page loading">Loading your favorites...</div>;
    }

    return (
        <div className="favorites-page">
            <h2>Your Favorite Movies</h2>
            {favorites.length === 0 ? (
                <div className="no-favorites">
                    <p>You haven't added any movies to your favorites yet.</p>
                    <button onClick={() => navigate('/')}>Browse Movies</button>
                </div>
            ) : (
                <div className="favorites-grid">
                    {favorites.map(movie => (
                        <MovieCard 
                            key={movie.id} 
                            movie={movie}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default FavoritesPage;
