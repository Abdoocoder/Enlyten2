import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import './Dashboard.css';
import Card from '../components/UI/Card/Card';
import Button from '../components/UI/Button/Button';
import { useAuth } from '../contexts/AuthContext';
import { useUserBookings } from '../hooks/useDatabase';
import { cancelBooking } from '../lib/supabase';

const Dashboard = () => {
  const { user, profile, isAuthenticated } = useAuth();
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
      setSuccessMessage('Booking created successfully!');
      setTimeout(() => setSuccessMessage(''), 5000);
    }
  }, [isAuthenticated, navigate, searchParams]);

  const handleCancelBooking = async (bookingId) => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      try {
        setCancelLoading(bookingId);
        const { error: cancelError } = await cancelBooking(bookingId);
        if (cancelError) throw cancelError;
        // Refresh bookings
        window.location.reload();
      } catch (err) {
        console.error('Cancel booking error:', err);
      } finally {
        setCancelLoading(null);
      }
    }
  };

  // Get upcoming bookings
  const upcomingBookings = bookings.filter(b => b.status !== 'cancelled' && b.status !== 'completed');
  const upcomingAppointment = upcomingBookings.length > 0 ? upcomingBookings[0] : null;

  // Get past bookings
  const pastBookings = bookings.filter(b => b.status === 'completed');

  const initials = (profile?.full_name || 'U')
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="dashboard-page page-container">
      <header className="dashboard-header section">
        <h1 className="headline-medium">Hello, {profile?.full_name || 'Welcome'}</h1>
        <p className="body-large">Welcome back to your luminous journey.</p>
      </header>

      {successMessage && (
        <div className="success-message" style={{marginBottom: 'var(--spacing-lg)'}}>
          {successMessage}
        </div>
      )}

      <div className="dashboard-grid section">
        {/* Upcoming Appointment */}
        {upcomingAppointment ? (
          <Card variant="white" className="dashboard-card main-card">
            <div className="card-header">
              <h2 className="headline-small">Upcoming Appointment</h2>
              <span className="label-medium status-badge">{upcomingAppointment.status}</span>
            </div>
            <div className="appointment-detail">
              <h3 className="headline-small">{upcomingAppointment.services?.name}</h3>
              <p className="body-medium">
                {new Date(upcomingAppointment.booking_date).toLocaleDateString('en-US', {
                  weekday: 'long',
                  month: 'short',
                  day: 'numeric'
                })} • {upcomingAppointment.booking_time}
              </p>
              {upcomingAppointment.notes && (
                <p className="body-small text-muted">Notes: {upcomingAppointment.notes}</p>
              )}
            </div>
            <div className="card-actions">
              <Button 
                variant="secondary"
                onClick={() => handleCancelBooking(upcomingAppointment.id)}
                disabled={cancelLoading === upcomingAppointment.id}
              >
                {cancelLoading === upcomingAppointment.id ? 'Cancelling...' : 'Cancel'}
              </Button>
              <Button variant="primary" onClick={() => navigate('/services')}>
                Book Another
              </Button>
            </div>
          </Card>
        ) : (
          <Card variant="white" className="dashboard-card main-card">
            <h2 className="headline-small">No Upcoming Appointments</h2>
            <p className="body-medium">You don't have any upcoming appointments yet.</p>
            <div className="card-actions">
              <Button variant="primary" onClick={() => navigate('/services')}>
                Book an Appointment
              </Button>
            </div>
          </Card>
        )}

        {/* Quick Stats */}
        <div className="stats-column">
          <Card variant="tonal" className="stat-card">
            <span className="label-medium">Total Bookings</span>
            <p className="display-small">{bookings.length}</p>
          </Card>
          <Card variant="tonal" className="stat-card">
            <span className="label-medium">Completed</span>
            <p className="display-small">{pastBookings.length}</p>
          </Card>
        </div>

        {/* Booking History */}
        <Card variant="white" className="dashboard-card full-width">
          <h2 className="headline-small">All Bookings</h2>
          {error && <p className="error-message">{error}</p>}
          {loading ? (
            <p className="body-medium">Loading bookings...</p>
          ) : bookings.length > 0 ? (
            <div className="history-list">
              {bookings.map(booking => (
                <div key={booking.id} className="history-item">
                  <div className="history-info">
                    <h4 className="body-large">{booking.services?.name}</h4>
                    <p className="body-small text-muted">
                      {new Date(booking.booking_date).toLocaleDateString()} at {booking.booking_time}
                    </p>
                  </div>
                  <div className="history-result">
                    <span className={`label-medium status-${booking.status}`}>
                      {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="body-medium">No bookings yet.</p>
          )}
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
