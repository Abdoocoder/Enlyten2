import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './Booking.css';
import Button from '../components/UI/Button/Button';
import { useServices } from '../hooks/useDatabase';
import { useAuth } from '../contexts/AuthContext';
import { createBooking, getBookedSlots, getHolidays } from '../lib/supabase';
import useAuthGuard from '../hooks/useAuthGuard';
import mockData from '../data/mockData.json';

const MOCK_SERVICES = mockData.treatments.map((t, i) => ({
  id: t.id,
  name: t.name,
  name_ar: t.name_ar,
  description: t.description,
  description_ar: t.description_ar,
  duration_minutes: parseInt(t.duration) || 45,
  price: t.price,
  category: t.category,
  is_active: true,
  _isMock: true,
}));

const TIME_SLOTS = ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00'];

const Booking = () => {
  const [searchParams] = useSearchParams();
  const { services: dbServices, loading: servicesLoading } = useServices();
  const services = dbServices.length > 0 ? dbServices : (servicesLoading ? [] : MOCK_SERVICES);
  const { user } = useAuth();
  useAuthGuard();
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  const [currentStep, setCurrentStep] = useState(1);
  const [selectedService, setSelectedService] = useState(searchParams.get('serviceId') || null);
  const [bookingDate, setBookingDate] = useState('');
  const [bookingTime, setBookingTime] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [bookedSlots, setBookedSlots] = useState([]);
  const [holidays, setHolidays] = useState([]);
  const [slotsLoading, setSlotsLoading] = useState(false);

  const isAr = i18n.language === 'ar';

  useEffect(() => {
    getHolidays().then(({ data }) => {
      if (data) setHolidays(data.map(h => h.holiday_date));
    });
  }, []);

  useEffect(() => {
    if (!bookingDate) { setBookedSlots([]); return; }
    if (holidays.includes(bookingDate)) {
      setBookedSlots(TIME_SLOTS); // Block all slots
      return;
    }
    setSlotsLoading(true);
    getBookedSlots(bookingDate)
      .then(({ data }) => setBookedSlots(data))
      .finally(() => setSlotsLoading(false));
  }, [bookingDate, holidays]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (currentStep < 3) { setCurrentStep(currentStep + 1); return; }
    setError(null);
    const isUUID = (str) => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str);

    try {
      setLoading(true);
      
      if (!isUUID(selectedService)) {
        throw new Error(t('booking.errorInvalidService', 'Selected service is in demo mode. Please seed the database to enable real bookings.'));
      }

      const { error: bookingError } = await createBooking({
        user_id: user.id,
        service_id: selectedService,
        booking_date: bookingDate,
        booking_time: bookingTime,
        notes: notes || null,
        status: 'pending',
      });
      if (bookingError) {
        if (bookingError.message === 'slot_taken') {
          setCurrentStep(2);
          setBookingTime('');
          throw new Error(t('booking.slotTaken'));
        }
        throw bookingError;
      }
      navigate('/dashboard?booking=success');
    } catch (err) {
      setError(err.message || t('booking.errorFailed'));
    } finally {
      setLoading(false);
    }
  };

  const today = new Date().toISOString().split('T')[0];

  const selectedServiceData = useMemo(
    () => services.find(s => s.id === selectedService),
    [services, selectedService]
  );

  const formattedDate = useMemo(() => {
    if (!bookingDate) return '';
    return new Date(bookingDate + 'T00:00:00').toLocaleDateString(
      isAr ? 'ar' : 'en-US',
      { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }
    );
  }, [bookingDate, isAr]);

  const serviceName = (s) => isAr && s?.name_ar ? s.name_ar : s?.name;
  const serviceDesc = (s) => isAr && s?.description_ar ? s.description_ar : s?.description;

  return (
    <div className="booking-page">
      <section className="booking-hero">
        <div className="content-well text-center">
          <h1 className="hero-headline">{t('booking.title')}</h1>
          <div className="step-indicator">
            <div className={`step ${currentStep >= 1 ? 'active' : ''}`}>{t('booking.step1')}</div>
            <div className="step-line"></div>
            <div className={`step ${currentStep >= 2 ? 'active' : ''}`}>{t('booking.step2')}</div>
            <div className="step-line"></div>
            <div className={`step ${currentStep >= 3 ? 'active' : ''}`}>{t('booking.step3')}</div>
          </div>
        </div>
      </section>

      <main className="viewport-section section-white">
        <div className="content-well max-width-small">
          {error && <div className="error-banner">{error}</div>}

          <form className="booking-form-v2" onSubmit={handleSubmit}>

            {currentStep === 1 && (
              <div className="booking-step-content animation-fade-in">
                <h2 className="section-headline text-center">{t('booking.selectService')}</h2>

                {servicesLoading ? (
                  <div className="services-skeleton">
                    {[1, 2, 3].map(i => <div key={i} className="tile-skeleton" />)}
                  </div>
                ) : services.length === 0 ? (
                  <p className="body-medium text-muted text-center">{t('booking.noServices', 'No services available.')}</p>
                ) : (
                  <div className="treatment-tiles">
                    {services.map(service => (
                      <div
                        key={service.id}
                        className={`treatment-tile ${selectedService === service.id ? 'selected' : ''}`}
                        onClick={() => setSelectedService(service.id)}
                      >
                        <div className="tile-info">
                          <h4 className="card-title">{serviceName(service)}</h4>
                          {serviceDesc(service) && (
                            <p className="tile-desc body-medium text-muted">{serviceDesc(service)}</p>
                          )}
                          <p className="tile-meta label-medium">
                            {service.duration_minutes} {t('services.min')}
                            <span className="tile-dot">·</span>
                            {service.price} JD
                          </p>
                        </div>
                        <div className="tile-check"></div>
                      </div>
                    ))}
                  </div>
                )}

                <div className="step-actions centered">
                  <Button variant="primary" className="btn-pill btn-large" disabled={!selectedService} onClick={() => setCurrentStep(2)}>
                    {t('booking.continueSchedule')}
                  </Button>
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="booking-step-content animation-fade-in">
                <h2 className="section-headline text-center">{t('booking.chooseDateTime')}</h2>
                <div className="schedule-grid">
                  <div className="date-picker-well">
                    <label className="label-medium">{t('booking.selectDate')}</label>
                    <input
                      type="date"
                      className="apple-date-input"
                      min={today}
                      value={bookingDate}
                      onChange={(e) => { setBookingDate(e.target.value); setBookingTime(''); }}
                    />
                  </div>
                  <div className="time-picker-well">
                    <label className="label-medium">{t('booking.availableSlots')}</label>
                    {!bookingDate ? (
                      <p className="slots-hint body-medium text-muted">{t('booking.selectDateFirst', 'Please select a date first.')}</p>
                    ) : slotsLoading ? (
                      <p className="slots-hint body-medium text-muted">...</p>
                    ) : (
                      <div className="time-slots-grid">
                        {TIME_SLOTS.map(time => {
                          const taken = bookedSlots.includes(time);
                          return (
                            <button
                              key={time}
                              type="button"
                              className={`time-pill ${bookingTime === time ? 'active' : ''} ${taken ? 'taken' : ''}`}
                              onClick={() => !taken && setBookingTime(time)}
                              disabled={taken}
                              title={taken ? t('booking.slotUnavailable') : undefined}
                            >
                              {time}
                              {taken && <span className="slot-taken-label">{t('booking.slotUnavailable')}</span>}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
                <div className="step-actions space-between">
                  <button type="button" className="pill-link" onClick={() => setCurrentStep(1)}>{t('booking.back')}</button>
                  <Button variant="primary" className="btn-pill" disabled={!bookingDate || !bookingTime} onClick={() => setCurrentStep(3)}>
                    {t('booking.reviewDetails')}
                  </Button>
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="booking-step-content animation-fade-in">
                <h2 className="section-headline text-center">{t('booking.confirmVisit')}</h2>
                <div className="apple-card confirmation-card">
                  <div className="confirm-row">
                    <span className="label-medium">{t('booking.treatment')}</span>
                    <span className="body-intro">{serviceName(selectedServiceData)}</span>
                  </div>
                  <div className="confirm-row">
                    <span className="label-medium">{t('booking.dateTime')}</span>
                    <span className="body-intro">{formattedDate} — {bookingTime}</span>
                  </div>
                  <div className="confirm-row">
                    <span className="label-medium">{t('booking.price', 'Price')}</span>
                    <span className="body-intro confirm-price">{selectedServiceData?.price} JD</span>
                  </div>
                  <div className="confirm-row">
                    <span className="label-medium">{t('booking.client')}</span>
                    <span className="body-intro">{user?.email}</span>
                  </div>
                  <textarea
                    className="apple-textarea"
                    placeholder={t('booking.notesPlaceholder')}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  />
                </div>
                <div className="step-actions space-between">
                  <button type="button" className="pill-link" onClick={() => setCurrentStep(2)}>{t('booking.back')}</button>
                  <Button variant="primary" type="submit" className="btn-pill laser-glow-btn" disabled={loading}>
                    {loading ? t('booking.confirming') : t('booking.confirm')}
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
