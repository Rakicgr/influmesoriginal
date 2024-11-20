// pages/Dashboard/Dashboard.jsx
import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { logout } from '../../store/slices/authSlice';
import PendingOverlay from '../../components/PendingOverlay/PendingOverlay';
import './Dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const { user, isAuthenticated, userType, isPending } = useSelector(state => state.auth);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Dobrodošli, {user?.firstName}</h1>
        <button onClick={handleLogout} className="logout-button">
          Odjava
        </button>
      </header>

      {userType === 'business' && isPending && <PendingOverlay />}
      
      {/* Sadržaj dashboarda */}
      {userType === 'private' && (
        <div className="experts-list">
          <h2>Lista eksperata</h2>
          {/* Lista eksperata */}
        </div>
      )}
    </div>
  );
};

export default Dashboard;