import React, { useState } from 'react';
import UserMenu from './UserMenu';

const Topbar = () => {
    // Basic dark mode toggle state
    const [isDarkMode, setIsDarkMode] = useState(false);
  
    const toggleDarkMode = () => {
      document.body.classList.toggle('dark-mode');
      setIsDarkMode(!isDarkMode);
    };

  return (
    <nav className="main-header navbar navbar-expand navbar-white navbar-light">
      <ul className="navbar-nav">
        <li className="nav-item">
          <a className="nav-link" data-widget="pushmenu" href="#" role="button">
            <i className="fas fa-bars"></i>
          </a>
        </li>
      </ul>

      <ul className="navbar-nav ms-auto">
        {/* Dark Mode Toggle */}
        <li className="nav-item">
            <button className="nav-link btn" onClick={toggleDarkMode}>
            <i className={`fas ${isDarkMode ? 'fa-sun' : 'fa-moon'}`}></i>
            </button>
        </li>
        <UserMenu />
      </ul>
    </nav>
  );
};

export default Topbar;
