import React, { createContext, useState, useEffect, useCallback } from 'react';

export const MoviesContext = createContext();

const MoviesProvider = ({ children }) => {
    const [movies, setMovies] = useState({
        nowPlaying: [],
        topRated: [],
        kids: [],
        documentary: [],
        series: []
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    const baseUrl = 'https://api.themoviedb.org/3';
    const apiKey = '1a0f451c65b4a6405d683188b5ebfe5f';

    const fetchMovies = useCallback(async (endpoint, additionalParams = '') => {
        try {
            const baseParams = `api_key=${apiKey}&language=en-US`;
            const url = `${baseUrl}${endpoint}?${baseParams}${additionalParams ? '&' + additionalParams : ''}`;
            
            console.log('Fetching URL:', url); // Debug log
            
            const response = await fetch(url);
            const data = await response.json();
            
            if (!response.ok) {
                console.error('API Error Response:', {
                    status: response.status,
                    statusText: response.statusText,
                    url: url,
                    error: data
                });
                throw new Error(data.status_message || `Failed to fetch data: ${response.status} ${response.statusText}`);
            }
            
            // Only return raw data for single movie details
            if (endpoint.startsWith('/movie/') && !endpoint.includes('now_playing') && !endpoint.includes('top_rated')) {
                return data;
            }
            
            return data.results || [];
        } catch (error) {
            console.error(`Error fetching movies from ${endpoint}:`, error);
            return []; // Return empty array instead of throwing
        }
    }, [baseUrl, apiKey]);

    useEffect(() => {
        const loadMovies = async () => {
            setLoading(true);
            setError(null);
            try {
                // Fetch all categories in parallel
                const [nowPlayingMovies, topRatedMovies, kidsMovies, documentaries, tvSeries] = await Promise.all([
                    fetchMovies('/movie/now_playing'),
                    fetchMovies('/movie/top_rated'),
                    fetchMovies('/discover/movie', 'with_genres=16,10751&certification.lte=PG&sort_by=popularity.desc&include_adult=false'),
                    fetchMovies('/discover/movie', 'with_genres=99&sort_by=popularity.desc'),
                    fetchMovies('/tv/top_rated', 'without_genres=10767')
                ]);
    
                console.log('Top Rated Movies Response:', topRatedMovies); // Debug log
    
                // Only set error if all requests failed
                if (!nowPlayingMovies.length && !topRatedMovies.length && !kidsMovies.length && 
                    !documentaries.length && !tvSeries.length) {
                    setError('Failed to fetch movies. Please try again later.');
                } else {
                    setMovies({
                        nowPlaying: nowPlayingMovies,
                        topRated: topRatedMovies,
                        kids: kidsMovies,
                        documentary: documentaries,
                        series: tvSeries
                    });
                    setError(null);
                }
            } catch (error) {
                console.error('Error loading movies:', error);
                setError('Failed to fetch movies. Please try again later.');
            } finally {
                setLoading(false);
            }
        };
    
        loadMovies();
    }, [fetchMovies]);

    const value = {
        movies,
        loading,
        error,
        fetchMovies,
        baseUrl,
        apiKey
    };

    return (
        <MoviesContext.Provider value={value}>
            {children}
        </MoviesContext.Provider>
    );
};

export default MoviesProvider;
