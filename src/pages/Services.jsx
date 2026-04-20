import React, { useState, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import './Services.css';
import { useServices } from '../hooks/useDatabase';
import { useAuth } from '../contexts/AuthContext';
import { useTranslation } from 'react-i18next';
import mockData from '../data/mockData.json';

const categoryIcons = {
  'Laser': '✦',
  'Injectables': '◈',
  'Body': '◎',
  'Anti-Aging': '◇',
  'Skin Care': '◉',
  'Hair': '◐',
};

const ServiceTile = React.memo(({ service, onBook }) => {
  const { t, i18n } = useTranslation();
  const isAr = i18n.language === 'ar';
  const name = isAr ? (service.name_ar || service.name) : service.name;
  const desc = isAr ? (service.description_ar || service.description) : service.description;

  return (
    <article className="service-tile">
      <div className="service-image-well">
        {service.image_url
          ? <img src={service.image_url} alt={name} className="service-image" loading="lazy" />
          : (
            <div className="service-image-placeholder">
              <span className="service-icon">{categoryIcons[service.category] || '◆'}</span>
            </div>
          )
        }
        <span className="service-category-tag">{t(`categories.${service.category}`, service.category)}</span>
      </div>

      <div className="service-tile-content">
        <h3 className="service-name">{name}</h3>
        <p className="service-desc">{desc}</p>

        <div className="service-tile-footer">
          <div className="service-meta">
            {service.duration_minutes && (
              <span className="meta-item">{service.duration_minutes} {t('services.min')}</span>
            )}
            <span className="price-badge">{service.price} JD</span>
          </div>
          <button className="pill-link" onClick={() => onBook(service.id)}>
            {t('home.treatments.bookNow')}
          </button>
        </div>
      </div>
    </article>
  );
});

const Services = () => {
  const { services: dbServices, loading, error } = useServices();
  const { isAuthenticated } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('All');

  const services = useMemo(() => (
    dbServices.length > 0 ? dbServices : mockData.treatments.map(tr => ({
      id: tr.id,
      name: tr.name,
      name_ar: tr.name_ar,
      description: tr.description,
      description_ar: tr.description_ar,
      price: tr.price,
      duration_minutes: tr.duration,
      category: tr.category,
      image_url: tr.image_url,
    }))
  ), [dbServices]);

  const categories = useMemo(() => {
    const cats = [...new Set(services.map(s => s.category))];
    return ['All', ...cats];
  }, [services]);

  const filteredServices = useMemo(() => (
    selectedCategory === 'All' ? services : services.filter(s => s.category === selectedCategory)
  ), [services, selectedCategory]);

  const handleBooking = useCallback((serviceId) => {
    if (!isAuthenticated) { navigate('/login'); return; }
    navigate(`/book?serviceId=${serviceId}`);
  }, [isAuthenticated, navigate]);

  return (
    <div className="services-page">

      <section className="viewport-section section-dark services-hero">
        <div className="content-well text-center">
          <h1 className="hero-headline">{t('services.title', t('nav.treatments'))}</h1>
          <p className="body-intro hero-subtitle">{t('services.subtitle', 'Advanced aesthetic solutions — curated for your luminous goals.')}</p>
        </div>
      </section>

      <div className="category-strip-container">
        <div className="content-well">
          <div className="category-strip" role="group" aria-label={t('services.filterLabel', 'Filter by category')}>
            {categories.map(cat => (
              <button
                key={cat}
                className={`category-pill ${selectedCategory === cat ? 'active' : ''}`}
                onClick={() => setSelectedCategory(cat)}
                aria-pressed={selectedCategory === cat}
              >
                {t(`categories.${cat}`, cat)}
              </button>
            ))}
          </div>
        </div>
      </div>

      <main className="viewport-section section-light services-content">
        <div className="content-well">
          {loading && (
            <div className="centered">
              <div className="laser-spinner"></div>
              <p className="body-medium">{t('services.loading', 'Curating your experience...')}</p>
            </div>
          )}

          {!loading && filteredServices.length > 0 && (
            <div className="services-grid">
              {filteredServices.map(service => (
                <ServiceTile
                  key={service.id}
                  service={service}
                  onBook={handleBooking}
                />
              ))}
            </div>
          )}

          {!loading && filteredServices.length === 0 && (
            <div className="centered">
              <p className="body-medium">{t('services.empty', 'No treatments found in this category.')}</p>
            </div>
          )}
        </div>
      </main>

    </div>
  );
};

export default Services;
