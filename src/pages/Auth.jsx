import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './Auth.css';
import Button from '../components/UI/Button/Button';
import Card from '../components/UI/Card/Card';
import { signUp, signIn } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [formData, setFormData] = useState({ fullName: '', email: '', password: '' });
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const returnTo = searchParams.get('returnTo') || '/dashboard';
  const { isAuthenticated } = useAuth();
  const { t } = useTranslation();

  useEffect(() => {
    // Redirect only once auth state is fully loaded (including profile)
    if (!loading && isAuthenticated) {
      if (isAdmin && returnTo === '/dashboard') {
        navigate('/admin');
      } else {
        navigate(returnTo);
      }
    }
  }, [isAuthenticated, isAdmin, loading, navigate, returnTo]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    try {
      setLoading(true);
      if (isLogin) {
        const { error: signInError } = await signIn(formData.email, formData.password);
        if (signInError) throw signInError;
        navigate(returnTo);
      } else {
        if (!formData.fullName.trim()) throw new Error(t('auth.errorNameRequired'));
        const { error: signUpError } = await signUp(formData.email, formData.password, formData.fullName);
        if (signUpError) throw signUpError;
        setIsLogin(true);
        setSuccess(t('auth.successVerify'));
        setFormData({ fullName: '', email: '', password: '' });
      }
    } catch (err) {
      setError(err.message || t('auth.errorFailed'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <section className="viewport-section section-dark auth-hero">
        <div className="content-well max-width-tiny">
          <div className="auth-card-container animation-fade-in">
            <div className="text-center">
              <span className="brand-accent">{isLogin ? t('auth.loginAccent') : t('auth.registerAccent')}</span>
              <h1 className="hero-headline small-hero">
                {isLogin ? t('auth.loginTitle') : t('auth.registerTitle')}{' '}
                <span className="laser-text">{isLogin ? t('auth.loginTitleHighlight') : t('auth.registerTitleHighlight')}</span>
              </h1>
              <p className="body-medium text-muted auth-subtitle">
                {isLogin ? t('auth.loginSubtitle') : t('auth.registerSubtitle')}
              </p>
            </div>

            {success && <div className="auth-banner success">{success}</div>}
            {error && <div className="auth-banner error">{error}</div>}

            <Card variant="white" className="apple-card auth-form-card">
              <form className="auth-form-v2" onSubmit={handleSubmit}>
                {!isLogin && (
                  <div className="form-item">
                    <label className="label-medium">{t('profile.fullName')}</label>
                    <input
                      className="apple-input"
                      type="text"
                      name="fullName"
                      placeholder={t('profile.fullNamePlaceholder')}
                      value={formData.fullName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                )}
                <div className="form-item">
                  <label className="label-medium">{t('common.email')}</label>
                  <input
                    className="apple-input"
                    type="email"
                    name="email"
                    placeholder="example@mail.com"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-item">
                  <label className="label-medium">{t('common.password')}</label>
                  <input
                    className="apple-input"
                    type="password"
                    name="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="auth-footer-actions">
                  <Button
                    variant="primary"
                    className="btn-pill btn-large laser-glow-btn w-full"
                    disabled={loading}
                    type="submit"
                  >
                    {loading ? t('auth.processing') : (isLogin ? t('auth.signIn') : t('auth.getStarted'))}
                  </Button>
                </div>
              </form>
            </Card>

            <div className="auth-toggle-context text-center">
              <p className="body-small text-muted">
                {isLogin ? t('auth.newToClinic') : t('auth.alreadyMember')}
              </p>
              <button className="pill-link" onClick={() => setIsLogin(!isLogin)}>
                {isLogin ? t('auth.registerNow') : t('auth.signInInstead')}
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Auth;
