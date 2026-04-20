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
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    setShowUserMenu(false);
    await logout();
    navigate('/');
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
              <Link to="/book">
                <Button variant="primary" className="btn-pill btn-header-book">{t('nav.book')}</Button>
              </Link>
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
              <img src="/logo-icon.svg" alt="Enlyten2 Laser Center" className="logo-img" />
            </Link>
            <p className="footer-tagline">{t('footer.tagline')}</p>
          </div>
          <div className="footer-links">
            <div className="footer-group">
              <span className="footer-label">{t('footer.address')}</span>
              <span className="footer-text">{t('footer.location')}</span>
            </div>
            <div className="footer-group">
              <span className="footer-label">{t('footer.phone', 'Phone')}</span>
              <a href="tel:0770300173" className="footer-link">{t('footer.phone')}</a>
            </div>
            <div className="footer-group">
              <span className="footer-label">{t('footer.social')}</span>
              <a href="https://www.facebook.com/p/Enlyten2-laser-center-100044632491039/" target="_blank" rel="noopener noreferrer" className="footer-link">{t('common.facebook')}</a>
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
