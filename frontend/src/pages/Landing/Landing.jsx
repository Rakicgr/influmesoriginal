// src/pages/Landing/Landing.jsx
import { useEffect } from "react";
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import InfoPanel from "./LandingParts/InfoPanel/InfoPanel";
import AuthPanel from "./LandingParts/AuthPanel/AuthPanel"; 
import Footer from "./LandingParts/Footer/Footer";
import "@/css/pages/Landing.css";

const Landing = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector(state => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="landing-container">
      <div className="landing-content">
        <div className="landing-split-layout">
          <div className="landing-info-wrapper">
            <InfoPanel />
          </div>
          <div className="landing-auth-wrapper">
            <AuthPanel />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Landing;