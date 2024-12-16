import React, { createContext, useContext, useState, useEffect } from 'react';

const FavoritesContext = createContext();

export const FavoritesProvider = ({ children }) => {
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadFavorites();
    }, []);

const loadFavorites = async () => {
    try {
        const favoriteIds = JSON.parse(localStorage.getItem('favoriteMovies')) || [];
        const favoriteMovies = JSON.parse(localStorage.getItem('favoriteMoviesData')) || {};
        
        if (favoriteIds.length === 0) {
            setFavorites([]);
            setLoading(false);
            return;
        }

        // Filter out any null or undefined entries and ensure the order matches favoriteIds
        const movies = favoriteIds
            .map(id => favoriteMovies[id])
            .filter(movie => movie !== null && movie !== undefined);

        console.log('Loading favorites:', movies);
        setFavorites(movies);
    } catch (error) {
        console.error('Error loading favorites:', error);
        // If there's an error, clear the favorites to prevent issues
        localStorage.setItem('favoriteMovies', '[]');
        localStorage.setItem('favoriteMoviesData', '{}');
        setFavorites([]);
    } finally {
        setLoading(false);
    }
};

    const addToFavorites = async (movieId, movieData) => {
        try {
            console.log('Adding to favorites:', movieId, movieData);
            const favoriteIds = JSON.parse(localStorage.getItem('favoriteMovies')) || [];
            const favoriteMovies = JSON.parse(localStorage.getItem('favoriteMoviesData')) || {};
            
            if (!favoriteIds.includes(movieId)) {
                const updatedFavorites = [...favoriteIds, movieId];
                favoriteMovies[movieId] = movieData;
                
                localStorage.setItem('favoriteMovies', JSON.stringify(updatedFavorites));
                localStorage.setItem('favoriteMoviesData', JSON.stringify(favoriteMovies));
                
                // Update state immediately for better UI responsiveness
                setFavorites(prevFavorites => [...prevFavorites, movieData]);
            }
        } catch (error) {
            console.error('Error adding to favorites:', error);
        }
    };

    const removeFromFavorites = async (movieId) => {
        try {
            console.log('Removing from favorites:', movieId);
            const favoriteIds = JSON.parse(localStorage.getItem('favoriteMovies')) || [];
            const favoriteMovies = JSON.parse(localStorage.getItem('favoriteMoviesData')) || {};
            
            const updatedFavorites = favoriteIds.filter(id => id !== movieId);
            delete favoriteMovies[movieId];
            
            localStorage.setItem('favoriteMovies', JSON.stringify(updatedFavorites));
            localStorage.setItem('favoriteMoviesData', JSON.stringify(favoriteMovies));
            
            // Update state immediately for better UI responsiveness
            setFavorites(prevFavorites => prevFavorites.filter(movie => movie.id !== movieId));
        } catch (error) {
            console.error('Error removing from favorites:', error);
        }
    };

    const isFavorite = (movieId) => {
        try {
            const favoriteIds = JSON.parse(localStorage.getItem('favoriteMovies')) || [];
            const result = favoriteIds.includes(movieId);
            console.log('Checking if favorite:', movieId, result);
            return result;
        } catch (error) {
            console.error('Error checking favorite status:', error);
            return false;
        }
    };

    return (
        <FavoritesContext.Provider
            value={{
                favorites,
                loading,
                addToFavorites,
                removeFromFavorites,
                isFavorite,
                loadFavorites
            }}
        >
            {children}
        </FavoritesContext.Provider>
    );
};

export const useFavorites = () => {
    const context = useContext(FavoritesContext);
    if (!context) {
        throw new Error('useFavorites must be used within a FavoritesProvider');
    }
    return context;
};
