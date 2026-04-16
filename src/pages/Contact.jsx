import React from 'react';
import './Contact.css';
import Card from '../components/UI/Card/Card';
import Button from '../components/UI/Button/Button';
import { useTranslation } from 'react-i18next';
import mockData from '../data/mockData.json';

const Contact = () => {
  const { t } = useTranslation();
  const { clinics, doctors } = mockData;
  const clinic = clinics[0];

  return (
    <div className="contact-page">

      <section className="viewport-section section-dark contact-hero">
        <div className="content-well text-center">
          <h1 className="hero-headline">{t('contact.title')}</h1>
          <p className="body-intro hero-subtitle">{t('contact.subtitle')}</p>
        </div>
      </section>

      <section className="viewport-section section-light contact-body">
        <div className="content-well contact-grid">

          {/* Info Side */}
          <div className="contact-info-col">

            <div className="apple-card info-block">
              <span className="label-medium brand-accent">{t('contact.address')}</span>
              <p className="body-medium">{t('contact.addressValue')}</p>
            </div>

            <div className="apple-card info-block">
              <span className="label-medium brand-accent">{t('contact.phone')}</span>
              <a href={`tel:${clinic.phone}`} className="contact-phone">{clinic.phone}</a>
            </div>

            <div className="apple-card info-block">
              <span className="label-medium brand-accent">{t('contact.hours')}</span>
              <p className="body-medium">{t('contact.hoursValue')}</p>
            </div>

            <div className="apple-card info-block doctors-block">
              <span className="label-medium brand-accent">{t('contact.doctors')}</span>
              {doctors.map(doc => (
                <div key={doc.id} className="doctor-item">
                  <p className="body-medium doctor-name">{doc.name}</p>
                  <p className="body-small doctor-specialty">{doc.specialty}</p>
                  {doc.phone1 && (
                    <div className="doctor-phones">
                      <a href={`tel:${doc.phone1}`} className="doctor-phone">{doc.phone1}</a>
                      {doc.phone2 && <a href={`tel:${doc.phone2}`} className="doctor-phone">{doc.phone2}</a>}
                    </div>
                  )}
                </div>
              ))}
            </div>

          </div>

          {/* Form Side */}
          <div className="contact-form-col">
            <div className="apple-card form-card">
              <h2 className="section-headline">{t('contact.sendMessage')}</h2>
              <form className="contact-form">
                <div className="form-group">
                  <label className="form-label label-medium">{t('contact.name')}</label>
                  <input className="form-input" type="text" placeholder={t('contact.name')} />
                </div>
                <div className="form-group">
                  <label className="form-label label-medium">{t('contact.phone')}</label>
                  <input className="form-input" type="tel" placeholder="07xxxxxxxx" />
                </div>
                <div className="form-group">
                  <label className="form-label label-medium">{t('contact.message')}</label>
                  <textarea className="form-input form-textarea" rows={5} placeholder={t('contact.message')} />
                </div>
                <Button variant="primary" className="btn-pill">{t('contact.send')}</Button>
              </form>
            </div>
          </div>

        </div>
      </section>

    </div>
  );
};

export default Contact;
