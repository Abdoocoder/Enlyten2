import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import './Layout.css';
import Button from '../UI/Button/Button';
import LanguageSwitcher from '../UI/LanguageSwitcher/LanguageSwitcher';
import { useAuth } from '../../contexts/AuthContext';
import { useTranslation } from 'react-i18next';
import { signOut } from '../../lib/supabase';

const Layout = ({ children }) => {
  const { isAuthenticated, user, profile } = useAuth();
  const { t } = useTranslation();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/');
      setShowUserMenu(false);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const initials = (profile?.full_name || 'U')
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="layout">
      <header className="header">
        <div className="header-container">
          <Link to="/" className="logo">
            <img src="/logo.jpg" alt="Enlyten2 Laser Center" className="logo-img" />
          </Link>
          <nav className="nav">
            <Link to="/services" className="nav-link">{t('nav.treatments')}</Link>
            <Link to="/gallery" className="nav-link">{t('nav.gallery')}</Link>
            <Link to="/contact" className="nav-link">{t('nav.contact')}</Link>
          </nav>
          <div className="header-actions">
            <LanguageSwitcher />
            {isAuthenticated ? (
              <div className="user-menu-container">
                <button 
                  className="user-avatar"
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  title={user?.email}
                >
                  {initials}
                </button>
                {showUserMenu && (
                  <div className="user-menu">
                    <Link to="/dashboard" className="user-menu-item" onClick={() => setShowUserMenu(false)}>
                      {t('nav.dashboard')}
                    </Link>
                    <Link to="/profile" className="user-menu-item" onClick={() => setShowUserMenu(false)}>
                      {t('nav.profile')}
                    </Link>
                    <button 
                      className="user-menu-item logout-btn"
                      onClick={handleLogout}
                    >
                      {t('nav.logout')}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link to="/book">
                  <Button variant="primary">{t('nav.book')}</Button>
                </Link>
                <Link to="/login">
                  <Button variant="secondary">{t('nav.signIn')}</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="main-content">
        {children}
      </main>

      <footer className="footer">
        <div className="footer-container">
          <div className="footer-brand">
            <Link to="/" className="logo">
              <img src="/logo.jpg" alt="Enlyten2 Laser Center" className="logo-img" />
            </Link>
            <p className="footer-tagline">{t('footer.tagline')}</p>
          </div>
          <div className="footer-links">
            <div className="footer-group">
              <span className="footer-label">{t('footer.address')}</span>
              <span className="footer-text">{t('footer.location')}</span>
            </div>
            <div className="footer-group">
              <span className="footer-label">{t('footer.social')}</span>
              <a href="#" className="footer-link">Instagram</a>
              <a href="https://www.facebook.com/p/Enlyten2-laser-center-100044632491039/?locale=ar_AR" target="_blank" rel="noopener noreferrer" className="footer-link">Facebook</a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>{t('footer.rights')}</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
