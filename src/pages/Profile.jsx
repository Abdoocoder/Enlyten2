import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './Profile.css';
import Card from '../components/UI/Card/Card';
import Input from '../components/UI/Input/Input';
import Button from '../components/UI/Button/Button';
import profileBg from '../assets/profile-bg.png';
import { useAuth } from '../contexts/AuthContext';
import { updateProfile } from '../lib/supabase';

const Profile = () => {
  const { user, profile, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({ full_name: '', phone: '', bio: '' });

  useEffect(() => {
    if (!isAuthenticated) { navigate('/login'); return; }
    if (profile) {
      setFormData({
        full_name: profile.full_name || '',
        phone: profile.phone || '',
        bio: profile.bio || '',
      });
    }
  }, [profile, isAuthenticated, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    try {
      setLoading(true);
      const { error: updateError } = await updateProfile(user.id, formData);
      if (updateError) throw updateError;
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err.message || t('profile.errorFailed'));
    } finally {
      setLoading(false);
    }
  };

  const initials = (formData.full_name || 'U')
    .split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

  return (
    <div className="profile-page page-container">
      <header className="profile-header section">
        <h1 className="headline-medium">{t('profile.title')}</h1>
        <p className="body-large">{t('profile.subtitle')}</p>
      </header>

      <div className="profile-grid section">
        <div className="profile-sidebar">
          <Card variant="white" className="profile-card" padded={false}>
            <div className="profile-photo-container">
              <img src={profileBg} alt={t('profile.title')} className="profile-bg-context" />
              <div className="profile-initials">{initials}</div>
            </div>
            <div className="profile-summary card-padded">
              <h2 className="headline-small">{formData.full_name || t('nav.profile')}</h2>
              <p className="body-medium">{user?.email}</p>
              <span className="label-medium loyalty-badge">{t('profile.member')}</span>
            </div>
          </Card>
        </div>

        <div className="profile-main">
          <Card variant="white" className="profile-info-card">
            <h3 className="headline-small section-title">{t('profile.personalInfo')}</h3>
            {error && <div className="error-message">{error}</div>}
            {success && <div className="success-message">{t('profile.successUpdate')}</div>}
            <form onSubmit={handleSubmit}>
              <div className="info-grid">
                <Input label={t('profile.fullName')} name="full_name" value={formData.full_name} onChange={handleInputChange} placeholder={t('profile.fullNamePlaceholder')} />
                <Input label={t('profile.email')} value={user?.email} disabled />
                <Input label={t('profile.phone')} name="phone" value={formData.phone} onChange={handleInputChange} placeholder={t('profile.phonePlaceholder')} type="tel" />
                <Input label={t('profile.bio')} name="bio" value={formData.bio} onChange={handleInputChange} placeholder={t('profile.bioPlaceholder')} maxLength="200" />
              </div>
              <div className="form-actions">
                <Button variant="primary" type="submit" disabled={loading}>
                  {loading ? t('profile.saving') : t('profile.updateProfile')}
                </Button>
              </div>
            </form>
          </Card>

          <Card variant="tonal" className="profile-medical-card">
            <h3 className="headline-small section-title">{t('profile.accountInfo')}</h3>
            <div className="history-details">
              <div className="history-group">
                <span className="label-medium">{t('profile.accountStatus')}</span>
                <p className="body-medium">{isAuthenticated ? t('profile.active') : t('profile.inactive')}</p>
              </div>
              <div className="history-group">
                <span className="label-medium">{t('profile.memberSince')}</span>
                <p className="body-medium">
                  {profile?.created_at ? new Date(profile.created_at).toLocaleDateString() : t('profile.recentlyJoined')}
                </p>
              </div>
              <div className="history-group">
                <span className="label-medium">{t('profile.lastUpdated')}</span>
                <p className="body-medium">
                  {profile?.updated_at ? new Date(profile.updated_at).toLocaleDateString() : t('profile.notYet')}
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Profile;
