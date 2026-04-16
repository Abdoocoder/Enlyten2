import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import './Dashboard.css';
import Card from '../components/UI/Card/Card';
import Button from '../components/UI/Button/Button';
import { useAuth } from '../contexts/AuthContext';
import { useUserBookings } from '../hooks/useDatabase';
import { cancelBooking } from '../lib/supabase';
import { useTranslation } from 'react-i18next';

const Dashboard = () => {
  const { user, profile, isAuthenticated } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { bookings, loading, error } = useUserBookings(user?.id);
  const [successMessage, setSuccessMessage] = useState('');
  const [cancelLoading, setCancelLoading] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (searchParams.get('booking') === 'success') {
      setSuccessMessage('Your appointment has been successfully scheduled.');
      setTimeout(() => setSuccessMessage(''), 5000);
    }
  }, [isAuthenticated, navigate, searchParams]);

  const handleCancelBooking = async (bookingId) => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      try {
        setCancelLoading(bookingId);
        const { error: cancelError } = await cancelBooking(bookingId);
        if (cancelError) throw cancelError;
        window.location.reload();
      } catch (err) {
        console.error('Cancel booking error:', err);
      } finally {
        setCancelLoading(null);
      }
    }
  };

  const upcomingBookings = bookings.filter(b => b.status !== 'cancelled' && b.status !== 'completed');
  const upcomingAppointment = upcomingBookings.length > 0 ? upcomingBookings[0] : null;
  const pastBookings = bookings.filter(b => b.status === 'completed');

  return (
    <div className="dashboard-page">
      {/* Dashboard Greeting Hero */}
      <section className="viewport-section section-light dashboard-hero">
        <div className="content-well">
          <span className="brand-accent">Client Portal</span>
          <h1 className="hero-headline">
             Hello, <span className="laser-text">{profile?.full_name?.split(' ')[0] || 'Member'}</span>
          </h1>
          <p className="body-intro">Welcome back to your luminous journey. Manage your treatments and skin health here.</p>
        </div>
      </section>

      <main className="viewport-section section-white dashboard-main">
        <div className="content-well">
          {successMessage && <div className="success-banner animation-fade-in">{successMessage}</div>}
          
          <div className="dashboard-grid-v2">
            
            {/* Primary Appointment Card */}
            <div className="appointment-main">
              <h2 className="section-headline">Up Next</h2>
              {upcomingAppointment ? (
                <Card variant="white" className="apple-card appointment-hero-card" padded={false}>
                  <div className="appointment-hero-content">
                    <div className="appointment-info">
                       <span className="label-medium status-tag">{upcomingAppointment.status}</span>
                       <h3 className="hero-headline small-hero">{upcomingAppointment.services?.name}</h3>
                       <p className="body-intro">
                          {new Date(upcomingAppointment.booking_date).toLocaleDateString(undefined, {
                            weekday: 'long',
                            month: 'long',
                            day: 'numeric'
                          })}
                       </p>
                       <p className="body-medium appointment-time">{upcomingAppointment.booking_time}</p>
                    </div>
                    
                    <div className="appointment-actions">
                       <Button 
                          variant="outline" 
                          className="btn-pill"
                          onClick={() => handleCancelBooking(upcomingAppointment.id)}
                          disabled={cancelLoading === upcomingAppointment.id}
                       >
                          {cancelLoading === upcomingAppointment.id ? 'Processing...' : 'Cancel Visit'}
                       </Button>
                       <Button variant="primary" className="btn-pill" onClick={() => navigate('/services')}>
                          Book New
                       </Button>
                    </div>
                  </div>
                </Card>
              ) : (
                <Card variant="white" className="apple-card empty-appointment" padded={true}>
                  <h3 className="card-title">No upcoming visits</h3>
                  <p className="body-medium">Start your next transformation today.</p>
                  <Button variant="primary" className="btn-pill" onClick={() => navigate('/services')}>
                    Browse Treatments
                  </Button>
                </Card>
              )}

              {/* History Table */}
              <div className="history-section">
                <h2 className="section-headline">Recent Activity</h2>
                <div className="apple-card history-container">
                    {loading ? (
                        <p className="body-medium centered">Locating your records...</p>
                    ) : bookings.length > 0 ? (
                        <div className="history-list-v2">
                            {bookings.slice(0, 5).map(booking => (
                                <div key={booking.id} className="history-row">
                                    <div className="history-main-info">
                                        <span className="body-medium font-bold">{booking.services?.name}</span>
                                        <span className="body-small text-muted">{new Date(booking.booking_date).toLocaleDateString()}</span>
                                    </div>
                                    <span className={`label-medium status-dot ${booking.status}`}>
                                        {booking.status}
                                    </span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="body-medium centered">Your journey starts here.</p>
                    )}
                </div>
              </div>
            </div>

            {/* Sidebar Stats */}
            <aside className="dashboard-sidebar">
              <h2 className="section-headline">Overview</h2>
              <div className="stats-stack">
                <Card variant="white" className="apple-card stat-tile">
                  <span className="label-medium">Total Visits</span>
                  <p className="stat-number">{bookings.length}</p>
                </Card>
                <Card variant="white" className="apple-card stat-tile">
                  <span className="label-medium">Completed</span>
                  <p className="stat-number">{pastBookings.length}</p>
                </Card>
                <div className="support-tile apple-card">
                   <span className="label-medium">Support</span>
                   <p className="body-small">Need help with your plan? Contact our clinical team.</p>
                   <button className="pill-link">Get Help</button>
                </div>
              </div>
            </aside>

          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
