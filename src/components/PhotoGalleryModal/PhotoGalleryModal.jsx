import React, { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import './PhotoGalleryModal.css';

const PhotoGalleryModal = ({ isOpen, onClose, photos, title }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Reseta o índice sempre que o modal abre ou as fotos mudam
  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(0);
      document.body.style.overflow = 'hidden'; // Evita rolagem da página por baixo
    } else {
      document.body.style.overflow = 'auto';
    }
    
    // Limpeza ao desmontar
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen, photos]);

  if (!isOpen || !photos || photos.length === 0) return null;

  const nextPhoto = () => {
    setCurrentIndex((prev) => (prev + 1) % photos.length);
  };

  const prevPhoto = () => {
    setCurrentIndex((prev) => (prev - 1 + photos.length) % photos.length);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') onClose();
    if (e.key === 'ArrowRight') nextPhoto();
    if (e.key === 'ArrowLeft') prevPhoto();
  };

  // Permite navegação por teclado quando o modal está aberto
  useEffect(() => {
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  });

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          <X size={32} />
        </button>
        
        <div className="modal-header">
          <h2>{title}</h2>
          <span className="photo-counter">
            {currentIndex + 1} / {photos.length}
          </span>
        </div>

        <div className="modal-body">
          <button className="nav-btn prev" onClick={prevPhoto}>
            <ChevronLeft size={48} />
          </button>
          
          <div className="image-container animate-fade" key={currentIndex}>
            <img 
              src={photos[currentIndex]} 
              alt={`Foto ${currentIndex + 1} de ${title}`} 
            />
          </div>

          <button className="nav-btn next" onClick={nextPhoto}>
            <ChevronRight size={48} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default PhotoGalleryModal;
