import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './Admin.css';
import Card from '../components/UI/Card/Card';
import Button from '../components/UI/Button/Button';
import { useAuth } from '../contexts/AuthContext';

const Admin = () => {
  const { t } = useTranslation();
  const { isAuthenticated, isAdmin, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && (!isAuthenticated || !isAdmin)) {
      navigate('/');
    }
  }, [isAuthenticated, isAdmin, loading, navigate]);

  if (loading || !isAdmin) return null;

  return (
    <div className="admin-page page-container">
      <header className="admin-header section">
        <h1 className="headline-medium">{t('admin.title')}</h1>
        <p className="body-large">{t('admin.subtitle')}</p>
      </header>

      <div className="admin-stats section">
        <Card variant="white" className="stat-item">
          <span className="label-medium">{t('admin.revenue')}</span>
          <p className="headline-medium">42,500 JD</p>
          <span className="trend positive">{t('admin.revenueTrend')}</span>
        </Card>
        <Card variant="white" className="stat-item">
          <span className="label-medium">{t('admin.patients')}</span>
          <p className="headline-medium">1,240</p>
        </Card>
        <Card variant="white" className="stat-item">
          <span className="label-medium">{t('admin.totalTreatments')}</span>
          <p className="headline-medium">3,890</p>
        </Card>
      </div>

      <div className="admin-content section">
        <Card variant="white" className="recent-appointments full-width">
          <div className="card-header">
            <h2 className="headline-small">{t('admin.recentAppointments')}</h2>
            <Button variant="secondary">{t('admin.viewAll')}</Button>
          </div>
          <table className="admin-table">
            <thead>
              <tr>
                <th className="label-medium">{t('admin.colPatient')}</th>
                <th className="label-medium">{t('admin.colTreatment')}</th>
                <th className="label-medium">{t('admin.colDate')}</th>
                <th className="label-medium">{t('admin.colStatus')}</th>
              </tr>
            </thead>
            <tbody>
              {[1, 2, 3].map(i => (
                <tr key={i}>
                  <td className="body-medium">Alex Johnson</td>
                  <td className="body-medium">Laser Genesis</td>
                  <td className="body-medium">April 14, 11:00 AM</td>
                  <td><span className="status-badge">{t('admin.statusConfirmed')}</span></td>
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
