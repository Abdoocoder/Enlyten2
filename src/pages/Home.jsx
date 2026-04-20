import React from 'react';
import './Home.css';
import Button from '../components/UI/Button/Button';
import Card from '../components/UI/Card/Card';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import mockData from '../data/mockData.json';

const Home = () => {
  const { t, i18n } = useTranslation();
  const { treatments } = mockData;
  const isAr = i18n.language === 'ar';

  const stats = [
    { value: t('home.stats.clients.value'), label: t('home.stats.clients.label') },
    { value: t('home.stats.treatments.value'), label: t('home.stats.treatments.label') },
    { value: t('home.stats.years.value'), label: t('home.stats.years.label') },
    { value: t('home.stats.satisfaction.value'), label: t('home.stats.satisfaction.label') },
  ];

  return (
    <div className="home-page">
      {/* Hero — black, full-bleed, cinematic */}
      <section className="viewport-section section-dark hero">
        <div className="content-well hero-well">
          <div className="hero-content">
            <h1 className="hero-headline">
              <span className="laser-text">{t('home.hero.title')}</span>
            </h1>
            <p className="body-intro hero-subtitle">{t('home.hero.subtitle')}</p>
            <div className="hero-actions">
              <Button to="/services" variant="primary" className="btn-pill">
                {t('home.hero.cta')}
              </Button>
              <Button to="/experience" variant="outline" className="btn-pill">
                {t('home.hero.secondaryCta')}
              </Button>
            </div>
          </div>
        </div>
        <div className="hero-glow"></div>
      </section>

      {/* Philosophy — light-gray, stats grid */}
      <section className="viewport-section section-light philosophy">
        <div className="content-well">
          <div className="philosophy-header">
            <span className="label-medium brand-accent">{t('home.philosophy.label')}</span>
            <h2 className="section-headline">{t('home.philosophy.title')}</h2>
            <p className="body-intro philosophy-text">{t('home.philosophy.content')}</p>
          </div>

          <div className="stats-grid">
            {stats.map((stat) => (
              <div key={stat.label} className="stat-item">
                <span className="stat-value laser-text">{stat.value}</span>
                <span className="stat-label body-small">{stat.label}</span>
              </div>
            ))}
          </div>

          <div className="grid-2 philosophy-grid">
            <div className="apple-card philosophy-item">
              <h3 className="card-title">{t('home.philosophy.precision.title')}</h3>
              <p className="body-medium">{t('home.philosophy.precision.text')}</p>
            </div>
            <div className="apple-card philosophy-item">
              <h3 className="card-title">{t('home.philosophy.artisan.title')}</h3>
              <p className="body-medium">{t('home.philosophy.artisan.text')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Treatments — black, card grid */}
      <section className="viewport-section section-dark treatments-preview">
        <div className="content-well">
          <div className="section-header-centered">
            <h2 className="section-headline">{t('home.treatments.title')}</h2>
            <p className="body-intro section-subtitle-muted">{t('home.treatments.subtitle')}</p>
          </div>

          <div className="grid-3 treatments-grid">
            {treatments.map(treatment => (
              <Card key={treatment.id} variant="white" className="treatment-card" padded={false}>
                <div className="treatment-image-placeholder">
                  {treatment.image_url
                    ? <img src={treatment.image_url} alt={treatment.name} className="treatment-card-img" />
                    : <div className="image-overlay"></div>
                  }
                </div>
                <div className="treatment-info-well">
                  <h3 className="card-title">{isAr ? (treatment.name_ar || treatment.name) : treatment.name}</h3>
                  <p className="body-medium treatment-description">{isAr ? (treatment.description_ar || treatment.description) : treatment.description}</p>
                  <div className="treatment-footer">
                    <span className="treatment-price">{treatment.price} JD</span>
                    <Link to="/book" className="pill-link">{t('home.treatments.bookNow')}</Link>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Strip — light-gray */}
      <section className="viewport-section section-light cta-strip">
        <div className="content-well text-center">
          <h2 className="section-headline">{t('home.cta.title')}</h2>
          <Button to="/book" variant="primary" className="btn-pill btn-large">
            {t('home.cta.button')}
          </Button>
        </div>
      </section>

    </div>
  );
};

export default Home;
