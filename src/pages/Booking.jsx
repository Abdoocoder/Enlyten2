import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import './Booking.css';
import Input from '../components/UI/Input/Input';
import Button from '../components/UI/Button/Button';
import Card from '../components/UI/Card/Card';
import skinGlowImg from '../assets/skin-glow.png';
import { useServices } from '../hooks/useDatabase';
import { useAuth } from '../contexts/AuthContext';
import { createBooking } from '../lib/supabase';

const Booking = () => {
  const [searchParams] = useSearchParams();
  const { services } = useServices();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  const [selectedService, setSelectedService] = useState(searchParams.get('serviceId') || null);
  const [bookingDate, setBookingDate] = useState('');
  const [bookingTime, setBookingTime] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!selectedService || !bookingDate || !bookingTime) {
      setError('Please select a service, date, and time');
      return;
    }

    try {
      setLoading(true);
      const { data, error: bookingError } = await createBooking({
        user_id: user.id,
        service_id: selectedService,
        booking_date: bookingDate,
        booking_time: bookingTime,
        notes: notes || null,
        status: 'pending',
      });

      if (bookingError) throw bookingError;
      
      // Redirect to dashboard with success message
      navigate('/dashboard?booking=success');
    } catch (err) {
      setError(err.message || 'Failed to create booking');
      console.error('Booking error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Generate time slots
  const timeSlots = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '14:00', '14:30', '15:00', '15:30', '16:00', '16:30'
  ];

  // Get minimum date (today)
  const today = new Date().toISOString().split('T')[0];

  const selectedServiceData = services.find(s => s.id === selectedService);

  return (
    <div className="booking-page">
      <div className="booking-layout page-container">
        
        {/* Left Column: Form */}
        <div className="booking-form-section section-left">
          <h1 className="display-large">Book Your Glow</h1>
          <p className="body-large booking-subtitle">Experience medical excellence tailored to your unique beauty.</p>
          
          {error && <div className="error-message">{error}</div>}
          
          <form className="booking-form bg-tonal card-padded" onSubmit={handleSubmit}>
            <h2 className="headline-small form-section-title">Select Treatment</h2>
            <div className="treatment-selection">
              {services.map(service => (
                <div 
                  key={service.id} 
                  className={`treatment-option ${selectedService === service.id ? 'selected' : ''}`}
                  onClick={() => setSelectedService(service.id)}
                >
                  <div>
                    <h4 className="body-large">{service.name}</h4>
                    <p className="body-medium text-muted">
                      {service.duration_minutes ? `${service.duration_minutes} mins` : ''} 
                      {service.price ? ` • $${service.price}` : ''}
                    </p>
                  </div>
                  <div className="radio-circle"></div>
                </div>
              ))}
              {services.length === 0 && (
                <p className="body-medium">No services available. Please check back later.</p>
              )}
            </div>

            {selectedServiceData && (
              <div className="selected-service-details card-padded" style={{backgroundColor: 'rgba(255,255,255,0.5)'}}>
                <p className="body-small">{selectedServiceData.description}</p>
              </div>
            )}

            <h2 className="headline-small form-section-title">Schedule Your Appointment</h2>
            <div className="form-grid">
              <Input 
                label="Appointment Date" 
                type="date"
                min={today}
                value={bookingDate}
                onChange={(e) => setBookingDate(e.target.value)}
                required
              />
            </div>

            <h2 className="headline-small form-section-title">Available Times</h2>
            <div className="availability-grid">
              {timeSlots.map(time => (
                <button 
                  key={time} 
                  type="button"
                  className={`time-slot ${bookingTime === time ? 'selected' : ''}`}
                  onClick={() => setBookingTime(time)}
                >
                  {time}
                </button>
              ))}
            </div>

            <h2 className="headline-small form-section-title">Additional Notes</h2>
            <textarea 
              className="notes-input"
              placeholder="Add any special requests or notes for your appointment..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              maxLength="200"
              rows="3"
            ></textarea>

            <div className="form-actions">
              <Button 
                variant="primary" 
                type="submit"
                disabled={loading || !selectedService || !bookingDate || !bookingTime}
              >
                {loading ? 'Confirming...' : 'Confirm Appointment'}
              </Button>
            </div>
          </form>
        </div>

        {/* Right Column: Imagery & Philosophy */}
        <div className="booking-info-section section-right">
          <div className="booking-image-wrapper">
             <img src={skinGlowImg} alt="Radiant Skin" className="booking-image" />
          </div>
          <Card variant="white" className="booking-philosophy-card">
            <h3 className="headline-small">Illuminating Natural Beauty</h3>
            <p className="body-medium">Our expert clinicians ensure every treatment enhances your natural bone structure and skin health.</p>
            <div className="exclusive-perk">
              <span className="label-medium">Exclusive</span>
              <p className="body-medium">First-time clients receive a complimentary skin analysis.</p>
            </div>
          </Card>
        </div>

      </div>
    </div>
  );
};

export default Booking;
