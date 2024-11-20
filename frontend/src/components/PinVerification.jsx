// src/components/PendingOverlay/PendingOverlay.jsx
import './PendingOverlay.css';

const PendingOverlay = ({ message, subMessage }) => {
  return (
    <div className="pending-overlay">
      <div className="pending-content">
        <div className="pending-spinner"></div>
        <h2>{message || 'Under Review'}</h2>
        {subMessage && <p>{subMessage}</p>}
      </div>
    </div>
  );
};

export default PendingOverlay;