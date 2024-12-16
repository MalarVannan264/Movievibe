import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Header.css';

const Header = () => {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 0);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);


    const handleSearch = () => {
        if (searchQuery.trim()) {
            console.log('Searching for:', searchQuery.trim());
            const encodedQuery = encodeURIComponent(searchQuery.trim());
            console.log('Encoded query:', encodedQuery);
            navigate(`/search?query=${encodedQuery}`);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    const handleNavigation = (path) => {
        navigate(path);
        setIsMobileMenuOpen(false);
    };

    return (
        <header className={`header ${isScrolled ? 'scrolled' : ''}`}>
            <button 
                className={`mobile-menu-button ${isMobileMenuOpen ? 'active' : ''}`}
                onClick={toggleMobileMenu}
                aria-label="Toggle mobile menu"
            >
                <span></span>
                <span></span>
                <span></span>
            </button>
            <div className="logo-container" onClick={() => handleNavigation('/')} style={{ cursor: 'pointer' }}>
                <img src={require('./assets/logo.png')} alt="Logo" className="logo" />
                <span className="logo-text">MovieVibe</span>
            </div>
            <div className="right">
                <div className="search-container">
                    <input 
                        type="text" 
                        placeholder="Search" 
                        className="search-bar"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyPress={handleKeyPress}
                    />
                    <button className="search-button" onClick={handleSearch}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M15.5 14H14.71L14.43 13.73C15.41 12.59 16 11.11 16 9.5C16 5.91 13.09 3 9.5 3C5.91 3 3 5.91 3 9.5C3 13.09 5.91 16 9.5 16C11.11 16 12.59 15.41 13.73 14.43L14 14.71V15.5L19 20.49L20.49 19L15.5 14ZM9.5 14C7.01 14 5 11.99 5 9.5C5 7.01 7.01 5 9.5 5C11.99 5 14 7.01 14 9.5C14 11.99 11.99 14 9.5 14Z" fill="white"/>
                        </svg>
                    </button>
                </div>
                <div className="icon-container">
                    <img 
                        src={require('./assets/Category.png')} 
                        alt="Category Icon" 
                        className="icon"
                        onClick={() => handleNavigation('/category')}
                    />
                    <img 
                        src={require('./assets/Fav.png')} 
                        alt="Favorite Icon" 
                        className="icon"
                        onClick={() => handleNavigation('/favorite')}
                    />
                </div>
            </div>

            {/* Mobile Menu */}
            <div className={`mobile-menu ${isMobileMenuOpen ? 'active' : ''}`}>
                <div className="search-container">
                    <input 
                        type="text" 
                        placeholder="Search" 
                        className="search-bar"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyPress={handleKeyPress}
                    />
                    <button className="search-button" onClick={handleSearch}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M15.5 14H14.71L14.43 13.73C15.41 12.59 16 11.11 16 9.5C16 5.91 13.09 3 9.5 3C5.91 3 3 5.91 3 9.5C3 13.09 5.91 16 9.5 16C11.11 16 12.59 15.41 13.73 14.43L14 14.71V15.5L19 20.49L20.49 19L15.5 14ZM9.5 14C7.01 14 5 11.99 5 9.5C5 7.01 7.01 5 9.5 5C11.99 5 14 7.01 14 9.5C14 11.99 11.99 14 9.5 14Z" fill="white"/>
                        </svg>
                    </button>
                </div>
                <div className="icon-container">
                    <img 
                        src={require('./assets/Category.png')} 
                        alt="Category Icon" 
                        className="icon"
                        onClick={() => handleNavigation('/category')}
                    />
                    <img 
                        src={require('./assets/Fav.png')} 
                        alt="Favorite Icon" 
                        className="icon"
                        onClick={() => handleNavigation('/favorite')}
                    />
                </div>
            </div>
        </header>
    );
};

export default Header;
