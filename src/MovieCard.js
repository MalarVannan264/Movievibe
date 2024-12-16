import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useFavorites } from './contexts/FavoritesContext';
import './MovieCard.css';

const MovieCard = ({ movie, isLoading }) => {
    const navigate = useNavigate();
    const { addToFavorites, removeFromFavorites, isFavorite } = useFavorites();

    if (isLoading) {
        return (
            <div className="movie-card loading">
                <div className="movie-card-overlay">
                    <div className="movie-card-title"></div>
                    <div className="movie-card-info">
                        <span className="movie-card-rating"></span>
                    </div>
                </div>
            </div>
        );
    }

    const handleFavoriteClick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        if (!movie || !movie.id) {
            console.error('Invalid movie data:', movie);
            return;
        }

        const isCurrentlyFavorite = isFavorite(movie.id);
        console.log('Favorite button clicked for movie:', movie.title);
        console.log('Current favorite status:', isCurrentlyFavorite);
        
        try {
            if (isCurrentlyFavorite) {
                removeFromFavorites(movie.id);
            } else {
                const movieToAdd = {
                    id: movie.id,
                    title: movie.title,
                    poster: movie.poster,
                    rating: movie.rating,
                    overview: movie.overview
                };
                addToFavorites(movie.id, movieToAdd);
            }
        } catch (error) {
            console.error('Error handling favorite action:', error);
        }
    };

    const handleCardClick = (e) => {
        // Don't navigate if clicking the favorite button
        if (!e.target.closest('.favorite-button')) {
            navigate(`/movie/${movie.id}`);
        }
    };

    const isFavorited = isFavorite(movie.id);

    return (
        <div 
            className="movie-card" 
            onClick={handleCardClick}
            data-aos="fade-up"
            data-aos-duration="800"
            data-aos-offset="200"
        >
            <div className="movie-card-content">
                <img 
                    src={movie.poster || 'https://via.placeholder.com/300x450?text=No+Poster'}
                    alt={movie.title}
                    loading="lazy"
                    onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://via.placeholder.com/300x450?text=No+Poster';
                    }}
                />
                <div className="movie-card-overlay">
                    <h3 className="movie-card-title">{movie.title}</h3>
                    <div className="movie-card-info">
                        <span className="movie-card-rating">⭐ {movie.rating}</span>
                    </div>
                    <button 
                        className={`favorite-button ${isFavorited ? 'active' : ''}`}
                        onClick={handleFavoriteClick}
                        aria-label={isFavorited ? "Remove from favorites" : "Add to favorites"}
                    >
                        <span className="favorite-icon">❤</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MovieCard;
