import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './../css/componentCss/NavBar.css';
import useAuth from '../hooks/useAuth';

const NavBar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/admin');
  };

  const getActiveClass = (path) => location.pathname === path ? 'active' : '';

  return (
    <nav className="navbar">
      <div className="navbar-logo-header">
        <h1 className="navbar-title">AMS</h1>
        <button className="menu-toggle" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          ☰
        </button>
      </div>
      <div className={`navbar-navigation ${isMenuOpen ? 'open' : ''}`}>
        <ul>
          <li className={`navbar-nav-item ${getActiveClass('/admin-home')}`} onClick={() => navigate('/admin-home')}>
            Home
          </li>
          <li className={`navbar-nav-item ${getActiveClass('/admin-uselog')}`} onClick={() => navigate('/admin-uselog')}>
            Students
          </li>
          <li className={`navbar-nav-item ${getActiveClass('/admin-adduser')}`} onClick={() => navigate('/admin-adduser')}>
            Add Student
          </li>
          <li className={`navbar-nav-item ${getActiveClass('/admin-manageuser')}`} onClick={() => navigate('/admin-manageuser')}>
            Manage Students
          </li>
          <li className="navbar-nav-item logout-item" onClick={handleLogout}>
            Log Out
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default NavBar;
