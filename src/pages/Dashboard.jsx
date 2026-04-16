import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import './Dashboard.css';
import Button from '../components/UI/Button/Button';
import { useAuth } from '../contexts/AuthContext';
import { useUserBookings } from '../hooks/useDatabase';
import { cancelBooking } from '../lib/supabase';
import { useTranslation } from 'react-i18next';

const STATUS_COLORS = {
  confirmed: '#34c759',
  pending:   '#ff9500',
  completed: '#007aff',
  cancelled: '#ff3b30',
};

const KpiCard = ({ label, value, sub, accent }) => (
  <div className="kpi-card apple-card">
    <span className="label-medium kpi-label">{label}</span>
    <p className="kpi-value" style={accent ? { color: accent } : {}}>{value}</p>
    {sub && <span className="body-small text-muted">{sub}</span>}
  </div>
);

const MiniChart = ({ bookings }) => {
  const days = useMemo(() => {
    const out = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toISOString().slice(0, 10);
      out.push({ key, label: d.toLocaleDateString(undefined, { weekday: 'short' }), count: 0 });
    }
    bookings.forEach(b => {
      const day = out.find(d => d.key === b.booking_date);
      if (day) day.count++;
    });
    return out;
  }, [bookings]);

  const max = Math.max(...days.map(d => d.count), 1);

  return (
    <div className="mini-chart">
      <div className="mini-chart-bars">
        {days.map(d => (
          <div key={d.key} className="chart-col">
            <div
              className="chart-bar"
              style={{ height: `${(d.count / max) * 100}%` }}
              title={`${d.count} bookings`}
            />
            <span className="chart-label">{d.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const Dashboard = () => {
  const { user, profile, isAuthenticated } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { bookings, loading } = useUserBookings(user?.id);
  const [successMessage, setSuccessMessage] = useState('');
  const [cancelLoading, setCancelLoading] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) { navigate('/login'); return; }
    if (searchParams.get('booking') === 'success') {
      setSuccessMessage(t('dashboard.bookingSuccess', 'Appointment scheduled successfully!'));
      setTimeout(() => setSuccessMessage(''), 5000);
    }
  }, [isAuthenticated, navigate, searchParams, t]);

  const handleCancel = useCallback(async (bookingId) => {
    if (!window.confirm(t('dashboard.cancelConfirm', 'Cancel this booking?'))) return;
    try {
      setCancelLoading(bookingId);
      const { error } = await cancelBooking(bookingId);
      if (error) throw error;
      window.location.reload();
    } catch (err) {
      console.error(err);
    } finally {
      setCancelLoading(null);
    }
  }, [t]);

  const upcoming = useMemo(
    () => bookings.filter(b => b.status !== 'cancelled' && b.status !== 'completed'),
    [bookings]
  );
  const completed = useMemo(() => bookings.filter(b => b.status === 'completed'), [bookings]);
  const nextAppt = upcoming[0] ?? null;
  const firstName = profile?.full_name?.split(' ')[0] || t('dashboard.member', 'Member');

  return (
    <div className="dashboard-page">

      {/* Greeting Hero */}
      <section className="viewport-section section-dark dashboard-hero">
        <div className="content-well dashboard-hero-inner">
          <div>
            <span className="label-medium brand-accent">{t('dashboard.portal', 'Client Portal')}</span>
            <h1 className="hero-headline">
              {t('dashboard.hello', 'Hello')}, <span className="laser-text">{firstName}</span>
            </h1>
            <p className="body-intro hero-muted">{t('dashboard.subtitle', 'Welcome back. Manage your treatments here.')}</p>
          </div>
          <Link to="/book">
            <Button variant="primary" className="btn-pill btn-large">{t('dashboard.newBooking', '+ New Booking')}</Button>
          </Link>
        </div>
      </section>

      <main className="viewport-section section-light dashboard-main">
        <div className="content-well">

          {successMessage && (
            <div className="success-banner">{successMessage}</div>
          )}

          {/* KPI Row */}
          <div className="kpi-row">
            <KpiCard
              label={t('dashboard.totalVisits', 'Total Visits')}
              value={bookings.length}
              sub={t('dashboard.allTime', 'all time')}
            />
            <KpiCard
              label={t('dashboard.upcoming', 'Upcoming')}
              value={upcoming.length}
              accent="var(--logo-orange)"
              sub={t('dashboard.scheduled', 'scheduled')}
            />
            <KpiCard
              label={t('dashboard.completed', 'Completed')}
              value={completed.length}
              accent="var(--logo-purple)"
              sub={t('dashboard.treatments', 'treatments')}
            />
          </div>

          {/* Main Grid */}
          <div className="dashboard-grid">

            {/* Left: Next + History */}
            <div className="dashboard-col-main">

              {/* Next Appointment */}
              <div className="dash-section">
                <h2 className="dash-section-title">{t('dashboard.upNext', 'Up Next')}</h2>
                {loading ? (
                  <div className="apple-card skeleton-card" />
                ) : nextAppt ? (
                  <div className="apple-card appt-card">
                    <div className="appt-card-inner">
                      <div className="appt-info">
                        <span
                          className="appt-status-dot"
                          style={{ background: STATUS_COLORS[nextAppt.status] ?? '#999' }}
                        />
                        <div>
                          <h3 className="appt-name">{nextAppt.services?.name ?? t('dashboard.treatment', 'Treatment')}</h3>
                          <p className="appt-date body-medium">
                            {new Date(nextAppt.booking_date).toLocaleDateString(undefined, {
                              weekday: 'long', month: 'long', day: 'numeric'
                            })}
                            {nextAppt.booking_time && ` · ${nextAppt.booking_time}`}
                          </p>
                          <span className={`status-badge status-${nextAppt.status}`}>{nextAppt.status}</span>
                        </div>
                      </div>
                      <div className="appt-actions">
                        <Button
                          variant="outline"
                          className="btn-pill"
                          onClick={() => handleCancel(nextAppt.id)}
                          disabled={cancelLoading === nextAppt.id}
                        >
                          {cancelLoading === nextAppt.id ? '...' : t('dashboard.cancel', 'Cancel')}
                        </Button>
                        <Button variant="primary" className="btn-pill" onClick={() => navigate('/services')}>
                          {t('dashboard.bookNew', 'Book New')}
                        </Button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="apple-card empty-appt">
                    <p className="card-title">{t('dashboard.noUpcoming', 'No upcoming visits')}</p>
                    <p className="body-medium text-muted">{t('dashboard.startJourney', 'Start your next transformation today.')}</p>
                    <Button variant="primary" className="btn-pill" onClick={() => navigate('/services')}>
                      {t('dashboard.browse', 'Browse Treatments')}
                    </Button>
                  </div>
                )}
              </div>

              {/* Activity History */}
              <div className="dash-section">
                <h2 className="dash-section-title">{t('dashboard.recentActivity', 'Recent Activity')}</h2>
                <div className="apple-card history-card">
                  {loading ? (
                    <p className="body-medium text-muted">{t('dashboard.loading', 'Loading...')}</p>
                  ) : bookings.length > 0 ? (
                    bookings.slice(0, 6).map(b => (
                      <div key={b.id} className="history-row">
                        <div className="history-info">
                          <span className="body-medium history-name">{b.services?.name ?? '—'}</span>
                          <span className="body-small text-muted">
                            {new Date(b.booking_date).toLocaleDateString()}
                          </span>
                        </div>
                        <span
                          className="status-badge"
                          style={{ color: STATUS_COLORS[b.status] ?? '#999' }}
                        >
                          {b.status}
                        </span>
                      </div>
                    ))
                  ) : (
                    <p className="body-medium text-muted">{t('dashboard.noHistory', 'Your journey starts here.')}</p>
                  )}
                </div>
              </div>

            </div>

            {/* Right: Chart + Support */}
            <aside className="dashboard-col-side">

              <div className="dash-section">
                <h2 className="dash-section-title">{t('dashboard.activity7d', 'Activity — 7 Days')}</h2>
                <div className="apple-card chart-card">
                  <MiniChart bookings={bookings} />
                </div>
              </div>

              <div className="dash-section">
                <div className="apple-card support-card">
                  <span className="label-medium brand-accent">{t('dashboard.support', 'Support')}</span>
                  <p className="body-medium">{t('dashboard.supportText', 'Need help? Our clinical team is always here.')}</p>
                  <a href="tel:0770300173" className="pill-link">{t('dashboard.callUs', 'Call Us')}</a>
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
