import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { MoviesContext } from './contexts/MoviesContext';
import { useFavorites } from './contexts/FavoritesContext';
import './Moviedetails.css';

const MovieDetails = () => {
  const { id } = useParams();
  const { baseUrl, apiKey } = useContext(MoviesContext);
  const { addToFavorites, removeFromFavorites, isFavorite } = useFavorites();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [movieData, setMovieData] = useState(null);
  const [cast, setCast] = useState([]);
  const [trailer, setTrailer] = useState(null);
  const [platforms, setPlatforms] = useState([]);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        const baseParams = `api_key=${apiKey}&language=en-US`;
        
        // Fetch movie details
        const movieResponse = await fetch(`${baseUrl}/movie/${id}?${baseParams}`);
        if (!movieResponse.ok) throw new Error('Failed to fetch movie details');
        const movieData = await movieResponse.json();
        setMovieData(movieData);

        // Fetch cast
        const creditsResponse = await fetch(`${baseUrl}/movie/${id}/credits?${baseParams}`);
        if (!creditsResponse.ok) throw new Error('Failed to fetch credits');
        const creditsData = await creditsResponse.json();
        setCast(creditsData.cast?.slice(0, 6) || []);

        // Fetch videos for trailer
        const videosResponse = await fetch(`${baseUrl}/movie/${id}/videos?${baseParams}`);
        if (!videosResponse.ok) throw new Error('Failed to fetch videos');
        const videosData = await videosResponse.json();
        const trailer = videosData.results?.find(video => video.type === 'Trailer');
        setTrailer(trailer || null);

        // Fetch watch providers
        const providersResponse = await fetch(`${baseUrl}/movie/${id}/watch/providers?${baseParams}`);
        if (!providersResponse.ok) throw new Error('Failed to fetch providers');
        const providersData = await providersResponse.json();
        setPlatforms(providersData.results?.US?.flatrate || []);

        // Fetch reviews
        const reviewsResponse = await fetch(`${baseUrl}/movie/${id}/reviews?${baseParams}`);
        if (!reviewsResponse.ok) throw new Error('Failed to fetch reviews');
        const reviewsData = await reviewsResponse.json();
        setReviews(reviewsData.results || []);

      } catch (err) {
        console.error('Error fetching movie details:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMovieDetails();
  }, [id, baseUrl, apiKey]);

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">Error: {error}</div>;
  if (!movieData) return <div className="error">Movie not found</div>;

  return (
    <div className="movie-details">
      <div className="movie-content" data-aos="fade-up" data-aos-duration="1000">
        <div className="poster-container" data-aos="fade-right" data-aos-delay="200">
          <div className="poster">
            <img 
              src={`https://image.tmdb.org/t/p/w500${movieData.poster_path}`} 
              alt={movieData.title} 
            />
            <div className="poster-overlay">
              <div className="rating">
                <span> {movieData.vote_average.toFixed(1)}/10</span>
              </div>
            </div>
          </div>
        </div>

        <div className="movie-details-group" data-aos="fade-left" data-aos-delay="400">
          <div className="movie-header">
            <div className="title-favorite-container">
              <button 
                className={`favorite-button-details ${isFavorite(movieData.id) ? 'active' : ''}`}
                onClick={() => {
                  if (isFavorite(movieData.id)) {
                    removeFromFavorites(movieData.id);
                  } else {
                    const movieDataToAdd = {
                      id: movieData.id,
                      title: movieData.title,
                      poster: `https://image.tmdb.org/t/p/w500${movieData.poster_path}`,
                      rating: movieData.vote_average.toFixed(1),
                      genre: movieData.genres?.map(g => g.name).join(', '),
                      overview: movieData.overview
                    };
                    addToFavorites(movieData.id, movieDataToAdd);
                  }
                }}
                aria-label={isFavorite(movieData.id) ? "Remove from favorites" : "Add to favorites"}
              >
                ❤
              </button>
              <h1 className="movie-title">{movieData.title}</h1>
            </div>
            <div className="movie-meta">
              <span>{new Date(movieData.release_date).getFullYear()}</span>
              <span>{movieData.runtime} min</span>
            </div>
          </div>
          <div className="overview">
            <h2>Overview</h2>
            <p>{movieData.overview}</p>
          </div>

          <div className="categories">
            <h2>Categories</h2>
            <div className="genre-list">
              {movieData.genres?.map(genre => (
                <span key={genre.id} className="genre-pill">
                  {genre.name}
                </span>
              ))}
            </div>
          </div>

        </div>
      </div>

      <div className="content-section">
        <div className="cast-section" data-aos="fade-up" data-aos-duration="800">
          <h2>Cast</h2>
          <div className="cast-carousel-container">
            <button 
              className="carousel-button prev" 
              onClick={() => {
                const carousel = document.querySelector('.cast-carousel');
                carousel.scrollBy({ left: -300, behavior: 'smooth' });
              }}
              aria-label="Previous cast members"
            >
              ‹
            </button>
            <div className="cast-carousel">
              {cast.map(member => (
                <div key={member.id} className="cast-card">
                  <img 
                    src={`https://image.tmdb.org/t/p/w185${member.profile_path}`}
                    alt={member.name}
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/185x278?text=No+Image';
                    }}
                  />
                  <div className="cast-info">
                    <h3>{member.name}</h3>
                    <p>{member.character}</p>
                  </div>
                </div>
              ))}
            </div>
            <button 
              className="carousel-button next" 
              onClick={() => {
                const carousel = document.querySelector('.cast-carousel');
                carousel.scrollBy({ left: 300, behavior: 'smooth' });
              }}
              aria-label="Next cast members"
            >
              ›
            </button>
          </div>
        </div>
        {trailer && (
          <div className="trailer-section" data-aos="fade-up" data-aos-duration="800">
            <h2>Trailer</h2>
            <div className="trailer-container">
              <iframe
                title="Movie Trailer"
                src={`https://www.youtube.com/embed/${trailer.key}`}
                frameBorder="0"
                allowFullScreen
              />
            </div>
          </div>
        )}

        {platforms.length > 0 && (
          <div className="platforms-section" data-aos="fade-up" data-aos-duration="800">
            <h2>Where to Watch</h2>
            <div className="platform-list">
              {platforms.map(platform => (
                <div key={platform.provider_id} className="platform-card">
                  <img 
                    src={`https://image.tmdb.org/t/p/original${platform.logo_path}`}
                    alt={platform.provider_name}
                  />
                  <span>{platform.provider_name}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {reviews.length > 0 && (
          <div className="reviews-section" data-aos="fade-up" data-aos-duration="800">
            <h2>Reviews</h2>
            <div className="review-list">
              {reviews.map(review => (
                <div key={review.id} className="review-card">
                  <div className="review-header">
                    <h3>{review.author}</h3>
                    <span>{new Date(review.created_at).toLocaleDateString()}</span>
                  </div>
                  <p>{review.content}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MovieDetails;
