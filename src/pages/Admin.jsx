import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './Admin.css';
import { useAuth } from '../contexts/AuthContext';
import {
  getAdminBookings, getAdminServices, getAdminProfiles,
  getAdminExperiences, getDoctors, getHolidays, getGallery,
  updateBooking, createService, updateService, deleteService,
  updateExperienceStatus, deleteDoctor, createDoctor, updateDoctor,
  addHoliday, deleteHoliday, uploadImage, createGalleryItem, deleteGalleryItem
} from '../lib/supabase';

const CATEGORIES = ['Laser', 'Injectables', 'Body', 'Anti-Aging', 'Skin Care', 'Hair'];
const STATUSES = ['pending', 'confirmed', 'completed', 'cancelled'];

const STATUS_COLORS = {
  pending:   { bg: '#fff7e6', color: '#b45309' },
  confirmed: { bg: '#e8f5e9', color: '#2e7d32' },
  completed: { bg: '#e8eaf6', color: '#3949ab' },
  cancelled: { bg: '#fce4ec', color: '#c62828' },
};

const EMPTY_SERVICE = {
  name: '', name_ar: '', description: '', description_ar: '',
  price: '', duration_minutes: '', category: 'Laser', is_active: true,
};

const EMPTY_DOCTOR = {
  name: '', name_ar: '', specialty: '', specialty_ar: '',
  bio: '', bio_ar: '', image_url: '',
};

const StatusBadge = ({ status }) => {
  const { t } = useTranslation();
  const style = STATUS_COLORS[status] || STATUS_COLORS.pending;
  return (
    <span className="status-badge" style={style}>
      {t(`dashboard.status${status.charAt(0).toUpperCase() + status.slice(1)}`, status)}
    </span>
  );
};

