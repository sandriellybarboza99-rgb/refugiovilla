import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import './PhotoGalleryModal.css';

const PhotoGalleryModal = ({ isOpen, onClose, photos, title }) => {

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    
    return () => {
      document.body.style.overflow = 'auto';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !photos || photos.length === 0) return null;

  return (
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
            <div className="image-grid-item animate-fade" key={index} style={{ animationDelay: `${index * 0.05}s` }}>
              <img 
                src={photo} 
                alt={`Foto ${index + 1} de ${title}`} 
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PhotoGalleryModal;
