import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import './Experience.css';
import Button from '../components/UI/Button/Button';
import heroImg from '../assets/hero-clinic.png';

const Experience = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="experience-page">
      <section className="viewport-section section-dark experience-hero-v2">
        <div className="experience-hero-grid">
          <div className="experience-image-well animation-fade-in">
            <img src={heroImg} alt="Luxury Enlyten2 Clinic Interior" className="full-bleed-img" />
            <div className="img-gloss"></div>
          </div>
          <div className="experience-text-well">
            <div className="content-well-mini">
              <span className="brand-accent">{t('experience.accent')}</span>
              <h1 className="hero-headline">
                {t('experience.title')} <br/>
                <span className="laser-text">{t('experience.titleHighlight')}</span>
              </h1>
              <p className="body-intro text-dim">{t('experience.subtitle')}</p>
              <div className="experience-cta-group">
                <Button variant="primary" className="btn-pill btn-large" onClick={() => navigate('/book')}>
                  {t('experience.startJourney')}
                </Button>
                <button className="pill-link" onClick={() => navigate('/services')}>
                  {t('experience.viewCollection')}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="viewport-section section-white the-protocol">
        <div className="content-well text-center">
          <span className="brand-accent">{t('experience.protocolAccent')}</span>
          <h2 className="section-headline">
            {t('experience.protocolTitle')} <span className="laser-text">{t('experience.protocolTitleHighlight')}</span>
          </h2>
          <div className="protocol-timeline">
            <div className="protocol-step">
              <span className="protocol-num">{t('experience.step1Num')}</span>
              <div className="protocol-info">
                <h3 className="card-title">{t('experience.step1Title')}</h3>
                <p className="body-medium text-muted">{t('experience.step1Text')}</p>
              </div>
            </div>
            <div className="protocol-step">
              <span className="protocol-num">{t('experience.step2Num')}</span>
              <div className="protocol-info">
                <h3 className="card-title">{t('experience.step2Title')}</h3>
                <p className="body-medium text-muted">{t('experience.step2Text')}</p>
              </div>
            </div>
            <div className="protocol-step">
              <span className="protocol-num">{t('experience.step3Num')}</span>
              <div className="protocol-info">
                <h3 className="card-title">{t('experience.step3Title')}</h3>
                <p className="body-medium text-muted">{t('experience.step3Text')}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="viewport-section section-light philosophy-banner">
        <div className="content-well max-width-small text-center">
          <h2 className="section-headline">
            {t('experience.philosophyTitle')} <br/>{t('experience.philosophyTitleLine2')}
          </h2>
          <p className="body-intro">{t('experience.philosophyText')}</p>
        </div>
      </section>
    </div>
  );
};

export default Experience;
