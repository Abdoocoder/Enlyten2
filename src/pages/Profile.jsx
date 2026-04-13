import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    phone: '',
    bio: '',
  });

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

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
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    try {
      setLoading(true);
      const { data, error: updateError } = await updateProfile(user.id, formData);
      if (updateError) throw updateError;
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const initials = (formData.full_name || 'U')
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="profile-page page-container">
      <header className="profile-header section">
        <h1 className="headline-medium">Your Profile</h1>
        <p className="body-large">Manage your personal details and history.</p>
      </header>

      <div className="profile-grid section">
        <div className="profile-sidebar">
          <Card variant="white" className="profile-card" padded={false}>
            <div className="profile-photo-container">
              <img src={profileBg} alt="Profile Context" className="profile-bg-context" />
              <div className="profile-initials">{initials}</div>
            </div>
            <div className="profile-summary card-padded">
              <h2 className="headline-small">{formData.full_name || 'Profile'}</h2>
              <p className="body-medium">{user?.email}</p>
              <span className="label-medium loyalty-badge">Member</span>
            </div>
          </Card>
        </div>

        <div className="profile-main">
          <Card variant="white" className="profile-info-card">
            <h3 className="headline-small section-title">Personal Information</h3>
            
            {error && <div className="error-message">{error}</div>}
            {success && <div className="success-message">Profile updated successfully!</div>}

            <form onSubmit={handleSubmit}>
              <div className="info-grid">
                <Input 
                  label="Full Name" 
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleInputChange}
                  placeholder="Enter your full name"
                />
                <Input 
                  label="Email" 
                  value={user?.email} 
                  disabled 
                />
                <Input 
                  label="Phone" 
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="+1 (555) 000-0000"
                  type="tel"
                />
                <Input 
                  label="Bio" 
                  name="bio"
                  value={formData.bio}
                  onChange={handleInputChange}
                  placeholder="Tell us about yourself"
                  maxLength="200"
                />
              </div>
              <div className="form-actions">
                <Button 
                  variant="primary"
                  type="submit"
                  disabled={loading}
                >
                  {loading ? 'Saving...' : 'Update Profile'}
                </Button>
              </div>
            </form>
          </Card>

          <Card variant="tonal" className="profile-medical-card">
            <h3 className="headline-small section-title">Account Information</h3>
            <div className="history-details">
              <div className="history-group">
                <span className="label-medium">Account Status</span>
                <p className="body-medium">{isAuthenticated ? 'Active' : 'Inactive'}</p>
              </div>
              <div className="history-group">
                <span className="label-medium">Member Since</span>
                <p className="body-medium">
                  {profile?.created_at 
                    ? new Date(profile.created_at).toLocaleDateString()
                    : 'Recently joined'
                  }
                </p>
              </div>
              <div className="history-group">
                <span className="label-medium">Last Updated</span>
                <p className="body-medium">
                  {profile?.updated_at
                    ? new Date(profile.updated_at).toLocaleDateString()
                    : 'Not yet'
                  }
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
