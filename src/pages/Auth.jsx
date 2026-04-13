import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Auth.css';
import Input from '../components/UI/Input/Input';
import Button from '../components/UI/Button/Button';
import Card from '../components/UI/Card/Card';
import authBg from '../assets/auth-bg.png';
import { signUp, signIn } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

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

  // Redirect if already logged in
  React.useEffect(() => {
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
        // Sign in
        const { data, error: signInError } = await signIn(formData.email, formData.password);
        if (signInError) throw signInError;
        navigate('/dashboard');
      } else {
        // Sign up
        if (!formData.fullName.trim()) {
          throw new Error('Full name is required');
        }
        const { data, error: signUpError } = await signUp(
          formData.email,
          formData.password,
          formData.fullName
        );
        if (signUpError) throw signUpError;
        setFormData({ fullName: '', email: '', password: '' });
        setIsLogin(true);
        setError(null);
      }
    } catch (err) {
      setError(err.message || 'Authentication failed');
      console.error('Auth error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-form-side">
          <div className="auth-form-wrapper">
            <h1 className="headline-medium">{isLogin ? 'Welcome Back' : 'Create Account'}</h1>
            <p className="body-medium text-muted">Join the Enlyten2 community for personalized care.</p>
            
            {error && <div className="error-message">{error}</div>}
            
            <form className="auth-form" onSubmit={handleSubmit}>
              {!isLogin && (
                <Input 
                  label="Full Name" 
                  placeholder="Jane Doe"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  required
                />
              )}
              <Input 
                label="Email" 
                type="email" 
                placeholder="jane@example.com"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
              <Input 
                label="Password" 
                type="password" 
                placeholder="••••••••"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                required
              />
              
              <div className="auth-actions">
                <Button 
                  variant="primary" 
                  className="w-full"
                  disabled={loading}
                  type="submit"
                >
                  {loading ? 'Loading...' : (isLogin ? 'Sign In' : 'Sign Up')}
                </Button>
              </div>
            </form>

            <div className="auth-toggle">
              <p className="body-medium">
                {isLogin ? "Don't have an account?" : "Already have an account?"}
                <button 
                  onClick={() => {
                    setIsLogin(!isLogin);
                    setError(null);
                  }} 
                  className="toggle-btn"
                >
                  {isLogin ? 'Sign Up' : 'Sign In'}
                </button>
              </p>
            </div>
          </div>
        </div>
        
        <div className="auth-image-side">
          <img src={authBg} alt="Luminous Aesthetic" className="auth-bg-image" />
          <div className="auth-overlay">
            <h2 className="display-large">The Luminous Gallery</h2>
            <p className="body-large">Clinical Excellence. Artisan Care.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
