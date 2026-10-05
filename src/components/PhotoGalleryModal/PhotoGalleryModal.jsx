import React, { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import './PhotoGalleryModal.css';

const PhotoGalleryModal = ({ isOpen, onClose, photos, title }) => {
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (selectedPhotoIndex !== null) setSelectedPhotoIndex(null);
        else onClose();
      } else if (e.key === 'ArrowLeft' && selectedPhotoIndex !== null) {
        setSelectedPhotoIndex(prev => prev > 0 ? prev - 1 : photos.length - 1);
      } else if (e.key === 'ArrowRight' && selectedPhotoIndex !== null) {
        setSelectedPhotoIndex(prev => prev < photos.length - 1 ? prev + 1 : 0);
      }
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    
    return () => {
      document.body.style.overflow = 'auto';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose, selectedPhotoIndex, photos]);

  const handlePrev = (e) => {
    e.stopPropagation();
    setSelectedPhotoIndex(prev => prev > 0 ? prev - 1 : photos.length - 1);
  };

  const handleNext = (e) => {
    e.stopPropagation();
    setSelectedPhotoIndex(prev => prev < photos.length - 1 ? prev + 1 : 0);
  };

  if (!isOpen || !photos || photos.length === 0) return null;

  return (
    <>
      <div className="modal-overlay" onClick={onClose} style={{ display: 'flex' }}>
        <div className="modal-content-grid" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          <X size={32} />
        </button>
        
        <div className="modal-header">
          <h2>{title}</h2>
          <span className="photo-counter">
            {photos.length} fotos
          </span>
        </div>

        <div className="modal-body-grid">
          {photos.map((photo, index) => (
            <div 
              className="image-grid-item animate-fade" 
              key={index} 
              style={{ animationDelay: `${index * 0.05}s` }}
              onClick={() => setSelectedPhotoIndex(index)}
            >
              <img 
                src={photo} 
                alt={`Foto ${index + 1} de ${title}`} 
              />
            </div>
          ))}
        </div>
        </div>
      </div>

      {selectedPhotoIndex !== null && (
        <div className="fullscreen-photo-overlay" onClick={() => setSelectedPhotoIndex(null)}>
          <button className="fullscreen-close" onClick={() => setSelectedPhotoIndex(null)}>
            <X size={32} />
          </button>
          
          <button className="fullscreen-nav prev" onClick={handlePrev}>
            <ChevronLeft size={48} />
          </button>
          <button className="fullscreen-nav next" onClick={handleNext}>
            <ChevronRight size={48} />
          </button>

          <img 
            src={photos[selectedPhotoIndex]} 
            alt={`Foto ampliada ${selectedPhotoIndex + 1}`} 
            className="fullscreen-image" 
            onClick={(e) => e.stopPropagation()} 
          />
        </div>
      )}
    </>
  );
};

export default PhotoGalleryModal;
