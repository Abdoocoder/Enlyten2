import React from 'react';
import './Gallery.css';
import Card from '../components/UI/Card/Card';
import { useGallery } from '../hooks/useDatabase';

const Gallery = () => {
  const { gallery, loading, error } = useGallery();

  return (
    <div className="gallery-page">
      <section className="gallery-hero">
        <div className="section-container">
          <h1 className="display-large">Before & After</h1>
          <p className="body-large">Witness the transformative power of our clinical expertise. Real results, real patients, real radiance.</p>
        </div>
      </section>

      <section className="gallery-section">
        <div className="section-container">
          {loading && (
            <p className="body-medium">Loading gallery...</p>
          )}

          {error && (
            <p className="body-medium error-message">Error loading gallery: {error}</p>
          )}

          {!loading && (
            <div className="gallery-grid">
              {gallery.map(item => (
                <Card key={item.id} variant="white" className="gallery-card" padded={false}>
                  <div className="gallery-image-container">
                    {item.image_url ? (
                      <img src={item.image_url} alt={item.title} className="gallery-image" />
                    ) : (
                      <div className="gallery-image-placeholder">
                        <span className="label-medium">No Image</span>
                      </div>
                    )}
                  </div>
                  <div className="gallery-info card-padded">
                    <h3 className="headline-small">{item.title}</h3>
                    <p className="body-medium">{item.description}</p>
                    {item.category && (
                      <span className="label-medium category-tag">{item.category}</span>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          )}

          {!loading && gallery.length === 0 && !error && (
            <p className="body-medium">No gallery items available at the moment.</p>
          )}
        </div>
      </section>
    </div>
  );
};

export default Gallery;
