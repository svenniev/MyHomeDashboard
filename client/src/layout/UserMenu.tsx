import React from 'react';
import { useAuth } from '../auth/AuthContext';
import { Link } from 'react-router-dom';

const UserMenu = () => {
    const { user, logout } = useAuth();
  
    if (!user) {
      return (
        <li className="nav-item">
          <Link className="nav-link" to="/login">
            Sign In
          </Link>
        </li>
      );
    }
  
    return (
      <li className="nav-item dropdown user-menu">
        <a href="#" className="nav-link dropdown-toggle" data-bs-toggle="dropdown">
          <img src={user.profilePicturePath || `https://ui-avatars.com/api/?name=${user.firstName}+${user.lastName}`} className="user-image img-circle elevation-2" alt="User Image" />
          <span className="d-none d-md-inline">{user.firstName} {user.lastName}</span>
        </a>
        <ul className="dropdown-menu dropdown-menu-lg dropdown-menu-end">
          <li className="user-header bg-primary">
            <img src={user.profilePicturePath || `https://ui-avatars.com/api/?name=${user.firstName}+${user.lastName}`} className="img-circle elevation-2" alt="User Image" />
            <p>
              {user.firstName} {user.lastName}
            </p>
          </li>
          <li className="user-body">
            <div className="row">
              <div className="col-4 text-center">
                <Link to="/body">Body</Link>
              </div>
              <div className="col-4 text-center">
                <Link to="/training">Training</Link>
              </div>
              <div className="col-4 text-center">
                <Link to="/goals">Goals</Link>
              </div>
            </div>
          </li>
          <li className="user-footer">
            <Link to="/profile" className="btn btn-default btn-flat">
              Profile
            </Link>
            <button onClick={logout} className="btn btn-default btn-flat float-end">
              Sign out
            </button>
          </li>
        </ul>
      </li>
    );
  };
  
  export default UserMenu;
  
