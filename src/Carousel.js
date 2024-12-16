import React, { useState, useRef, useEffect, useCallback } from 'react';
import MovieCard from './MovieCard';
import './Carousel.css';

const Carousel = ({ title, movies = [], isLoading }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);
    const [touchStart, setTouchStart] = useState(null);
    const trackRef = useRef(null);
    const itemsPerView = 4;

    // Memoized visibility update function
    const updateVisibility = useCallback(() => {
        const items = trackRef.current?.getElementsByClassName('carousel-item') || [];
        Array.from(items).forEach((item, index) => {
            const isVisible = index >= currentIndex && index < currentIndex + itemsPerView;
            const delay = isVisible ? (index - currentIndex) * 100 : 0; // Stagger effect
            
            requestAnimationFrame(() => {
                item.style.transitionDelay = `${delay}ms`;
                if (isVisible) {
                    item.classList.add('visible');
                } else {
                    item.classList.remove('visible');
                    item.style.transitionDelay = '0ms';
                }
            });
        });

        if (trackRef.current) {
            const translateX = -(currentIndex * (100 / itemsPerView));
            trackRef.current.style.transform = `translateX(${translateX}%)`;
        }
    }, [currentIndex, itemsPerView]);

    useEffect(() => {
        updateVisibility();
    }, [currentIndex, movies, updateVisibility]);

    const handleNavigation = useCallback((direction) => {
        if (isAnimating) return;

        setIsAnimating(true);
        const newIndex = direction === 'next'
            ? Math.min(currentIndex + 1, movies.length - itemsPerView)
            : Math.max(0, currentIndex - 1);

        setCurrentIndex(newIndex);

        setTimeout(() => {
            setIsAnimating(false);
        }, 600);
    }, [currentIndex, isAnimating, movies.length, itemsPerView]);

    // Touch event handlers for mobile swipe
    const handleTouchStart = (e) => {
        setTouchStart(e.touches[0].clientX);
    };

    const handleTouchMove = (e) => {
        if (!touchStart) return;

        const touchEnd = e.touches[0].clientX;
        const diff = touchStart - touchEnd;

        if (Math.abs(diff) > 50) { // Minimum swipe distance
            if (diff > 0 && currentIndex < movies.length - itemsPerView) {
                handleNavigation('next');
            } else if (diff < 0 && currentIndex > 0) {
                handleNavigation('prev');
            }
            setTouchStart(null);
        }
    };

    const handleTouchEnd = () => {
        setTouchStart(null);
    };

    // Loading state with shimmer effect
    if (isLoading) {
        return (
            <div className="carousel-section">
                {title && <h2 className="carousel-title">{title}</h2>}
                <div className="carousel-container">
                    <div className="carousel-track">
                        {[...Array(itemsPerView)].map((_, index) => (
                            <div key={`loading-${index}`} className="carousel-item loading">
                                <MovieCard isLoading={true} />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    if (!movies.length) {
        return null;
    }

    const showPrevButton = currentIndex > 0;
    const showNextButton = currentIndex < movies.length - itemsPerView;

    return (
        <div className="carousel-section">
            {title && <h2 className="carousel-title">{title}</h2>}
            <div className="carousel-container">
                {showPrevButton && (
                    <button 
                        className="carousel-button prev" 
                        onClick={() => handleNavigation('prev')}
                        disabled={isAnimating}
                        aria-label="Previous movies"
                    >
                        ‹
                    </button>
                )}
                
                <div 
                    className="carousel-track" 
                    ref={trackRef}
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                >
                    {movies.map((movie, index) => (
                        <div 
                            key={movie.id || index} 
                            className={`carousel-item ${
                                index >= currentIndex && 
                                index < currentIndex + itemsPerView 
                                    ? 'visible' 
                                    : ''
                            }`}
                            style={{
                                transform: `translateZ(${
                                    index >= currentIndex && 
                                    index < currentIndex + itemsPerView 
                                        ? '0px' 
                                        : '-100px'
                                })`
                            }}
                        >
                            <MovieCard 
                                movie={movie}
                                isLoading={false}
                            />
                        </div>
                    ))}
                </div>

                {showNextButton && (
                    <button 
                        className="carousel-button next" 
                        onClick={() => handleNavigation('next')}
                        disabled={isAnimating}
                        aria-label="Next movies"
                    >
                        ›
                    </button>
                )}
            </div>
        </div>
    );
};

export default Carousel;
