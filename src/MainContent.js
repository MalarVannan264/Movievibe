import React, { useContext, useState, useEffect } from 'react';
import { MoviesContext } from './contexts/MoviesContext';
import Carousel from './Carousel';
import MovieCard from './MovieCard';
import './MainContent.css';

const MainContent = () => {
    const { movies, loading, error } = useContext(MoviesContext);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
    const [expandedSections, setExpandedSections] = useState({});
    const imageBaseUrl = 'https://image.tmdb.org/t/p/w500';

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const formatMovieData = (movieList) => {
        if (!Array.isArray(movieList)) {
            console.log('Not an array:', movieList);
            return [];
        }
        
        console.log('Formatting movie list:', movieList);
        
        const formattedMovies = movieList.map(movie => {
            const formatted = {
                id: movie.id,
                poster: movie.poster_path ? `${imageBaseUrl}${movie.poster_path}` : 'https://via.placeholder.com/300x450?text=No+Poster',
                title: movie.title || movie.name,
                genre: movie.genre_ids ? getGenreName(movie.genre_ids[0]) : 'Unknown',
                rating: movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A',
                overview: movie.overview
            };
            console.log('Formatted movie:', formatted);
            return formatted;
        });

        return formattedMovies;
    };

    const getGenreName = (genreId) => {
        const genres = {
            28: 'Action',
            12: 'Adventure',
            16: 'Animation',
            35: 'Comedy',
            80: 'Crime',
            99: 'Documentary',
            18: 'Drama',
            10751: 'Family',
            14: 'Fantasy',
            36: 'History',
            27: 'Horror',
            10402: 'Music',
            9648: 'Mystery',
            10749: 'Romance',
            878: 'Science Fiction',
            10770: 'TV Movie',
            53: 'Thriller',
            10752: 'War',
            37: 'Western'
        };
        return genres[genreId] || 'Unknown';
    };

    console.log('Current movies state:', movies);
    console.log('Loading state:', loading);
    console.log('Error state:', error);

    if (loading) {
        return (
            <div className="main-container">
            <div className="hero-section" data-aos="fade-down" data-aos-duration="1000">
                <div className="bgimg"></div>
                <div className="hero-text" data-aos="fade-up" data-aos-delay="200">
                        <h1>MovieVibe lets you discover movies<br /> effortlessly with its powerful search tool.</h1>
                    </div>
                </div>
                <div className="content-section">
                    {['Latest Releases', 'Top Rated Movies', 'Kids & Family', 'Documentaries', 'Top TV Series'].map((title) => (
                        <section key={title}>
                            <h2>{title}</h2>
                            <Carousel isLoading={true} movies={[]} />
                        </section>
                    ))}
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="error-message">
                {error}
            </div>
        );
    }

    const nowPlayingMovies = formatMovieData(movies?.nowPlaying);
    const topRatedMovies = formatMovieData(movies?.topRated);
    const kidsMovies = formatMovieData(movies?.kids);
    const documentaryMovies = formatMovieData(movies?.documentary);
    const seriesMovies = formatMovieData(movies?.series);

    console.log('Formatted movies:', {
        nowPlaying: nowPlayingMovies,
        topRated: topRatedMovies,
        kids: kidsMovies,
        documentary: documentaryMovies,
        series: seriesMovies
    });

    return (
        <div className="main-container">
            <div className="hero-section" data-aos="fade-down" data-aos-duration="1000">
                <div className="bgimg"></div>
                <div className="hero-text" data-aos="fade-up" data-aos-delay="200">
                    <h1><i>MovieVibe</i> <br />lets you discover movies</h1>
                </div>
            </div>

            <div className="content-section">
                {[
                    { title: 'Latest Releases', movies: nowPlayingMovies },
                    { title: 'Top Rated Movies', movies: topRatedMovies },
                    { title: 'Kids & Family', movies: kidsMovies },
                    { title: 'Documentaries', movies: documentaryMovies },
                    { title: 'Top TV Series', movies: seriesMovies }
                ].map(({ title, movies: sectionMovies }) => (
                    <section key={title} data-aos="fade-up" data-aos-duration="800">
                        <h2>{title}</h2>
                        {isMobile ? (
                            <>
                                <div 
                                    className={`mobile-grid ${expandedSections[title] ? 'expanded' : ''} visible`}
                                    data-aos="fade-up"
                                    data-aos-delay="200"
                                >
                                    {sectionMovies.slice(0, expandedSections[title] ? undefined : 6).map((movie) => (
                                        <MovieCard 
                                            key={movie.id} 
                                            movie={movie}
                                            isLoading={false}
                                        />
                                    ))}
                                </div>
                                {sectionMovies.length > 6 && (
                                    <button 
                                        className="view-more-btn"
                                        onClick={() => setExpandedSections(prev => ({
                                            ...prev,
                                            [title]: !prev[title]
                                        }))}
                                    >
                                        {expandedSections[title] ? 'Show Less' : 'View More'}
                                    </button>
                                )}
                            </>
                        ) : (
                            <Carousel 
                                movies={sectionMovies} 
                                isLoading={loading}
                            />
                        )}
                    </section>
                ))}
            </div>
        </div>
    );
};

export default MainContent;
