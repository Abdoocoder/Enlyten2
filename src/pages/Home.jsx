import React from 'react';
import './Home.css';
import Button from '../components/UI/Button/Button';
import Card from '../components/UI/Card/Card';
import { useTranslation } from 'react-i18next';
import mockData from '../data/mockData.json';
import heroImg from '../assets/hero-clinic.png';

const Home = () => {
  const { t } = useTranslation();
  const { company, treatments } = mockData;

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1 className="display-large">{t('home.hero.title')}</h1>
          <p className="body-large">{t('home.hero.subtitle')}</p>
          <div className="hero-actions">
            <Button variant="primary">{t('home.hero.cta')}</Button>
            <Button variant="secondary">{t('home.hero.secondaryCta')}</Button>
          </div>
        </div>
        <div className="hero-image-container">
          <img src={heroImg} alt="Luxury Clinic" className="hero-image" />
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="philosophy bg-tonal">
        <div className="section-container">
          <span className="label-medium">{t('home.philosophy.label')}</span>
          <h2 className="headline-medium">{t('home.philosophy.title')}</h2>
          <p className="body-large philosophy-text">{t('home.philosophy.content')}</p>
          
          <div className="philosophy-grid">
            <div className="philosophy-item">
              <h3 className="headline-small">{t('home.philosophy.precision.title')}</h3>
              <p className="body-medium">{t('home.philosophy.precision.text')}</p>
            </div>
            <div className="philosophy-item">
              <h3 className="headline-small">{t('home.philosophy.artisan.title')}</h3>
              <p className="body-medium">{t('home.philosophy.artisan.text')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Curated Treatments Section */}
      <section className="treatments-preview">
        <div className="section-container">
          <h2 className="headline-medium">{t('home.treatments.title')}</h2>
          <p className="body-large">{t('home.treatments.subtitle')}</p>
          
          <div className="treatments-grid">
            {treatments.map(treatment => (
              <Card key={treatment.id} variant="white" className="treatment-card">
                <div className="treatment-info">
                  <h3 className="headline-small">{treatment.name}</h3>
                  <p className="body-medium">{treatment.description}</p>
                </div>
                <div className="treatment-footer">
                  <span className="treatment-price">${treatment.price}</span>
                  <Button variant="secondary">{t('home.treatments.bookNow')}</Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
