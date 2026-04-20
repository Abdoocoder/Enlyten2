import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import './Layout.css';
import Button from '../UI/Button/Button';
import LanguageSwitcher from '../UI/LanguageSwitcher/LanguageSwitcher';
import { useAuth } from '../../contexts/AuthContext';
import { useTranslation } from 'react-i18next';

const Layout = ({ children }) => {
  const { isAuthenticated, user, profile, isAdmin, logout } = useAuth();
  const { t } = useTranslation();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener('pointerdown', handleClickOutside);
    return () => document.removeEventListener('pointerdown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      console.log('Logout: Initiating...');
      // Perform logout first, then close menu/navigate
      await logout();
      console.log('Logout: Success');
      setShowUserMenu(false);
      navigate('/');
      // Force a full location change if SPA navigation lags
      window.location.href = '/';
    } catch (err) {
      console.error('Logout error:', err);
      window.location.href = '/';
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
            <img src="/logo-icon.svg" alt="Enlyten2 Laser Center" className="logo-img" />
          </Link>
          <nav className="nav">
            <Link to="/services" className="nav-link">{t('nav.treatments')}</Link>
            <Link to="/gallery" className="nav-link">{t('nav.gallery')}</Link>
            <Link to="/contact" className="nav-link">{t('nav.contact')}</Link>
          </nav>
          <div className="header-actions">
            <LanguageSwitcher />
            {isAuthenticated ? (
              <>
              <Button to="/book" variant="primary" className="btn-pill btn-header-book">
                {t('nav.book')}
              </Button>
              <div className="user-menu-container" ref={menuRef}>
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
                    {isAdmin && (
                      <Link to="/admin" className="user-menu-item admin-link" onClick={() => setShowUserMenu(false)}>
                        {t('nav.admin', 'Admin')}
                      </Link>
                    )}
                    <button 
                      className="user-menu-item logout-btn"
                      onClick={handleLogout}
                    >
                      {t('nav.logout')}
                    </button>
                  </div>
                )}
              </div>
              </>
            ) : (
              <>
                <Button to="/book" variant="primary">
                  {t('nav.book')}
                </Button>
                <Button to="/login" variant="secondary">
                  {t('nav.signIn')}
                </Button>
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
          {/* Column 1: Brand & Social */}
          <div className="footer-column footer-brand-column">
            <Link to="/" className="footer-logo">
              <img src="/logo-icon.svg" alt="Enlyten2" className="footer-logo-img" />
              <span className="laser-text logo-text-small">Enlyten2</span>
            </Link>
            <p className="footer-tagline">{t('footer.tagline')}</p>
            <div className="social-links">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="social-icon-btn" title={t('common.facebook')}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
              </a>
              <a href="#" className="social-icon-btn" title={t('footer.instagram')}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
              </a>
              <a href="#" className="social-icon-btn" title={t('footer.whatsapp')}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
              </a>
            </div>
          </div>

          {/* Column 2: Navigation */}
          <div className="footer-column">
            <h4 className="footer-heading">{t('footer.navigation')}</h4>
            <nav className="footer-nav-list">
              <Link to="/" className="footer-nav-link">{t('nav.home', 'Home')}</Link>
              <Link to="/experience" className="footer-nav-link">{t('nav.experience', 'Experience')}</Link>
              <Link to="/gallery" className="footer-nav-link">{t('nav.gallery')}</Link>
              <Link to="/contact" className="footer-nav-link">{t('nav.contact')}</Link>
              <Link to="/book" className="footer-nav-link">{t('nav.book')}</Link>
            </nav>
          </div>

          {/* Column 3: Treatments */}
          <div className="footer-column">
            <h4 className="footer-heading">{t('footer.treatments')}</h4>
            <nav className="footer-nav-list">
              <Link to="/services" className="footer-nav-link">{t('nav.treatments')}</Link>
              <Link to="/services?cat=Laser" className="footer-nav-link">{t('categories.Laser')}</Link>
              <Link to="/services?cat=Skin Care" className="footer-nav-link">{t('categories.Skin Care')}</Link>
              <Link to="/services?cat=Injectables" className="footer-nav-link">{t('categories.Injectables')}</Link>
            </nav>
          </div>

          {/* Column 4: Contact */}
          <div className="footer-column">
            <h4 className="footer-heading">{t('footer.clinic')}</h4>
            <div className="footer-contact-info">
              <div className="contact-item">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="contact-icon"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                <span>{t('footer.location')}</span>
              </div>
              <div className="contact-item">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="contact-icon"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                <a href="tel:0770300173">{t('footer.phone')}</a>
              </div>
              <div className="contact-item">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="contact-icon"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                <span>{t('footer.hours')}</span>
              </div>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <div className="footer-bottom-container">
            <p className="copyright-text">{t('footer.rights')}</p>
            <div className="footer-legal-links">
              <a href="#" className="legal-link">Privacy Policy</a>
              <a href="#" className="legal-link">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
