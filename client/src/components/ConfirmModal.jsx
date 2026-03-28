import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

const ConfirmModal = ({ isOpen, onClose, onConfirm, title, message, confirmText, cancelText, type = 'danger' }) => {
  if (!isOpen) return null;

  return (
    <div className="ac-modal-overlay">
      <div className="ac-modal-container">
        <button className="ac-modal-close" onClick={onClose}>
          <X size={20} />
        </button>
        
        <div className="ac-modal-content">
          <div className={`ac-modal-icon ${type}`}>
            <AlertTriangle size={32} />
          </div>
          <h3 className="ac-modal-title">{title || 'Are you sure?'}</h3>
          <p className="ac-modal-message">{message || 'This action cannot be undone.'}</p>
        </div>

        <div className="ac-modal-footer">
          <button className="ac-modal-btn cancel" onClick={onClose}>
            {cancelText || 'Cancel'}
          </button>
          <button className={`ac-modal-btn confirm ${type}`} onClick={onConfirm}>
            {confirmText || 'Confirm'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
