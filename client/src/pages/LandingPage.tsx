import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

const LandingPage = () => {
  const { user } = useAuth();

  return (
    <div>
      <div className="card">
        <div className="card-body">
          <h5 className="card-title">Welcome back, {user?.nickname || user?.firstName || 'User'}!</h5>
          <p className="card-text">
            This is your personal dashboard. Here are some quick stats and links to get you started.
          </p>
        </div>
      </div>

      <div className="row">
        {/* Placeholder Statistics Cards */}
        <div className="col-lg-3 col-6">
          <div className="small-box bg-info">
            <div className="inner">
              <h3>150</h3>
              <p>Active Goals</p>
            </div>
            <div className="icon">
              <i className="ion ion-bag"></i>
            </div>
            <Link to="/goals" className="small-box-footer">More info <i className="fas fa-arrow-circle-right"></i></Link>
          </div>
        </div>
        <div className="col-lg-3 col-6">
          <div className="small-box bg-success">
            <div className="inner">
              <h3>53<sup style={{fontSize: '20px'}}>%</sup></h3>
              <p>Weight Goal Progress</p>
            </div>
            <div className="icon">
              <i className="ion ion-stats-bars"></i>
            </div>
            <Link to="/goals" className="small-box-footer">More info <i className="fas fa-arrow-circle-right"></i></Link>
          </div>
        </div>
        <div className="col-lg-3 col-6">
           <div className="small-box bg-warning">
            <div className="inner">
              <h3>44</h3>
              <p>Trainings This Month</p>
            </div>
            <div className="icon">
              <i className="ion ion-person-add"></i>
            </div>
            <Link to="/training" className="small-box-footer">More info <i className="fas fa-arrow-circle-right"></i></Link>
          </div>
        </div>
        <div className="col-lg-3 col-6">
          <div className="small-box bg-danger">
            <div className="inner">
              <h3>-1.5kg</h3>
              <p>Weight Change (30d)</p>
            </div>
            <div className="icon">
              <i className="ion ion-pie-graph"></i>
            </div>
            <Link to="/body" className="small-box-footer">More info <i className="fas fa-arrow-circle-right"></i></Link>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-md-12">
            <div className="card">
                <div className="card-header">
                    <h3 className="card-title">Quick Links</h3>
                </div>
                <div className="card-body">
                    <Link to="/body" className="btn btn-app"><i className="fas fa-heartbeat"></i> Body</Link>
                    <Link to="/training" className="btn btn-app"><i className="fas fa-running"></i> Training</Link>
                    <Link to="/goals" className="btn btn-app"><i className="fas fa-bullseye"></i> Goals</Link>
                    <Link to="/profile" className="btn btn-app"><i className="fas fa-user"></i> Profile</Link>
                    <Link to="/admin" className="btn btn-app"><i className="fas fa-cogs"></i> Admin</Link>
                </div>
            </div>
        </div>
      </div>

    </div>
  );
}

export default LandingPage;