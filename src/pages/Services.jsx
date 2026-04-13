import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Services.css';
import Card from '../components/UI/Card/Card';
import Button from '../components/UI/Button/Button';
import { useServices } from '../hooks/useDatabase';
import { useAuth } from '../contexts/AuthContext';

const Services = () => {
  const { services, loading, error } = useServices();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Group services by category
  const categories = [...new Set(services.map(s => s.category))];

  const handleBooking = (serviceId) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    navigate(`/book?serviceId=${serviceId}`);
  };

  return (
    <div className="services-page">
      <section className="services-hero">
        <div className="section-container">
          <h1 className="display-large">Our Services</h1>
          <p className="body-large">Precision meets luxury. Discover our curated range of aesthetic transformations designed for your unique skin.</p>
        </div>
      </section>

      {loading && (
        <section className="loading-section">
          <div className="section-container">
            <p className="body-medium">Loading services...</p>
          </div>
        </section>
      )}

      {error && (
        <section className="error-section">
          <div className="section-container">
            <p className="body-medium error-message">Error loading services: {error}</p>
          </div>
        </section>
      )}

      {!loading && categories.length > 0 && categories.map(category => (
        <section key={category} className="service-category">
          <div className="section-container">
            <h2 className="headline-medium category-title">{category}</h2>
            <div className="services-grid">
              {services
                .filter(s => s.category === category)
                .map(service => (
                  <Card key={service.id} variant="white" className="service-card">
                    {service.image_url && (
                      <img src={service.image_url} alt={service.name} className="service-image" />
                    )}
                    <div className="service-content">
                      <h3 className="headline-small">{service.name}</h3>
                      <p className="body-medium">{service.description}</p>
                      <div className="service-details">
                        {service.duration_minutes && (
                          <span className="detail-item">{service.duration_minutes} mins</span>
                        )}
                        <span className="detail-item">${service.price}</span>
                      </div>
                    </div>
                    <Button 
                      variant="primary"
                      onClick={() => handleBooking(service.id)}
                    >
                      Book Appointment
                    </Button>
                  </Card>
                ))}
            </div>
          </div>
        </section>
      ))}

      {!loading && services.length === 0 && !error && (
        <section className="empty-section">
          <div className="section-container">
            <p className="body-medium">No services available at the moment.</p>
          </div>
        </section>
      )}
    </div>
  );
};

export default Services;
