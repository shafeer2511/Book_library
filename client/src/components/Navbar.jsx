import React, { useState, useEffect } from 'react';
import './styles/Navbar.css';
import './styles/SearchBar.css'; // Import search styles
import { Link, useNavigate } from 'react-router-dom';

const Navbar = ({ onSearch }) => {
  const [query, setQuery] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));
  const [isDarkMode, setIsDarkMode] = useState(false); // State to manage the theme

  useEffect(() => {
    // Check for saved theme preference in localStorage
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setIsDarkMode(savedTheme === 'dark');
    }
  }, []);

  useEffect(() => {
    // Update the body class based on the current theme
    if (isDarkMode) {
      document.body.classList.add('dark-theme');
      document.body.classList.remove('light-theme');
    } else {
      document.body.classList.add('light-theme');
      document.body.classList.remove('dark-theme');
    }

    // Save the theme preference to localStorage
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  const handleSearch = () => {
    onSearch(query);
  };

  const handleUserLogout = () => {
    localStorage.removeItem('token'); // Remove token on logout
    setIsLoggedIn(false); // Update state immediately in the current tab
    useNavigate("/auth"); // Navigate to login page
  };

  const toggleTheme = () => {
    setIsDarkMode(prevMode => !prevMode); // Toggle between dark and light mode
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <Link to="/" className="app-name">BookNest</Link>
      </div>
      <div className="navbar-center">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search for books"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="search-input" // Updated for styling consistency
          />
          <button onClick={handleSearch} className="search-button">
            Search
          </button>
        </div>
      </div>
      <div className="navbar-right">
        {isLoggedIn ? (
          <>
            <Link to="/profile" className="nav-link">👤 Profile</Link>
            <button onClick={toggleTheme} className="theme-toggle-button">
              {isDarkMode ? '🌙 Dark Mode' : '🌞 Light Mode'}
            </button>
            <button onClick={handleUserLogout} className="nav-link logout-button">🔓 Logout</button>
          </>
        ) : (
          <Link to="/auth" className="nav-link">🔒 Login</Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
