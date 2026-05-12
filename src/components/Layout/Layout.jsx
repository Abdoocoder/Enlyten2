import { Link } from 'react-router-dom';
import { useState, useEffect, useRef, useMemo } from 'react';
import './Layout.css';
import Button from '../UI/Button/Button';
import LanguageSwitcher from '../UI/LanguageSwitcher/LanguageSwitcher';
import { useAuth } from '../../contexts/AuthContext';
import { useTranslation } from 'react-i18next';

const Layout = ({ children }) => {
  const { isAuthenticated, user, profile, isAdmin, logout } = useAuth();
  const { t } = useTranslation();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [menuClosing, setMenuClosing] = useState(false);
  const menuRef = useRef(null);
  const closeMenu = () => {
    setMenuClosing(true);
    setTimeout(() => { setShowUserMenu(false); setMenuClosing(false); }, 180);
  };

  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileClosing, setMobileClosing] = useState(false);
  const closeMobileMenu = () => {
    setMobileClosing(true);
    setTimeout(() => { setMobileOpen(false); setMobileClosing(false); }, 260);
  };

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        if (showUserMenu) closeMenu();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showUserMenu]);

  const handleLogout = () => {
    console.log('Logout: Initiating...');
    setShowUserMenu(false);
    logout();
    console.log('Logout: Success');
    // Force full page reload to clear all in-memory state
    window.location.href = '/';
  };

  const initials = useMemo(() => (profile?.full_name || 'U')
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2), [profile?.full_name]);

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
            <button
              className={`hamburger${mobileOpen ? ' hamburger--open' : ''}`}
              onClick={() => mobileOpen ? closeMobileMenu() : setMobileOpen(true)}
              aria-expanded={mobileOpen}
              aria-label={mobileOpen ? t('nav.close') : t('nav.menu')}
            >
              <span className="hamburger-line" />
              <span className="hamburger-line" />
              <span className="hamburger-line" />
            </button>
            <LanguageSwitcher />
            {isAuthenticated ? (
              <>
              <Button to="/book" variant="primary" className="btn-pill btn-header-book">
                {t('nav.book')}
              </Button>
              <div className="user-menu-container" ref={menuRef}>
                <button
                  className="user-avatar"
                  onClick={() => showUserMenu ? closeMenu() : setShowUserMenu(true)}
                  title={user?.email}
                >
                  {initials}
                </button>
                {showUserMenu && (
                  <div className={`user-menu${menuClosing ? ' user-menu--closing' : ''}`}>
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

      {mobileOpen && (
        <>
          <div
            className={`mobile-backdrop${mobileClosing ? ' mobile-backdrop--closing' : ''}`}
            onClick={closeMobileMenu}
            aria-hidden="true"
          />
          <nav
            className={`mobile-nav${mobileClosing ? ' mobile-nav--closing' : ''}`}
            aria-label={t('nav.menu')}
          >
            <div className="mobile-nav-links">
              <Link to="/" className="mobile-nav-link" onClick={closeMobileMenu} style={{'--i': 0}}>{t('nav.home')}</Link>
              <Link to="/services" className="mobile-nav-link" onClick={closeMobileMenu} style={{'--i': 1}}>{t('nav.treatments')}</Link>
              <Link to="/gallery" className="mobile-nav-link" onClick={closeMobileMenu} style={{'--i': 2}}>{t('nav.gallery')}</Link>
              <Link to="/experience" className="mobile-nav-link" onClick={closeMobileMenu} style={{'--i': 3}}>{t('nav.experience')}</Link>
              <Link to="/contact" className="mobile-nav-link" onClick={closeMobileMenu} style={{'--i': 4}}>{t('nav.contact')}</Link>
            </div>

            <div className="mobile-nav-footer" style={{'--i': 5}}>
              <Button to="/book" variant="primary" className="btn-pill mobile-nav-cta" onClick={closeMobileMenu}>
                {t('nav.book')}
              </Button>
              {isAuthenticated ? (
                <div className="mobile-nav-auth">
                  <Link to="/dashboard" className="mobile-nav-sub-link" onClick={closeMobileMenu}>{t('nav.dashboard')}</Link>
                  <Link to="/profile" className="mobile-nav-sub-link" onClick={closeMobileMenu}>{t('nav.profile')}</Link>
                  {isAdmin && <Link to="/admin" className="mobile-nav-sub-link" onClick={closeMobileMenu}>{t('nav.admin')}</Link>}
                  <button className="mobile-nav-sub-link mobile-nav-logout" onClick={() => { closeMobileMenu(); logout(); window.location.href = '/'; }}>{t('nav.logout')}</button>
                </div>
              ) : (
                <Link to="/login" className="mobile-nav-sub-link" onClick={closeMobileMenu}>{t('nav.signIn')}</Link>
              )}
            </div>
          </nav>
        </>
      )}

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
