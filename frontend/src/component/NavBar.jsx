import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './../css/componentCss/NavBar.css';

const NavBar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    // Clear user-related data (e.g., tokens) from local storage or state
    localStorage.removeItem('userToken'); // Example token key
    localStorage.removeItem('user'); // Example user data key

    // Navigate to the login page or a specific logout route
    navigate('/admin');
  };

  // Determine the active path
  const getActiveClass = (path) => location.pathname === path ? 'active' : '';

  return (
    <nav className="navbar">
      <div className="navbar-logo-header">
        {/* <button 
          className="navbar-logo-button"
          onClick={() => navigate('/admin-user')}
        >
          <img src={logo} alt="RojgarNepal Logo" className="navbar-logo" />
        </button> */}
        <h1 className="navbar-title">App Name</h1>
      </div>
      <div className="navbar-navigation">
        <ul>
          <li className={`navbar-nav-item ${getActiveClass('/admin-home')}`} onClick={() => navigate('/admin-home')}>
            Home
          </li>
          <li className={`navbar-nav-item ${getActiveClass('/admin-uselog')}`} onClick={() => navigate('/admin-uselog')}>
            User
          </li>
          <li className={`navbar-nav-item ${getActiveClass('/admin-adduser')}`} onClick={() => navigate('/admin-adduser')}>
            Add User
          </li>
          <li className={`navbar-nav-item ${getActiveClass('/admin-manageuser')}`} onClick={() => navigate('/admin-manageuser')}>
            Manage User
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
