import React from 'react';
import { X, MapPin, Navigation, Car } from 'lucide-react';
import './TouristSpotModal.css';

const TouristSpotModal = ({ isOpen, onClose, spot }) => {
  if (!isOpen || !spot) return null;

  return (
    <div className="tourist-modal-overlay animate-fade" onClick={onClose}>
      <div className="tourist-modal-wrapper animate-slide-up" onClick={e => e.stopPropagation()}>
        <button className="tourist-modal-close" onClick={onClose}>
          <X size={24} />
        </button>
        
        <div className="tourist-modal-content">
          <div className="tourist-modal-image">
            <img src={spot.image} alt={spot.title} />
          </div>
          
          <div className="tourist-modal-body">
            <h2 className="tourist-modal-title">{spot.title}</h2>
            
            <div className="tourist-modal-description">
              <p>{spot.description}</p>
            </div>
            
            <div className="tourist-modal-details">
              <div className="tourist-modal-detail-item">
                <Navigation className="detail-icon" size={20} />
                <div>
                  <strong>Como chegar:</strong>
                  <p>{spot.directions}</p>
                </div>
              </div>
              
              <div className="tourist-modal-detail-item">
                <Car className="detail-icon" size={20} />
                <div>
                  <strong>De carro (do condomínio):</strong>
                  <p>{spot.distanceCar} minutos</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TouristSpotModal;
