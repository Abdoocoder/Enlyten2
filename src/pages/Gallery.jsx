import React, { useState, useMemo } from 'react';
import './Gallery.css';
import Card from '../components/UI/Card/Card';
import { useGallery } from '../hooks/useDatabase';

const Gallery = () => {
  const { gallery, loading, error } = useGallery();
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Unified categories
  const categories = useMemo(() => {
    const rawCategories = gallery.map(item => item.category).filter(Boolean);
    return ['all', ...new Set(rawCategories)];
  }, [gallery]);

  const filteredGallery = useMemo(() => {
    if (selectedCategory === 'all') return gallery;
    return gallery.filter(item => item.category === selectedCategory);
  }, [gallery, selectedCategory]);

  return (
    <div className="gallery-page">
      {/* Gallery Hero */}
      <section className="viewport-section section-white gallery-hero-v2">
        <div className="content-well text-center">
          <span className="brand-accent">Clinical Results</span>
          <h1 className="hero-headline">Witness the <br/><span className="laser-text">Transformation</span></h1>
          <p className="body-intro max-width-small mx-auto">
            Experience the power of clinical precision. Browse our gallery of real results achieved through bespoke laser protocols.
          </p>
        </div>
      </section>

      {/* Category Selection */}
      <section className="category-strip-section section-white">
        <div className="content-well">
          <div className="category-strip">
            {categories.map(cat => (
              <button 
                key={cat}
                className={`category-pill ${selectedCategory === cat ? 'active' : ''}`}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </section>

      <main className="viewport-section section-white gallery-main">
        <div className="content-well">
          {loading && (
            <div className="loading-well text-center">
               <span className="laser-text body-medium">Curating gallery...</span>
            </div>
          )}

          {error && (
            <p className="body-medium error-banner">Error loading clinical records: {error}</p>
          )}

          {!loading && (
            <div className="gallery-grid-v2 animation-fade-in">
              {filteredGallery.map(item => (
                <Card key={item.id} variant="white" className="apple-card gallery-tile" padded={false}>
                  <div className="gallery-tile-image-side">
                    {item.image_url ? (
                      <>
                        <img src={item.image_url} alt={item.title} className="gallery-tile-img" />
                        <div className="tile-glow-overlay"></div>
                      </>
                    ) : (
                      <div className="gallery-placeholder">
                        <span className="label-medium text-muted">Awaiting Documentation</span>
                      </div>
                    )}
                    <span className="tile-category-tag">{item.category}</span>
                  </div>
                  <div className="gallery-tile-info">
                    <h3 className="card-title">{item.title}</h3>
                    <p className="body-small text-muted">{item.description}</p>
                  </div>
                </Card>
              ))}
            </div>
          )}

          {!loading && filteredGallery.length === 0 && !error && (
            <div className="empty-well text-center">
               <p className="body-medium text-muted">No results found in this category.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Gallery;
