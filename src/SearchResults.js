import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import './SearchResults.css';

const SearchResults = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);
    const query = searchParams.get('query');
    const apiKey = '1a0f451c65b4a6405d683188b5ebfe5f';

    useEffect(() => {
        const fetchSearchResults = async () => {
            if (!query) {
                console.log('No query provided');
                return;
            }
            
            console.log('Fetching results for query:', query);
            try {
                const url = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&language=en-US&query=${encodeURIComponent(query)}&page=1`;
                console.log('Fetching from URL:', url);
                
                const response = await fetch(url);
                const data = await response.json();
                console.log('Search results:', data);
                
                setMovies(data.results || []);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching search results:', error);
                setLoading(false);
                setMovies([]);
            }
        };

        fetchSearchResults();
    }, [query, apiKey]);

    if (loading) {
        return <div className="loading">Loading...</div>;
    }

    return (
        <div className="search-results">
            <h2>Search Results for "{query}"</h2>
            <div className="movies-grid">
                {movies.length === 0 ? (
                    <div className="no-results">No movies found for your search.</div>
                ) : (
                    movies.map(movie => (
                        <div 
                            key={movie.id} 
                            className="movie-card"
                            onClick={() => navigate(`/movie/${movie.id}`)}
                        >
                            <img 
                                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                                alt={movie.title}
                                onError={(e) => {
                                    e.target.src = 'https://via.placeholder.com/500x750?text=No+Image';
                                }}
                            />
                            <div className="movie-info">
                                <h3>{movie.title}</h3>
                                <p>{new Date(movie.release_date).getFullYear()}</p>
                                <div className="rating">
                                    <span>{Math.round(movie.vote_average * 10)}%</span>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default SearchResults;
