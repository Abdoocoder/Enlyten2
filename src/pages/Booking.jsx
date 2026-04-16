import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import './Booking.css';
import Input from '../components/UI/Input/Input';
import Button from '../components/UI/Button/Button';
import Card from '../components/UI/Card/Card';
import { useServices } from '../hooks/useDatabase';
import { useAuth } from '../contexts/AuthContext';
import { createBooking } from '../lib/supabase';
import { useTranslation } from 'react-i18next';

const Booking = () => {
  const [searchParams] = useSearchParams();
  const { services, loading: servicesLoading } = useServices();
  const { user, isAuthenticated } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();
  
  const [currentStep, setCurrentStep] = useState(1);
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
    if (currentStep < 3) {
        setCurrentStep(currentStep + 1);
        return;
    }
    
    setError(null);
    try {
      setLoading(true);
      const { error: bookingError } = await createBooking({
        user_id: user.id,
        service_id: selectedService,
        booking_date: bookingDate,
        booking_time: bookingTime,
        notes: notes || null,
        status: 'pending',
      });

      if (bookingError) throw bookingError;
      navigate('/dashboard?booking=success');
    } catch (err) {
      setError(err.message || 'Failed to create booking');
    } finally {
      setLoading(false);
    }
  };

  const timeSlots = [
    '09:00', '10:00', '11:00', '14:00', '15:00', '16:00'
  ];

  const today = new Date().toISOString().split('T')[0];
  const selectedServiceData = services.find(s => s.id === selectedService);

  return (
    <div className="booking-page">
      {/* Booking Header */}
      <section className="viewport-section section-dark booking-hero">
        <div className="content-well text-center">
          <h1 className="hero-headline">Book Your Transformation</h1>
          <div className="step-indicator">
            <div className={`step ${currentStep >= 1 ? 'active' : ''}`}>1. Treatment</div>
            <div className="step-line"></div>
            <div className={`step ${currentStep >= 2 ? 'active' : ''}`}>2. Schedule</div>
            <div className="step-line"></div>
            <div className={`step ${currentStep >= 3 ? 'active' : ''}`}>3. Confirm</div>
          </div>
        </div>
      </section>

      <main className="viewport-section section-white">
        <div className="content-well max-width-small">
          {error && <div className="error-banner">{error}</div>}
          
          <form className="booking-form-v2" onSubmit={handleSubmit}>
            
            {/* Step 1: Treatment Selection */}
            {currentStep === 1 && (
              <div className="booking-step-content animation-fade-in">
                <h2 className="section-headline text-center">Select Your Service</h2>
                <div className="treatment-tiles">
                  {services.map(service => (
                    <div 
                      key={service.id} 
                      className={`treatment-tile ${selectedService === service.id ? 'selected' : ''}`}
                      onClick={() => setSelectedService(service.id)}
                    >
                      <div className="tile-info">
                        <h4 className="card-title">{service.name}</h4>
                        <p className="body-medium text-muted">{service.duration_minutes} min • ${service.price}</p>
                      </div>
                      <div className="tile-check"></div>
                    </div>
                  ))}
                </div>
                <div className="step-actions centered">
                  <Button 
                    variant="primary" 
                    className="btn-pill btn-large"
                    disabled={!selectedService}
                    onClick={() => setCurrentStep(2)}
                  >
                    Continue to Schedule
                  </Button>
                </div>
              </div>
            )}

            {/* Step 2: Date & Time */}
            {currentStep === 2 && (
              <div className="booking-step-content animation-fade-in">
                <h2 className="section-headline text-center">Choose Date & Time</h2>
                <div className="schedule-grid">
                  <div className="date-picker-well">
                     <label className="label-medium">Select Date</label>
                     <input 
                        type="date" 
                        className="apple-date-input"
                        min={today}
                        value={bookingDate}
                        onChange={(e) => setBookingDate(e.target.value)}
                     />
                  </div>
                  <div className="time-picker-well">
                    <label className="label-medium">Available Slots</label>
                    <div className="time-slots-grid">
                      {timeSlots.map(time => (
                        <button 
                          key={time} 
                          type="button"
                          className={`time-pill ${bookingTime === time ? 'active' : ''}`}
                          onClick={() => setBookingTime(time)}
                        >
                          {time}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="step-actions space-between">
                  <button type="button" className="pill-link" onClick={() => setCurrentStep(1)}>Back</button>
                  <Button 
                    variant="primary" 
                    className="btn-pill"
                    disabled={!bookingDate || !bookingTime}
                    onClick={() => setCurrentStep(3)}
                  >
                    Review Details
                  </Button>
                </div>
              </div>
            )}

            {/* Step 3: Confirmation */}
            {currentStep === 3 && (
              <div className="booking-step-content animation-fade-in">
                <h2 className="section-headline text-center">Confirm Your Visit</h2>
                <div className="apple-card confirmation-card">
                   <div className="confirm-row">
                      <span className="label-medium">Treatment</span>
                      <span className="body-intro">{selectedServiceData?.name}</span>
                   </div>
                   <div className="confirm-row">
                      <span className="label-medium">Date & Time</span>
                      <span className="body-intro">{bookingDate} at {bookingTime}</span>
                   </div>
                   <div className="confirm-row">
                      <span className="label-medium">Client</span>
                      <span className="body-intro">{user?.email}</span>
                   </div>
                   <textarea 
                      className="apple-textarea"
                      placeholder="Special requests or skin concerns..."
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                   />
                </div>
                <div className="step-actions space-between">
                  <button type="button" className="pill-link" onClick={() => setCurrentStep(2)}>Back</button>
                  <Button 
                    variant="primary" 
                    type="submit"
                    className="btn-pill laser-glow-btn"
                    disabled={loading}
                  >
                    {loading ? 'Confirming...' : 'Confirm Bookings'}
                  </Button>
                </div>
              </div>
            )}

          </form>
        </div>
      </main>
    </div>
  );
};

export default Booking;
