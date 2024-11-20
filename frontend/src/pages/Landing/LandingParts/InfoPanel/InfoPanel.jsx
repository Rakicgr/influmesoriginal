import './InfoPanel.css';
import { useState, useEffect } from 'react';

const InfoPanel = () => {
  const [currentText, setCurrentText] = useState('sportaši');
  const [isAnimating, setIsAnimating] = useState(false);
  
  useEffect(() => {
    const texts = ['sportaši', 'političari', 'poduzetnici'];
    let currentIndex = 0;
    
    const interval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        currentIndex = (currentIndex + 1) % texts.length;
        setCurrentText(texts[currentIndex]);
        setIsAnimating(false);
      }, 200);
    }, 3000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="info-panel">
      <div className="info-content">
        <h1 className="platform-title">
          POSLOVNA MESSENGER PLATFORMA
        </h1>
        <div className={`category-text transition-opacity duration-200 ${isAnimating ? 'opacity-0' : 'opacity-100'}`}>
          <span>{currentText}</span>
        </div>
        <p className="info-description">
          Razgovarajte s profesionalcima.
        </p>
      </div>
    </div>
  );
};

export default InfoPanel;