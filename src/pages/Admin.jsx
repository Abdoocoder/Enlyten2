import React from 'react';
import './Admin.css';
import Card from '../components/UI/Card/Card';
import Button from '../components/UI/Button/Button';

const Admin = () => {
  return (
    <div className="admin-page page-container">
      <header className="admin-header section">
        <h1 className="headline-medium">Admin Dashboard</h1>
        <p className="body-large">Clinic Performance & Management</p>
      </header>

      <div className="admin-stats section">
        <Card variant="white" className="stat-item">
          <span className="label-medium">Monthly Revenue</span>
          <p className="headline-medium">$42,500</p>
          <span className="trend positive">+12% from last month</span>
        </Card>
        <Card variant="white" className="stat-item">
          <span className="label-medium">Active Patients</span>
          <p className="headline-medium">1,240</p>
        </Card>
        <Card variant="white" className="stat-item">
          <span className="label-medium">Total Treatments</span>
          <p className="headline-medium">3,890</p>
        </Card>
      </div>

      <div className="admin-content section">
        <Card variant="white" className="recent-appointments full-width">
          <div className="card-header">
            <h2 className="headline-small">Recent Appointments</h2>
            <Button variant="secondary">View All</Button>
          </div>
          <table className="admin-table">
            <thead>
              <tr>
                <th className="label-medium">Patient</th>
                <th className="label-medium">Treatment</th>
                <th className="label-medium">Date</th>
                <th className="label-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {[1, 2, 3].map(i => (
                <tr key={i}>
                  <td className="body-medium">Alex Johnson</td>
                  <td className="body-medium">Laser Genesis</td>
                  <td className="body-medium">April 14, 11:00 AM</td>
                  <td><span className="status-badge">Confirmed</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </div>
    </div>
  );
};

export default Admin;
