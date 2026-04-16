import React from 'react';
import './Experience.css';
import Button from '../components/UI/Button/Button';
import heroImg from '../assets/hero-clinic.png';
import { useNavigate } from 'react-router-dom';

const Experience = () => {
  const navigate = useNavigate();

  return (
    <div className="experience-page">
      {/* Cinematic Split Hero */}
      <section className="viewport-section section-dark experience-hero-v2">
        <div className="experience-hero-grid">
          <div className="experience-image-well animation-fade-in">
            <img src={heroImg} alt="Luxury Enlyten2 Clinic Interior" className="full-bleed-img" />
            <div className="img-gloss"></div>
          </div>
          
          <div className="experience-text-well">
            <div className="content-well-mini">
              <span className="brand-accent">Beyond The Surface</span>
              <h1 className="hero-headline">The Enlyten2 <br/><span className="laser-text">Experience</span></h1>
              <p className="body-intro text-dim">
                We believe skin health is a clinical art. Our sanctuary combines world-leading laser technology with an editorial eye for natural, high-performance results.
              </p>
              <div className="experience-cta-group">
                <Button variant="primary" className="btn-pill btn-large" onClick={() => navigate('/booking')}>
                  Start Your Journey
                </Button>
                <button className="pill-link" onClick={() => navigate('/services')}>View the Collection</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The Protocol - Narrative Sequence */}
      <section className="viewport-section section-white the-protocol">
        <div className="content-well text-center">
          <span className="brand-accent">Our Protocol</span>
          <h2 className="section-headline">Science. Luxury. <span className="laser-text">Radiance.</span></h2>
          
          <div className="protocol-timeline">
            <div className="protocol-step">
              <span className="protocol-num">01</span>
              <div className="protocol-info">
                 <h3 className="card-title">Consultation</h3>
                 <p className="body-medium text-muted">A deep clinical analysis of your skin's unique blueprint using high-resolution skin mapping technology.</p>
              </div>
            </div>

            <div className="protocol-step">
              <span className="protocol-num">02</span>
              <div className="protocol-info">
                 <h3 className="card-title">Curation</h3>
                 <p className="body-medium text-muted">A bespoke protocol curated by our clinicians, selecting from the world's most advanced laser platforms.</p>
              </div>
            </div>

            <div className="protocol-step">
              <span className="protocol-num">03</span>
              <div className="protocol-info">
                 <h3 className="card-title">Enlightenment</h3>
                 <p className="body-medium text-muted">Revealing your most luminous skin yet through precise, high-trust clinical execution.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="viewport-section section-light philosophy-banner">
         <div className="content-well max-width-small text-center">
            <h2 className="section-headline">Artisan Care, <br/>Clinical Rigor.</h2>
            <p className="body-intro">
               Every treatment at Enlyten2 is a signature experience. We don't just treat skin; we refine it with the precision of a laser and the soul of a gallery.
            </p>
         </div>
      </section>
    </div>
  );
};

export default Experience;
