import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import './Services.css';
import Card from '../components/UI/Card/Card';
import Button from '../components/UI/Button/Button';
import { useServices } from '../hooks/useDatabase';
import { useAuth } from '../contexts/AuthContext';
import { useTranslation } from 'react-i18next';

const Services = () => {
  const { services, loading, error } = useServices();
  const { isAuthenticated } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = useMemo(() => {
    const cats = [...new Set(services.map(s => s.category))];
    return ['All', ...cats];
  }, [services]);

  const filteredServices = useMemo(() => {
    if (selectedCategory === 'All') return services;
    return services.filter(s => s.category === selectedCategory);
  }, [services, selectedCategory]);

  const handleBooking = (serviceId) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    navigate(`/book?serviceId=${serviceId}`);
  };

  return (
    <div className="services-page">
      {/* Services Hero - Immersive Header */}
      <section className="viewport-section section-dark services-hero">
        <div className="content-well text-center">
          <h1 className="hero-headline">{t('nav.treatments')}</h1>
          <p className="body-intro hero-subtitle">
            Luxury meets clinical precision. Explore our curated range of aesthetic treatments.
          </p>
        </div>
      </section>

      {/* Category Filter - The Apple Strip */}
      <div className="category-strip-container">
        <div className="content-well">
          <div className="category-strip">
            {categories.map(cat => (
              <button 
                key={cat}
                className={`category-pill ${selectedCategory === cat ? 'active' : ''}`}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      <main className="viewport-section section-white services-content">
        <div className="content-well">
          {loading && (
            <div className="loading-state centered">
              <div className="laser-spinner"></div>
              <p className="body-medium">Curating your experience...</p>
            </div>
          )}

          {error && (
            <div className="error-state centered">
              <p className="body-medium error-message">Unable to load services at this time.</p>
            </div>
          )}

          {!loading && !error && (
            <div className="grid-3 services-grid">
              {filteredServices.map(service => (
                <Card key={service.id} variant="white" className="service-tile" padded={false}>
                  <div className="service-image-well">
                    {service.image_url ? (
                        <img src={service.image_url} alt={service.name} className="service-image" />
                    ) : (
                        <div className="service-image-placeholder"></div>
                    )}
                    <span className="service-category-tag">{service.category}</span>
                  </div>
                  
                  <div className="service-tile-content">
                    <h3 className="card-title">{service.name}</h3>
                    <p className="body-medium service-desc">{service.description}</p>
                    
                    <div className="service-tile-footer">
                      <div className="service-meta">
                        {service.duration_minutes && (
                          <span className="meta-item">{service.duration_minutes} min</span>
                        )}
                        <span className="price-label">${service.price}</span>
                      </div>
                      <button 
                         className="pill-link"
                         onClick={() => handleBooking(service.id)}
                      >
                        {t('home.treatments.bookNow')}
                      </button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}

          {!loading && filteredServices.length === 0 && !error && (
            <div className="empty-state centered">
              <p className="body-medium">No treatments found in this category.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Services;
