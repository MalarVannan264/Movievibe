import React, { createContext, useContext, useState } from 'react';

const CategoryContext = createContext();

export const CategoryProvider = ({ children }) => {
    const [selectedGenre, setSelectedGenre] = useState(null);
    const [genres, setGenres] = useState([]);
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(false);

    const apiKey = '1a0f451c65b4a6405d683188b5ebfe5f';

    const fetchGenres = async () => {
        try {
            const response = await fetch(
                `https://api.themoviedb.org/3/genre/movie/list?api_key=${apiKey}&language=en-US`
            );
            const data = await response.json();
            if (data.genres) {
                setGenres(data.genres);
            }
        } catch (error) {
            console.error('Error fetching genres:', error);
        }
    };

    const fetchMoviesByGenre = async (genreId) => {
        setLoading(true);
        try {
            const response = await fetch(
                `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&with_genres=${genreId}&language=en-US&sort_by=popularity.desc&page=1`
            );
            const data = await response.json();
            if (data.results) {
                setMovies(data.results);
            }
        } catch (error) {
            console.error('Error fetching movies:', error);
        } finally {
            setLoading(false);
        }
    };

    const selectGenre = (genre) => {
        setSelectedGenre(genre);
        if (genre) {
            fetchMoviesByGenre(genre.id);
        }
    };

    return (
        <CategoryContext.Provider
            value={{
                selectedGenre,
                genres,
                movies,
                loading,
                fetchGenres,
                selectGenre,
                setSelectedGenre
            }}
        >
            {children}
        </CategoryContext.Provider>
    );
};

export const useCategory = () => {
    const context = useContext(CategoryContext);
    if (!context) {
        throw new Error('useCategory must be used within a CategoryProvider');
    }
    return context;
};
