import React from 'react';
import './Contact.css';
import Card from '../components/UI/Card/Card';
import Input from '../components/UI/Input/Input';
import Button from '../components/UI/Button/Button';

const Contact = () => {
  return (
    <div className="contact-page page-container">
      <header className="contact-header section">
        <h1 className="headline-medium">Contact & Reviews</h1>
        <p className="body-large">We are here to help you achieve your luminous goals.</p>
      </header>

      <div className="contact-grid section">
        <div className="contact-form-side">
          <Card variant="white" className="contact-card">
            <h2 className="headline-small section-title">Send us a Message</h2>
            <form className="contact-form">
              <Input label="Name" placeholder="Jane Doe" />
              <Input label="Email" placeholder="jane@example.com" />
              <div className="input-group">
                <label className="input-label">Message</label>
                <textarea className="input-field textarea" placeholder="How can we help you today?"></textarea>
              </div>
              <Button variant="primary">Send Message</Button>
            </form>
          </Card>
        </div>

        <div className="contact-info-side">
          <Card variant="tonal" className="info-card">
            <h3 className="headline-small">Our Clinics</h3>
            <div className="clinic-list">
              <div className="clinic-item">
                <h4 className="body-large">Central Plaza</h4>
                <p className="body-medium">123 Radiance Blvd, City Center</p>
                <p className="body-medium">+1 (555) 123-4567</p>
              </div>
              <div className="clinic-item">
                <h4 className="body-large">West End Studio</h4>
                <p className="body-medium">456 Glow Lane, West End</p>
                <p className="body-medium">+1 (555) 987-6543</p>
              </div>
            </div>
          </Card>

          <Card variant="white" className="reviews-card">
            <h3 className="headline-small">Patient Reviews</h3>
            <div className="review-list">
              {[1, 2].map(i => (
                <div key={i} className="review-item">
                  <div className="review-stars">★★★★★</div>
                  <p className="body-medium">"Amazing results after my first Laser Genesis session. The staff is so professional and the clinic is stunning."</p>
                  <span className="label-medium">- Sarah W.</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Contact;
