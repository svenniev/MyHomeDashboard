import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar = () => {
  return (
    <aside className="main-sidebar sidebar-dark-primary elevation-4">
      <Link to="/" className="brand-link">
        <span className="brand-text font-weight-light">myhomedashboard</span>
      </Link>
      <div className="sidebar">
        <nav className="mt-2">
          <ul className="nav nav-pills nav-sidebar flex-column" data-widget="treeview" role="menu" data-accordion="false">
            <li className="nav-item">
              <Link to="/" className="nav-link">
                <i className="nav-icon fas fa-home"></i>
                <p>Home</p>
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/body" className="nav-link">
                <i className="nav-icon fas fa-heartbeat"></i>
                <p>Body</p>
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/training" className="nav-link">
                <i className="nav-icon fas fa-dumbbell"></i>
                <p>Training</p>
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/goals" className="nav-link">
                <i className="nav-icon fas fa-bullseye"></i>
                <p>Goals</p>
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/admin" className="nav-link">
                <i className="nav-icon fas fa-cogs"></i>
                <p>Admin</p>
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/profile" className="nav-link">
                <i className="nav-icon fas fa-user"></i>
                <p>Profile</p>
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;
