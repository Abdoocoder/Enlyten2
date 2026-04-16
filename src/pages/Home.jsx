import React from 'react';
import './Home.css';
import Button from '../components/UI/Button/Button';
import Card from '../components/UI/Card/Card';
import { useTranslation } from 'react-i18next';
import mockData from '../data/mockData.json';

const Home = () => {
  const { t } = useTranslation();
  const { treatments } = mockData;

  return (
    <div className="home-page">
      {/* Hero Section - The Cinematic Reveal */}
      <section className="viewport-section section-dark hero">
        <div className="content-well hero-well">
          <div className="hero-content">
            <h1 className="hero-headline">
              <span className="laser-text">{t('home.hero.title')}</span>
            </h1>
            <p className="body-intro">{t('home.hero.subtitle')}</p>
            <div className="hero-actions">
              <Button variant="primary" className="btn-pill">{t('home.hero.cta')}</Button>
              <Button variant="outline" className="btn-pill">{t('home.hero.secondaryCta')}</Button>
            </div>
          </div>
        </div>
        <div className="hero-glow"></div>
      </section>

      {/* Philosophy Section - Airy & Scientific */}
      <section className="viewport-section section-light philosophy">
        <div className="content-well">
          <div className="philosophy-header">
            <span className="label-medium brand-accent">{t('home.philosophy.label')}</span>
            <h2 className="section-headline">{t('home.philosophy.title')}</h2>
            <p className="body-intro philosophy-text">{t('home.philosophy.content')}</p>
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

      {/* Curated Treatments - The Product Grid */}
      <section className="viewport-section section-dark treatments-preview">
        <div className="content-well">
          <div className="section-header-centered">
            <h2 className="section-headline">{t('home.treatments.title')}</h2>
            <p className="body-intro">{t('home.treatments.subtitle')}</p>
          </div>
          
          <div className="grid-3 treatments-grid">
            {treatments.map(treatment => (
              <Card key={treatment.id} variant="white" className="treatment-card" padded={false}>
                <div className="treatment-image-placeholder">
                   {/* Placeholder for treatment images */}
                   <div className="image-overlay"></div>
                </div>
                <div className="treatment-info-well">
                  <h3 className="card-title">{treatment.name}</h3>
                  <p className="body-medium treatment-description">{treatment.description}</p>
                  <div className="treatment-footer">
                    <span className="treatment-price">${treatment.price}</span>
                    <button className="pill-link">{t('home.treatments.bookNow')}</button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Meet the Team / CTA Strip */}
      <section className="viewport-section section-white cta-strip">
         <div className="content-well centered">
            <h2 className="section-headline">Experience the Transformation</h2>
            <Button variant="primary" className="btn-pill btn-large">Book Your Consultation</Button>
         </div>
      </section>
    </div>
  );
};

export default Home;
