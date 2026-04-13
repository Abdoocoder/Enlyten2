import React from 'react';
import './Experience.jsx';
import'./Experience.css';
import Button from '../components/UI/Button/Button';
import heroImg from '../assets/hero-clinic.png';

const Experience = () => {
  return (
    <div className="experience-page">
      <section className="experience-hero">
        <div className="experience-image-side">
          <img src={heroImg} alt="Luxury Experience" />
        </div>
        <div className="experience-content-side">
          <span className="label-medium luxury-label">Personalized Care</span>
          <h1 className="display-large">The Enlyten2 Experience</h1>
          <p className="body-large">More than just a clinic. A sanctuary for your skin's transformation. We combine the world's most advanced laser systems with an editorial approach to beauty.</p>
          <div className="experience-actions">
            <Button variant="primary">Begin Your Journey</Button>
            <Button variant="secondary">View Treatments</Button>
          </div>
        </div>
      </section>

      <section className="experience-philosophy section-container">
          <div className="philosophy-content">
            <h2 className="headline-medium">Science. Luxury. Radiance.</h2>
            <div className="philosophy-steps">
                <div className="step">
                    <span className="step-num">01</span>
                    <h4 className="headline-small">Consult</h4>
                    <p className="body-medium">A deep clinical analysis of your skin's unique blueprint.</p>
                </div>
                <div className="step">
                    <span className="step-num">02</span>
                    <h4 className="headline-small">Curate</h4>
                    <p className="body-medium">A personalized protocol using world-class laser technology.</p>
                </div>
                <div className="step">
                    <span className="step-num">03</span>
                    <h4 className="headline-small">Enlighten</h4>
                    <p className="body-medium">Revealing your most luminous, healthy skin yet.</p>
                </div>
            </div>
          </div>
      </section>
    </div>
  );
};

export default Experience;
