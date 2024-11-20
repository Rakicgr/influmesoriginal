import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '@/store/slices/authSlice';
import './Home.css';

const Home = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSpecialty, setFilterSpecialty] = useState('all');

  // Simulirani podaci eksperata
  const experts = [
    {
      id: 1,
      name: 'Dr. Ana Anić',
      specialty: 'Kardiologija',
      rating: 4.8,
      reviews: 124,
      imageUrl: '/placeholder-1.jpg'
    },
    {
      id: 2,
      name: 'Dr. Ivan Ivić',
      specialty: 'Neurologija',
      rating: 4.9,
      reviews: 89,
      imageUrl: '/placeholder-2.jpg'
    },
    // Dodaj više eksperata po potrebi
  ];

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  return (
    <div className="home-container">
      <header className="home-header">
        <div className="user-info">
          <h2>{user?.firstName} {user?.lastName}</h2>
          <p>Privatni korisnik</p>
        </div>
        <button onClick={handleLogout} className="logout-button">
          Odjava
        </button>
      </header>

      <main className="experts-section">
        <div className="experts-header">
          <h1>Lista eksperata</h1>
          <p>Pronađite i kontaktirajte eksperte iz različitih područja</p>
        </div>

        <div className="filter-section">
          <input
            type="text"
            placeholder="Pretraži eksperte..."
            className="filter-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select
            className="filter-select"
            value={filterSpecialty}
            onChange={(e) => setFilterSpecialty(e.target.value)}
          >
            <option value="all">Sva područja</option>
            <option value="kardiologija">Kardiologija</option>
            <option value="neurologija">Neurologija</option>
            <option value="dermatologija">Dermatologija</option>
          </select>
        </div>

        <div className="experts-grid">
          {experts.map(expert => (
            <div key={expert.id} className="expert-card">
              <div className="expert-image" 
                   style={{ backgroundColor: '#e2e8f0' }} />
              <div className="expert-info">
                <h3 className="expert-name">{expert.name}</h3>
                <p className="expert-specialty">{expert.specialty}</p>
                <div className="expert-stats">
                  <span>★ {expert.rating}</span>
                  <span>{expert.reviews} recenzija</span>
                </div>
                <button className="contact-button">
                  Kontaktiraj
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Home;