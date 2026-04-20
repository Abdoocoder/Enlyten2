import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import './Gallery.css';
import Card from '../components/UI/Card/Card';
import { useGallery } from '../hooks/useDatabase';
import mockData from '../data/mockData.json';

const BeforeAfterSlider = ({ before, after, alt }) => {
  const { t } = useTranslation();
  const [sliderPos, setSliderPos] = useState(50);

  const handleMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.type === 'touchmove' ? e.touches[0].clientX : e.clientX;
    const isRtl = document.dir === 'rtl';
    const pos = isRtl
      ? ((rect.right - x) / rect.width) * 100
      : ((x - rect.left) / rect.width) * 100;
    setSliderPos(Math.max(0, Math.min(100, pos)));
  };

  return (
    <div
      className="ba-slider"
      role="img"
      aria-label={`${t('gallery.beforeAfterLabel', 'Before and after')}: ${alt}`}
      onMouseMove={handleMove}
      onTouchMove={handleMove}
    >
      <div className="ba-after-img" style={{ backgroundImage: `url(${after})` }} />
      <div
        className="ba-before-img"
        style={{
          backgroundImage: `url(${before})`,
          width: `${sliderPos}%`
        }}
      />
      <div className="ba-handle" style={{ left: `${sliderPos}%` }}>
        <div className="ba-handle-line"></div>
        <div className="ba-handle-circle"></div>
      </div>
      <div className="ba-labels" aria-hidden="true">
        <span className="ba-label before">{t('gallery.before', 'Before')}</span>
        <span className="ba-label after">{t('gallery.after', 'After')}</span>
      </div>
    </div>
  );
};

const Gallery = () => {
  const { t, i18n } = useTranslation();
  const { gallery: dbGallery, loading, error } = useGallery();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const isAr = i18n.language === 'ar';

  const gallery = useMemo(() =>
    dbGallery.length > 0 ? dbGallery : mockData.gallery,
  [dbGallery]);

  const categories = useMemo(() => {
    const rawCategories = gallery.map(item => item.category).filter(Boolean);
    return ['all', ...new Set(rawCategories)];
  }, [gallery]);

  const filteredGallery = useMemo(() => {
    if (selectedCategory === 'all') return gallery;
    return gallery.filter(item => item.category === selectedCategory);
  }, [gallery, selectedCategory]);

  const gridRef = useRef(null);
  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { grid.classList.add('grid-visible'); observer.disconnect(); } },
      { threshold: 0.05 }
    );
    observer.observe(grid);
    return () => observer.disconnect();
  }, [filteredGallery]);

  return (
    <div className="gallery-page">
      <section className="viewport-section section-dark gallery-hero-v2">
        <div className="content-well text-center">
          <span className="brand-accent">{t('gallery.accent')}</span>
          <h1 className="hero-headline">
            {t('gallery.title')} <br/>
            <span className="laser-text">{t('gallery.titleHighlight')}</span>
          </h1>
          <p className="body-intro max-width-small mx-auto">
            {t('gallery.subtitle')}
          </p>
        </div>
      </section>

      <section className="category-strip-section section-white">
        <div className="content-well">
          <div className="category-strip" role="group" aria-label={t('gallery.filterLabel', 'Filter by category')}>
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
      </section>

      <main className="viewport-section section-white gallery-main">
        <div className="content-well">
          {loading && (
            <div className="loading-well text-center">
              <span className="laser-text body-medium">{t('gallery.loading')}</span>
            </div>
          )}

          {error && (
            <p className="body-medium error-banner">{t('gallery.error')}: {error}</p>
          )}

          {!loading && (
            <div className="gallery-grid-v2" ref={gridRef}>
              {filteredGallery.map((item, index) => (
                <Card key={item.id} variant="white" className="apple-card gallery-tile" padded={false} style={{ '--tile-index': index }}>
                  <div className="gallery-tile-image-side">
                    {item.before_url && item.after_url ? (
                      <BeforeAfterSlider 
                        before={item.before_url} 
                        after={item.after_url} 
                        alt={isAr ? (item.title_ar || item.title) : item.title}
                      />
                    ) : item.image_url ? (
                      <>
                        <img
                          src={item.image_url}
                          alt={isAr ? (item.title_ar || item.title) : item.title}
                          className="gallery-tile-img"
                          loading="lazy"
                        />
                        <div className="tile-glow-overlay"></div>
                      </>
                    ) : (
                      <div className="gallery-placeholder">
                        <span className="label-medium text-muted">{t('gallery.awaiting')}</span>
                      </div>
                    )}
                    <span className="tile-category-tag">{t(`categories.${item.category}`, item.category)}</span>
                  </div>
                  <div className="gallery-tile-info">
                    <h3 className="card-title">
                      {isAr ? (item.title_ar || item.title) : item.title}
                    </h3>
                    <p className="body-small text-muted">
                      {isAr ? (item.description_ar || item.description) : item.description}
                    </p>
                  </div>
                </Card>
              ))}
            </div>
          )}

          {!loading && filteredGallery.length === 0 && !error && (
            <div className="empty-well text-center">
              <p className="body-medium text-muted">{t('gallery.empty')}</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Gallery;
