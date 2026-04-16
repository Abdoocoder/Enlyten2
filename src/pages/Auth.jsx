import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Auth.css';
import Input from '../components/UI/Input/Input';
import Button from '../components/UI/Button/Button';
import Card from '../components/UI/Card/Card';
import { signUp, signIn } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { useTranslation } from 'react-i18next';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
  });
  const navigate = useNavigate();
  const { user } = useAuth();
  const { t } = useTranslation();

  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

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
    
    try {
      setLoading(true);
      
      if (isLogin) {
        const { error: signInError } = await signIn(formData.email, formData.password);
        if (signInError) throw signInError;
        navigate('/dashboard');
      } else {
        if (!formData.fullName.trim()) {
          throw new Error('Full name is required');
        }
        const { error: signUpError } = await signUp(
          formData.email,
          formData.password,
          formData.fullName
        );
        if (signUpError) throw signUpError;
        setIsLogin(true);
        setError('Success! Please check your email for verification.');
        setFormData({ fullName: '', email: '', password: '' });
      }
    } catch (err) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <section className="viewport-section section-white auth-hero">
        <div className="content-well max-width-tiny">
          <div className="auth-card-container animation-fade-in">
             <div className="text-center">
                <span className="brand-accent">{isLogin ? 'Member Login' : 'Join Us'}</span>
                <h1 className="hero-headline small-hero">
                  {isLogin ? 'Welcome ' : 'Create '}
                  <span className="laser-text">{isLogin ? 'Back' : 'Profile'}</span>
                </h1>
                <p className="body-medium text-muted auth-subtitle">
                   {isLogin 
                     ? 'Enter your credentials to access your clinical portal.' 
                     : 'Begin your clinical journey with precision care.'}
                </p>
             </div>

             {error && (
               <div className={`auth-banner ${error.includes('Success') ? 'success' : 'error'}`}>
                 {error}
               </div>
             )}

             <Card variant="white" className="apple-card auth-form-card">
               <form className="auth-form-v2" onSubmit={handleSubmit}>
                 {!isLogin && (
                   <div className="form-item">
                     <label className="label-medium">{t('profile.fullName')}</label>
                     <input 
                       className="apple-input"
                       type="text"
                       name="fullName"
                       placeholder="Enter full name"
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
                      {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Get Started')}
                    </Button>
                 </div>
               </form>
             </Card>

             <div className="auth-toggle-context text-center">
                <p className="body-small text-muted">
                  {isLogin ? "New to the clinic?" : "Already part of the community?"}
                </p>
                <button 
                  className="pill-link"
                  onClick={() => setIsLogin(!isLogin)}
                >
                  {isLogin ? 'Register Now' : 'Sign In Instead'}
                </button>
             </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Auth;
