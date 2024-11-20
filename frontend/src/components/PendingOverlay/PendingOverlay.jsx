
// components/PendingOverlay/PendingOverlay.jsx
import './PendingOverlay.css';

const PendingOverlay = () => {
  return (
    <div className="pending-overlay">
      <div className="pending-content">
        <div className="pending-spinner"></div>
        <h2>Račun je pod provjerom</h2>
        <p>Vaš poslovni račun je trenutno u procesu verifikacije. Administrator će pregledati vaše podatke.</p>
        <p>Bit ćete obaviješteni putem e-maila kada vaš račun bude odobren.</p>
      </div>
    </div>
  );
};

export default PendingOverlay;