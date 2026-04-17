import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './Admin.css';
import { useAuth } from '../contexts/AuthContext';
import {
  getAdminBookings, getAdminServices,
  updateBooking, createService, updateService, deleteService,
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
  const [bookings, setBookings] = useState([]);
  const [services, setServices] = useState([]);
  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState(null);

  const [bookingSearch, setBookingSearch] = useState('');
  const [bookingStatus, setBookingStatus] = useState('all');
  const [serviceSearch, setServiceSearch] = useState('');
  const [serviceCategory, setServiceCategory] = useState('all');

  const [modal, setModal] = useState({ open: false, mode: 'create', data: EMPTY_SERVICE });
  const [saving, setSaving] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null);

  useEffect(() => {
    if (authLoading) return;
    if (!isAuthenticated || !isAdmin) navigate('/');
  }, [isAuthenticated, isAdmin, authLoading, navigate]);

  useEffect(() => {
    if (!isAdmin) return;
    const load = async () => {
      setLoadingData(true);
      const [bRes, sRes] = await Promise.all([getAdminBookings(), getAdminServices()]);
      if (bRes.error) setError(bRes.error.message);
      else setBookings(bRes.data || []);
      if (sRes.error) setError(sRes.error.message);
      else setServices(sRes.data || []);
      setLoadingData(false);
    };
    load();
  }, [isAdmin]);

  const filteredBookings = useMemo(() => {
    let list = bookings;
    if (bookingStatus !== 'all') list = list.filter(b => b.status === bookingStatus);
    if (bookingSearch) {
      const q = bookingSearch.toLowerCase();
      list = list.filter(b =>
        b.profiles?.full_name?.toLowerCase().includes(q) ||
        b.profiles?.email?.toLowerCase().includes(q) ||
        b.services?.name?.toLowerCase().includes(q)
      );
    }
    return list;
  }, [bookings, bookingSearch, bookingStatus]);

  const filteredServices = useMemo(() => {
    let list = services;
    if (serviceCategory !== 'all') list = list.filter(s => s.category === serviceCategory);
    if (serviceSearch) {
      const q = serviceSearch.toLowerCase();
      list = list.filter(s =>
        s.name?.toLowerCase().includes(q) ||
        s.name_ar?.toLowerCase().includes(q)
      );
    }
    return list;
  }, [services, serviceSearch, serviceCategory]);

  const handleStatusChange = useCallback(async (bookingId, newStatus) => {
    const { error } = await updateBooking(bookingId, { status: newStatus });
    if (!error) {
      setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status: newStatus } : b));
    }
  }, []);

  const openCreate = () => setModal({ open: true, mode: 'create', data: { ...EMPTY_SERVICE } });
  const openEdit = (service) => setModal({ open: true, mode: 'edit', data: { ...service } });
  const closeModal = () => setModal(m => ({ ...m, open: false }));

  const handleModalChange = (field, value) => {
    setModal(m => ({ ...m, data: { ...m.data, [field]: value } }));
  };

  const handleSaveService = async () => {
    setSaving(true);
    const payload = {
      ...modal.data,
      price: parseFloat(modal.data.price) || 0,
      duration_minutes: parseInt(modal.data.duration_minutes) || null,
    };
    if (modal.mode === 'create') {
      const { data, error } = await createService(payload);
      if (!error && data?.[0]) setServices(prev => [...prev, data[0]]);
    } else {
      const { data, error } = await updateService(modal.data.id, payload);
      if (!error && data?.[0]) {
        setServices(prev => prev.map(s => s.id === modal.data.id ? data[0] : s));
      }
    }
    setSaving(false);
    closeModal();
  };

  const handleDelete = async () => {
    if (!confirmDelete) return;
    const { error } = await deleteService(confirmDelete.id);
    if (!error) setServices(prev => prev.filter(s => s.id !== confirmDelete.id));
    setConfirmDelete(null);
  };

  if (authLoading || !isAdmin) return null;

  const stats = {
    total: bookings.length,
    pending: bookings.filter(b => b.status === 'pending').length,
    confirmed: bookings.filter(b => b.status === 'confirmed').length,
    completed: bookings.filter(b => b.status === 'completed').length,
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
          <div className="admin-kpi"><span className="kpi-val">{stats.total}</span><span className="kpi-label">{t('admin.kpiTotal')}</span></div>
          <div className="admin-kpi kpi-pending"><span className="kpi-val">{stats.pending}</span><span className="kpi-label">{t('admin.kpiPending')}</span></div>
          <div className="admin-kpi kpi-confirmed"><span className="kpi-val">{stats.confirmed}</span><span className="kpi-label">{t('admin.kpiConfirmed')}</span></div>
          <div className="admin-kpi kpi-completed"><span className="kpi-val">{stats.completed}</span><span className="kpi-label">{t('admin.kpiCompleted')}</span></div>
          <div className="admin-kpi"><span className="kpi-val">{services.length}</span><span className="kpi-label">{t('admin.kpiServices')}</span></div>
        </div>

        <div className="admin-tabs">
          <button className={`admin-tab ${tab === 'bookings' ? 'active' : ''}`} onClick={() => setTab('bookings')}>
            {t('admin.tabBookings')}
          </button>
          <button className={`admin-tab ${tab === 'services' ? 'active' : ''}`} onClick={() => setTab('services')}>
            {t('admin.tabServices')}
          </button>
        </div>

        {error && <p className="error-banner">{error}</p>}
        {loadingData && <div className="admin-loading"><div className="laser-spinner"></div></div>}

        {!loadingData && tab === 'bookings' && (
          <div className="admin-section">
            <div className="admin-toolbar">
              <input
                className="admin-search"
                placeholder={t('admin.searchBookings')}
                value={bookingSearch}
                onChange={e => setBookingSearch(e.target.value)}
              />
              <div className="admin-filter-pills">
                {['all', ...STATUSES].map(s => (
                  <button
                    key={s}
                    className={`filter-pill ${bookingStatus === s ? 'active' : ''}`}
                    onClick={() => setBookingStatus(s)}
                  >
                    {s === 'all' ? t('admin.filterAll') : t(`dashboard.status${s.charAt(0).toUpperCase() + s.slice(1)}`, s)}
                  </button>
                ))}
              </div>
            </div>

            <div className="admin-table-wrapper">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>{t('admin.colPatient')}</th>
                    <th>{t('admin.colTreatment')}</th>
                    <th>{t('admin.colDate')}</th>
                    <th>{t('admin.colTime')}</th>
                    <th>{t('admin.colStatus')}</th>
                    <th>{t('admin.colAction')}</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBookings.length === 0 && (
                    <tr><td colSpan={6} className="admin-empty">{t('admin.noBookings')}</td></tr>
                  )}
                  {filteredBookings.map(b => (
                    <tr key={b.id}>
                      <td>
                        <div className="cell-primary">{b.profiles?.full_name || '—'}</div>
                        <div className="cell-secondary">{b.profiles?.email || '—'}</div>
                      </td>
                      <td>{isAr ? (b.services?.name_ar || b.services?.name) : b.services?.name || '—'}</td>
                      <td>{b.booking_date}</td>
                      <td>{b.booking_time}</td>
                      <td><StatusBadge status={b.status} /></td>
                      <td>
                        <select
                          className="status-select"
                          value={b.status}
                          onChange={e => handleStatusChange(b.id, e.target.value)}
                        >
                          {STATUSES.map(s => (
                            <option key={s} value={s}>
                              {t(`dashboard.status${s.charAt(0).toUpperCase() + s.slice(1)}`, s)}
                            </option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {!loadingData && tab === 'services' && (
          <div className="admin-section">
            <div className="admin-toolbar">
              <input
                className="admin-search"
                placeholder={t('admin.searchServices')}
                value={serviceSearch}
                onChange={e => setServiceSearch(e.target.value)}
              />
              <div className="admin-filter-pills">
                <button className={`filter-pill ${serviceCategory === 'all' ? 'active' : ''}`} onClick={() => setServiceCategory('all')}>
                  {t('admin.filterAll')}
                </button>
                {CATEGORIES.map(c => (
                  <button key={c} className={`filter-pill ${serviceCategory === c ? 'active' : ''}`} onClick={() => setServiceCategory(c)}>
                    {t(`categories.${c}`, c)}
                  </button>
                ))}
              </div>
              <button className="btn btn-primary admin-add-btn" onClick={openCreate}>
                + {t('admin.addService')}
              </button>
            </div>

            <div className="admin-table-wrapper">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>{t('admin.colName')}</th>
                    <th>{t('admin.colCategory')}</th>
                    <th>{t('admin.colPrice')}</th>
                    <th>{t('admin.colDuration')}</th>
                    <th>{t('admin.colActive')}</th>
                    <th>{t('admin.colActions')}</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredServices.length === 0 && (
                    <tr><td colSpan={6} className="admin-empty">{t('admin.noServices')}</td></tr>
                  )}
                  {filteredServices.map(s => (
                    <tr key={s.id}>
                      <td>
                        <div className="cell-primary">{s.name}</div>
                        {s.name_ar && <div className="cell-secondary">{s.name_ar}</div>}
                      </td>
                      <td><span className="category-tag">{t(`categories.${s.category}`, s.category)}</span></td>
                      <td>{s.price} JD</td>
                      <td>{s.duration_minutes ? `${s.duration_minutes} ${t('services.min')}` : '—'}</td>
                      <td>
                        <span className={`active-dot ${s.is_active ? 'on' : 'off'}`}></span>
                      </td>
                      <td className="action-cell">
                        <button className="action-btn edit" onClick={() => openEdit(s)}>{t('admin.edit')}</button>
                        <button className="action-btn delete" onClick={() => setConfirmDelete({ id: s.id, name: s.name })}>
                          {t('admin.delete')}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {modal.open && (
        <div className="admin-modal-overlay" onClick={closeModal}>
          <div className="admin-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="card-title">{modal.mode === 'create' ? t('admin.addService') : t('admin.editService')}</h2>
              <button className="modal-close" onClick={closeModal}>×</button>
            </div>
            <div className="modal-body">
              <div className="modal-grid">
                <label className="modal-field">
                  <span>{t('admin.fieldName')}</span>
                  <input value={modal.data.name} onChange={e => handleModalChange('name', e.target.value)} />
                </label>
                <label className="modal-field">
                  <span>{t('admin.fieldNameAr')}</span>
                  <input value={modal.data.name_ar} onChange={e => handleModalChange('name_ar', e.target.value)} dir="rtl" />
                </label>
                <label className="modal-field modal-field-full">
                  <span>{t('admin.fieldDesc')}</span>
                  <textarea value={modal.data.description} onChange={e => handleModalChange('description', e.target.value)} rows={2} />
                </label>
                <label className="modal-field modal-field-full">
                  <span>{t('admin.fieldDescAr')}</span>
                  <textarea value={modal.data.description_ar} onChange={e => handleModalChange('description_ar', e.target.value)} rows={2} dir="rtl" />
                </label>
                <label className="modal-field">
                  <span>{t('admin.fieldPrice')} (JD)</span>
                  <input type="number" min="0" value={modal.data.price} onChange={e => handleModalChange('price', e.target.value)} />
                </label>
                <label className="modal-field">
                  <span>{t('admin.fieldDuration')} ({t('services.min')})</span>
                  <input type="number" min="0" value={modal.data.duration_minutes} onChange={e => handleModalChange('duration_minutes', e.target.value)} />
                </label>
                <label className="modal-field">
                  <span>{t('admin.fieldCategory')}</span>
                  <select value={modal.data.category} onChange={e => handleModalChange('category', e.target.value)}>
                    {CATEGORIES.map(c => <option key={c} value={c}>{t(`categories.${c}`, c)}</option>)}
                  </select>
                </label>
                <label className="modal-field modal-checkbox">
                  <input type="checkbox" checked={modal.data.is_active} onChange={e => handleModalChange('is_active', e.target.checked)} />
                  <span>{t('admin.fieldActive')}</span>
                </label>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={closeModal}>{t('common.back')}</button>
              <button className="btn btn-primary" onClick={handleSaveService} disabled={saving}>
                {saving ? t('common.loading') : t('admin.save')}
              </button>
            </div>
          </div>
        </div>
      )}

      {confirmDelete && (
        <div className="admin-modal-overlay" onClick={() => setConfirmDelete(null)}>
          <div className="admin-modal admin-modal-sm" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="card-title">{t('admin.confirmDeleteTitle')}</h2>
            </div>
            <div className="modal-body">
              <p className="body-medium">{t('admin.confirmDeleteMsg')} <strong>{confirmDelete.name}</strong>?</p>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setConfirmDelete(null)}>{t('common.back')}</button>
              <button className="btn btn-danger" onClick={handleDelete}>{t('admin.delete')}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;