const Admin = () => {
  const { t, i18n } = useTranslation();
  const { isAuthenticated, isAdmin, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const isAr = i18n.language === 'ar';

  const [tab, setTab] = useState('bookings');
  const [data, setData] = useState({
    bookings: [], services: [], profiles: [],
    experiences: [], doctors: [], holidays: [], gallery: []
  });
  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState(null);

  // Filters & Search
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');

  // Modals & Actions
  const [modal, setModal] = useState({ open: false, mode: 'create', type: 'service', data: null });
  const [saving, setSaving] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null);

  useEffect(() => {
    if (authLoading) return;
    if (!isAuthenticated || !isAdmin) navigate('/');
  }, [isAuthenticated, isAdmin, authLoading, navigate]);

  const loadData = useCallback(async () => {
    if (!isAdmin) return;
    setLoadingData(true);
    try {
      const results = await Promise.all([
        getAdminBookings(), getAdminServices(), getAdminProfiles(),
        getAdminExperiences(), getDoctors(), getHolidays(), getGallery()
      ]);
      
      const [b, s, p, e, d, h, g] = results;
      setData({
        bookings: b.data || [], services: s.data || [], profiles: p.data || [],
        experiences: e.data || [], doctors: d.data || [], holidays: h.data || [],
        gallery: g.data || []
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoadingData(false);
    }
  }, [isAdmin]);

  useEffect(() => {
    // Real-time listener for new bookings
    const channel = supabase
      .channel('admin-bookings-realtime')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'bookings' },
        (payload) => {
          // Toast or simple notification logic can go here
          console.log('New booking received!', payload);
          loadData(); // Refresh data to update stats and table
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [loadData]);

  useEffect(() => { loadData(); }, [loadData]);

  // Derived Data
  const filteredData = useMemo(() => {
    const q = search.toLowerCase();
    switch (tab) {
      case 'bookings':
        return data.bookings.filter(b => 
          (filter === 'all' || b.status === filter) &&
          (b.profiles?.full_name?.toLowerCase().includes(q) || b.services?.name?.toLowerCase().includes(q))
        );
      case 'services':
        return data.services.filter(s => 
          (filter === 'all' || s.category === filter) &&
          (s.name?.toLowerCase().includes(q) || s.name_ar?.includes(q))
        );
      case 'gallery':
        return data.gallery.filter(g => filter === 'all' || g.category === filter);
      default:
        return [];
    }
  }, [tab, data, search, filter]);

  // Action Handlers
  const handleStatusChange = async (id, status) => {
    const { error } = await updateBooking(id, { status });
    if (!error) loadData();
  };

  const handleModeration = async (id, status) => {
    const { error } = await updateExperienceStatus(id, status);
    if (!error) loadData();
  };

  const handleFileUpload = async (e, type) => {
    const file = e.target.files[0];
    if (!file) return;
    setSaving(true);
    const { data: upload, error } = await uploadImage(file);
    if (!error) {
      if (type === 'gallery') {
        await createGalleryItem({ image_url: upload.publicUrl, category: 'Clinic', title: 'New Photo' });
      } else if (type === 'doctor') {
        handleModalChange('image_url', upload.publicUrl);
      }
      loadData();
    }
    setSaving(false);
  };

  const handleSave = async () => {
    setSaving(true);
    let res;
    if (modal.type === 'service') {
      const payload = { ...modal.data, price: parseFloat(modal.data.price), duration_minutes: parseInt(modal.data.duration_minutes) };
      res = modal.mode === 'create' ? await createService(payload) : await updateService(modal.data.id, payload);
    } else if (modal.type === 'doctor') {
      res = modal.mode === 'create' ? await createDoctor(modal.data) : await updateDoctor(modal.data.id, modal.data);
    } else if (modal.type === 'holiday') {
      res = await addHoliday(modal.data);
    }
    
    if (!res.error) {
      loadData();
      setModal({ ...modal, open: false });
    }
    setSaving(false);
  };

  const handleDelete = async () => {
    if (!confirmDelete) return;
    let err;
    if (confirmDelete.type === 'service') err = (await deleteService(confirmDelete.id)).error;
    else if (confirmDelete.type === 'doctor') err = (await deleteDoctor(confirmDelete.id)).error;
    else if (confirmDelete.type === 'holiday') err = (await deleteHoliday(confirmDelete.id)).error;
    else if (confirmDelete.type === 'gallery') err = (await deleteGalleryItem(confirmDelete.id)).error;
    
    if (!err) loadData();
    setConfirmDelete(null);
  };

  const handleModalChange = (field, value) => {
    setModal(m => ({ ...m, data: { ...m.data, [field]: value } }));
  };

  if (authLoading || !isAdmin) return null;

  const stats = {
    revenue: data.bookings.filter(b => b.status === 'completed').reduce((acc, b) => acc + (b.services?.price || 0), 0),
    appointments: data.bookings.length,
    patients: data.profiles.length,
    pending: data.bookings.filter(b => b.status === 'pending').length
  };

  return (
    <div className="admin-page">
      <div className="admin-hero">
        <div className="content-well">
          <h1 className="section-headline">{t('admin.title')}</h1>
          <p className="body-medium admin-subtitle">{t('admin.subtitle')}</p>
        </div>
      </div>

      <div className="content-well">
        <div className="admin-kpi-row">
          <div className="admin-kpi"><span className="kpi-val">{stats.revenue} JD</span><span className="kpi-label">{t('admin.tabAnalytics')}</span></div>
          <div className="admin-kpi"><span className="kpi-val">{stats.appointments}</span><span className="kpi-label">{t('admin.kpiTotal')}</span></div>
          <div className="admin-kpi kpi-pending"><span className="kpi-val">{stats.pending}</span><span className="kpi-label">{t('admin.kpiPending')}</span></div>
          <div className="admin-kpi"><span className="kpi-val">{stats.patients}</span><span className="kpi-label">{t('admin.tabPatients')}</span></div>
        </div>

        <div className="admin-tabs scroll-x">
          {['bookings', 'services', 'patients', 'gallery', 'experiences', 'doctors', 'schedule', 'analytics'].map(tKey => (
            <button 
              key={tKey} 
              className={`admin-tab ${tab === tKey ? 'active' : ''}`} 
              onClick={() => { setTab(tKey); setSearch(''); setFilter('all'); }}
            >
              {t(`admin.tab${tKey.charAt(0).toUpperCase() + tKey.slice(1)}`)}
              {tKey === 'bookings' && stats.pending > 0 && (
                <span className="tab-badge">{stats.pending}</span>
              )}
            </button>
          ))}
        </div>

        {error && <p className="error-banner">{error}</p>}
        {loadingData ? (
          <div className="admin-loading"><div className="laser-spinner"></div></div>
        ) : (
          <div className="admin-content animation-fade-in">
            {/* BOOKINGS TAB */}
            {tab === 'bookings' && (
              <div className="admin-section">
                <div className="admin-toolbar">
                  <input className="admin-search" placeholder={t('admin.searchBookings')} value={search} onChange={e => setSearch(e.target.value)} />
                  <div className="admin-filter-pills">
                    {['all', ...STATUSES].map(s => (
                      <button key={s} className={`filter-pill ${filter === s ? 'active' : ''}`} onClick={() => setFilter(s)}>
                        {s === 'all' ? t('admin.filterAll') : t(`dashboard.status${s.charAt(0).toUpperCase() + s.slice(1)}`, s)}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="admin-table-wrapper">
                  <table className="admin-table">
                    <thead><tr><th>{t('admin.colPatient')}</th><th>{t('admin.colTreatment')}</th><th>{t('admin.colDate')}</th><th>{t('admin.colStatus')}</th><th>{t('admin.colAction')}</th></tr></thead>
                    <tbody>
                      {filteredData.map(b => (
                        <tr key={b.id}>
                          <td>{b.profiles?.full_name}<br/><small>{b.profiles?.email}</small></td>
                          <td>{isAr ? b.services?.name_ar : b.services?.name}</td>
                          <td>{b.booking_date} {b.booking_time}</td>
                          <td><StatusBadge status={b.status} /></td>
                          <td>
                            <select className="status-select" value={b.status} onChange={e => handleStatusChange(b.id, e.target.value)}>
                              {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* SERVICES TAB */}
            {tab === 'services' && (
              <div className="admin-section">
                <div className="admin-toolbar">
                  <input className="admin-search" placeholder={t('admin.searchServices')} value={search} onChange={e => setSearch(e.target.value)} />
                  <button className="btn btn-primary" onClick={() => setModal({ open: true, mode: 'create', type: 'service', data: EMPTY_SERVICE })}>+ {t('admin.addService')}</button>
                </div>
                <div className="admin-table-wrapper">
                  <table className="admin-table">
                    <thead><tr><th>{t('admin.colName')}</th><th>{t('admin.colCategory')}</th><th>{t('admin.colPrice')}</th><th>{t('admin.colActions')}</th></tr></thead>
                    <tbody>
                      {filteredData.map(s => (
                        <tr key={s.id}>
                          <td>{isAr ? s.name_ar : s.name}</td>
                          <td>{s.category}</td>
                          <td>{s.price} JD</td>
                          <td className="action-cell">
                            <button className="action-btn edit" onClick={() => setModal({ open: true, mode: 'edit', type: 'service', data: s })}>{t('admin.edit')}</button>
                            <button className="action-btn delete" onClick={() => setConfirmDelete({ id: s.id, type: 'service', name: s.name })}>{t('admin.delete')}</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* PATIENTS TAB */}
            {tab === 'patients' && (
              <div className="admin-section">
                <div className="admin-table-wrapper">
                  <table className="admin-table">
                    <thead><tr><th>{t('admin.colPatient')}</th><th>{t('admin.colJoined')}</th><th>{t('admin.colVisits')}</th><th>{t('admin.colStatus')}</th></tr></thead>
                    <tbody>
                      {data.profiles.map(p => (
                        <tr key={p.id}>
                          <td>{p.full_name}<br/><small>{p.email}</small></td>
                          <td>{new Date(p.created_at).toLocaleDateString()}</td>
                          <td>{p.bookings?.[0]?.count || 0}</td>
                          <td><span className={`active-dot ${p.role === 'admin' ? 'on' : 'off'}`}></span> {p.role}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* GALLERY TAB */}
            {tab === 'gallery' && (
              <div className="admin-section">
                <div className="admin-toolbar">
                  <label className="btn btn-primary cursor-pointer">
                    + {t('admin.addPhoto')}
                    <input type="file" className="hidden" onChange={e => handleFileUpload(e, 'gallery')} accept="image/*" />
                  </label>
                </div>
                <div className="admin-gallery-grid">
                  {data.gallery.map(g => (
                    <div key={g.id} className="admin-gallery-item">
                      <img src={g.image_url} alt="" />
                      <button className="gallery-delete" onClick={() => setConfirmDelete({ id: g.id, type: 'gallery', name: 'Photo' })}>×</button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* EXPERIENCES TAB */}
            {tab === 'experiences' && (
              <div className="admin-section">
                <div className="admin-table-wrapper">
                  <table className="admin-table">
                    <thead><tr><th>{t('admin.colPatient')}</th><th>{t('admin.colReview')}</th><th>{t('admin.colStatus')}</th><th>{t('admin.colAction')}</th></tr></thead>
                    <tbody>
                      {data.experiences.map(ex => (
                        <tr key={ex.id}>
                          <td>{ex.profiles?.full_name}</td>
                          <td><div className="cell-review">{ex.comment}</div></td>
                          <td>{ex.status || 'pending'}</td>
                          <td className="action-cell">
                            <button className="action-btn edit" onClick={() => handleModeration(ex.id, 'approved')}>{t('admin.actionApprove')}</button>
                            <button className="action-btn delete" onClick={() => handleModeration(ex.id, 'hidden')}>{t('admin.actionHide')}</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* DOCTORS TAB */}
            {tab === 'doctors' && (
              <div className="admin-section">
                <div className="admin-toolbar">
                  <button className="btn btn-primary" onClick={() => setModal({ open: true, mode: 'create', type: 'doctor', data: EMPTY_DOCTOR })}>+ {t('admin.addDoctor')}</button>
                </div>
                <div className="admin-table-wrapper">
                  <table className="admin-table">
                    <thead><tr><th>{t('admin.colImage')}</th><th>{t('admin.colName')}</th><th>{t('admin.colActions')}</th></tr></thead>
                    <tbody>
                      {data.doctors.map(d => (
                        <tr key={d.id}>
                          <td><img src={d.image_url} className="admin-avatar" alt="" /></td>
                          <td>{isAr ? d.name_ar : d.name}<br/><small>{isAr ? d.specialty_ar : d.specialty}</small></td>
                          <td className="action-cell">
                            <button className="action-btn edit" onClick={() => setModal({ open: true, mode: 'edit', type: 'doctor', data: d })}>{t('admin.edit')}</button>
                            <button className="action-btn delete" onClick={() => setConfirmDelete({ id: d.id, type: 'doctor', name: d.name })}>{t('admin.delete')}</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* SCHEDULE TAB */}
            {tab === 'schedule' && (
              <div className="admin-section">
                <div className="admin-toolbar">
                  <button className="btn btn-primary" onClick={() => setModal({ open: true, mode: 'create', type: 'holiday', data: { holiday_date: '' } })}>+ {t('admin.addHoliday')}</button>
                </div>
                <div className="admin-table-wrapper">
                  <table className="admin-table">
                    <thead><tr><th>{t('admin.colDate')}</th><th>{t('admin.colActions')}</th></tr></thead>
                    <tbody>
                      {data.holidays.map(h => (
                        <tr key={h.id}>
                          <td>{h.holiday_date}</td>
                          <td className="action-cell">
                            <button className="action-btn delete" onClick={() => setConfirmDelete({ id: h.id, type: 'holiday', name: h.holiday_date })}>{t('admin.delete')}</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
            {/* ANALYTICS TAB */}
            {tab === 'analytics' && (
              <div className="admin-section">
                <h3 className="card-title" style={{ marginBottom: '1.5rem' }}>{t('admin.tabAnalytics')} Reporting</h3>
                <div className="modal-grid" style={{ marginBottom: '2rem' }}>
                  <div className="admin-kpi" style={{ border: '1px solid var(--outline-variant)' }}>
                    <span className="kpi-label">Efficiency</span>
                    <span className="kpi-val">94%</span>
                  </div>
                  <div className="admin-kpi" style={{ border: '1px solid var(--outline-variant)' }}>
                    <span className="kpi-label">New Patients</span>
                    <span className="kpi-val">+12%</span>
                  </div>
                </div>

                <div className="analytics-charts-grid" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
                  <div className="chart-well" style={{ background: '#f8f9fa', padding: '1.5rem', borderRadius: '1rem' }}>
                    <h4 className="label-medium" style={{ marginBottom: '1rem' }}>Revenue Trends (6 Months)</h4>
                    <svg viewBox="0 0 400 120" style={{ width: '100%', height: 'auto' }}>
                      <rect x="10" y="40" width="30" height="70" fill="var(--logo-pink)" opacity="0.8" rx="4" />
                      <rect x="50" y="60" width="30" height="50" fill="var(--logo-pink)" opacity="0.8" rx="4" />
                      <rect x="90" y="30" width="30" height="80" fill="var(--logo-pink)" opacity="0.8" rx="4" />
                      <rect x="130" y="50" width="30" height="60" fill="var(--logo-pink)" opacity="0.8" rx="4" />
                      <rect x="170" y="20" width="30" height="90" fill="var(--logo-pink)" opacity="0.8" rx="4" />
                      <rect x="210" y="10" width="30" height="100" fill="var(--logo-pink)" rx="4" />
                      <line x1="0" y1="110" x2="400" y2="110" stroke="#ddd" />
                    </svg>
                  </div>
                  <div className="chart-well" style={{ background: '#f8f9fa', padding: '1.5rem', borderRadius: '1rem' }}>
                    <h4 className="label-medium" style={{ marginBottom: '1rem' }}>Appointment Volume</h4>
                    <div className="sparkline" style={{ height: '80px', display: 'flex', alignItems: 'flex-end', gap: '4px' }}>
                      {[4, 7, 5, 9, 12, 8, 11].map((h, i) => (
                        <div key={i} style={{ flex: 1, height: `${h * 8}%`, background: 'var(--near-black)', borderRadius: '2px 2px 0 0' }} />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {modal.open && (
        <div className="admin-modal-overlay" onClick={() => setModal({ ...modal, open: false })}>
          <div className="admin-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="card-title">{modal.type.toUpperCase()}</h2>
              <button className="modal-close" onClick={() => setModal({ ...modal, open: false })}>×</button>
            </div>
            <div className="modal-body">
              {modal.type === 'service' && (
                <div className="modal-grid">
                  <label className="modal-field"><span>Name (EN)</span><input value={modal.data.name} onChange={e => handleModalChange('name', e.target.value)} /></label>
                  <label className="modal-field"><span>Name (AR)</span><input value={modal.data.name_ar} onChange={e => handleModalChange('name_ar', e.target.value)} dir="rtl" /></label>
                  <label className="modal-field"><span>Price</span><input type="number" value={modal.data.price} onChange={e => handleModalChange('price', e.target.value)} /></label>
                  <label className="modal-field"><span>Duration</span><input type="number" value={modal.data.duration_minutes} onChange={e => handleModalChange('duration_minutes', e.target.value)} /></label>
                  <label className="modal-field"><span>Category</span>
                    <select value={modal.data.category} onChange={e => handleModalChange('category', e.target.value)}>
                      {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </label>
                </div>
              )}
              {modal.type === 'doctor' && (
                <div className="modal-grid">
                  <label className="modal-field"><span>Name (EN)</span><input value={modal.data.name} onChange={e => handleModalChange('name', e.target.value)} /></label>
                  <label className="modal-field"><span>Name (AR)</span><input value={modal.data.name_ar} onChange={e => handleModalChange('name_ar', e.target.value)} dir="rtl" /></label>
                  <label className="modal-field"><span>Specialty (EN)</span><input value={modal.data.specialty} onChange={e => handleModalChange('specialty', e.target.value)} /></label>
                  <label className="modal-field"><span>Image</span><input type="file" onChange={e => handleFileUpload(e, 'doctor')} /></label>
                  {modal.data.image_url && <img src={modal.data.image_url} alt="" className="preview-img" />}
                </div>
              )}
              {modal.type === 'holiday' && (
                <div className="modal-grid">
                  <label className="modal-field"><span>Date</span><input type="date" value={modal.data.holiday_date} onChange={e => handleModalChange('holiday_date', e.target.value)} /></label>
                </div>
              )}
            </div>
            <div className="modal-footer">
              <button className="btn btn-primary" onClick={handleSave} disabled={saving}>{saving ? 'Saving...' : 'Save'}</button>
            </div>
          </div>
        </div>
      )}

      {confirmDelete && (
        <div className="admin-modal-overlay" onClick={() => setConfirmDelete(null)}>
          <div className="admin-modal admin-modal-sm">
            <div className="modal-header"><h3 className="card-title">Confirm Delete</h3></div>
            <div className="modal-body"><p>Delete {confirmDelete.name}?</p></div>
            <div className="modal-footer">
              <button className="btn btn-danger" onClick={handleDelete}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;
