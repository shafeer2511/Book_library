import React, { useState, useEffect } from 'react';
import './styles/Navbar.css';
import './styles/SearchBar.css'; // Import search styles
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from './ThemeContext';
const Navbar = ({ onSearch }) => {
  const [query, setQuery] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  // Keep track of token login state changes
  useEffect(() => {
    const checkToken = () => {
      setIsLoggedIn(!!localStorage.getItem('token'));
    };
    window.addEventListener('storage', checkToken);
    // Simple interval check to handle same-tab navigation state changes
    const interval = setInterval(checkToken, 1000);
    return () => {
      window.removeEventListener('storage', checkToken);
      clearInterval(interval);
    };
  }, []);

  const handleSearch = () => {
    onSearch(query);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleUserLogout = () => {
    localStorage.removeItem('token'); // Remove token on logout
    setIsLoggedIn(false); // Update state immediately in the current tab
    navigate("/auth"); // Navigate to login page
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
            placeholder="Search by title, author, or genre..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            className="search-input" // Updated for styling consistency
          />
          <button onClick={handleSearch} className="search-button">
            🔍 Search
          </button>
        </div>
      </div>
      <div className="navbar-right">
        {isLoggedIn ? (
          <>
            <Link to="/profile" className="nav-link">👤 Profile</Link>
            <button onClick={toggleTheme} className="theme-toggle-button" aria-label="Toggle Theme">
              {theme === "dark" ? "🌙 Dark Mode" : "🌞 Light Mode"}
            </button>
            <button onClick={handleUserLogout} className="nav-link logout-button">🔓 Logout</button>
          </>
        ) : (
          <>
            <button onClick={toggleTheme} className="theme-toggle-button" aria-label="Toggle Theme">
              {theme === "dark" ? "🌙 Dark Mode" : "🌞 Light Mode"}
            </button>
            <Link to="/auth" className="nav-link login-link">🔒 Login</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
