import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import './CategoryPage.css';

const CategoryPage = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const location = useLocation();
    const [genres, setGenres] = useState([]);
    const [selectedGenre, setSelectedGenre] = useState(null);
    const queryParams = new URLSearchParams(location.search);
    const genreFromQuery = queryParams.get('genre');
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);
    const apiKey = '1a0f451c65b4a6405d683188b5ebfe5f';

    useEffect(() => {
        const initializeGenres = async () => {
            await fetchGenres();
            if (id || genreFromQuery) {
                const genreId = id || genreFromQuery;
                const genre = genres.find(g => g.id === parseInt(genreId));
                if (genre) {
                    setSelectedGenre(genre);
                }
            }
        };
        
        initializeGenres();
    }, [id, genreFromQuery, genres]);

    useEffect(() => {
        if (selectedGenre) {
            fetchMoviesByGenre(selectedGenre.id);
        }
    }, [selectedGenre]);

    const fetchGenres = async () => {
        try {
            const response = await fetch(
                `https://api.themoviedb.org/3/genre/movie/list?api_key=${apiKey}&language=en-US`
            );
            const data = await response.json();
            setGenres(data.genres);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching genres:', error);
            setLoading(false);
        }
    };

    const fetchMoviesByGenre = async (genreId) => {
        setLoading(true);
        try {
            const response = await fetch(
                `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&with_genres=${genreId}&language=en-US&sort_by=popularity.desc`
            );
            const data = await response.json();
            setMovies(data.results);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching movies:', error);
            setLoading(false);
        }
    };

    const handleGenreClick = (genre) => {
        setSelectedGenre(genre);
    };

    const handleMovieClick = (movieId) => {
        navigate(`/movie/${movieId}`);
    };

    return (
        <div className="category-page">
            <div className="genres-container">
                {genres.map(genre => (
                    <div
                        key={genre.id}
                        className={`genre-item ${selectedGenre?.id === genre.id ? 'selected' : ''}`}
                        onClick={() => handleGenreClick(genre)}
                    >
                        {genre.name}
                    </div>
                ))}
            </div>

            <div className="movies-grid">
                {loading ? (
                    <div className="loading">Loading...</div>
                ) : selectedGenre ? (
                    movies.map(movie => (
                        <div
                            key={movie.id}
                            className="movie-card"
                            onClick={() => handleMovieClick(movie.id)}
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
                                <span className="rating">{Math.round(movie.vote_average * 10)}%</span>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="select-genre">Select a genre to see movies</div>
                )}
            </div>
        </div>
    );
};

export default CategoryPage;
