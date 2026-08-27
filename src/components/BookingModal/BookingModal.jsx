import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import BookingSimulator from '../BookingSimulator/BookingSimulator';
import './BookingModal.css';

const BookingModal = ({ isOpen, onClose }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="booking-modal-overlay" onClick={onClose}>
      <div className="booking-modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="booking-modal-close" onClick={onClose}>
          <X size={24} />
        </button>
        <BookingSimulator />
      </div>
    </div>
  );
};

export default BookingModal;
