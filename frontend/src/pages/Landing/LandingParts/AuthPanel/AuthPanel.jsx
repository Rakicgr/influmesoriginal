import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { login, register, verifyPin } from '@/store/slices/authSlice';
import { toast } from 'react-hot-toast';
import './AuthPanel.css';

const AuthPanel = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);
  
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [userType, setUserType] = useState('');
  const [registrationStep, setRegistrationStep] = useState('type');
  const [pin, setPin] = useState(['', '', '', '']);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phonePrefix: '+385',
    phone: '',
    password: '',
    confirmPassword: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePhoneChange = (value) => {
    const cleanedValue = value.replace(/\D/g, '');
    setFormData(prev => ({
      ...prev,
      phone: cleanedValue
    }));
  };

  const validateForm = () => {
    if (!formData.email || !formData.password) {
      toast.error('Molimo unesite email i lozinku');
      return false;
    }

    if (isRegisterMode) {
      if (!formData.firstName || !formData.lastName) {
        toast.error('Molimo unesite ime i prezime');
        return false;
      }
      if (formData.password !== formData.confirmPassword) {
        toast.error('Lozinke se ne podudaraju');
        return false;
      }
      if (formData.password.length < 6) {
        toast.error('Lozinka mora imati najmanje 6 znakova');
        return false;
      }
      if (!formData.phone) {
        toast.error('Molimo unesite broj telefona');
        return false;
      }
    }
    return true;
  };

  const handlePinChange = async (index, value) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newPin = [...pin];
      newPin[index] = value;
      setPin(newPin);

      // Auto-focus next input
      if (value && index < 3) {
        const nextInput = document.querySelector(`input[name="pin-${index + 1}"]`);
        if (nextInput) nextInput.focus();
      }

      // If all pins are filled, verify
      if (index === 3 && value && newPin.every(digit => digit)) {
        try {
          const pinCode = newPin.join('');
          await dispatch(verifyPin({ 
            email: formData.email, 
            pin: pinCode 
          })).unwrap();
          
          // Redirect based on user type
          if (userType === 'private') {
            navigate('/home');
          } else {
            navigate('/dashboard');
          }
        } catch (err) {
          toast.error('Neispravan PIN kod');
          setPin(['', '', '', '']);
        }
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      if (isRegisterMode) {
        const userData = {
          ...formData,
          userType,
          phone: formData.phonePrefix + formData.phone
        };
        
        await dispatch(register(userData)).unwrap();
        setRegistrationStep('pin');
        toast.success('PIN kod je poslan na vašu email adresu');
      }
    } catch (err) {
      toast.error(err.message || 'Došlo je do greške prilikom registracije');
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      const result = await dispatch(login({
        email: formData.email,
        password: formData.password
      })).unwrap();

      if (result.userType === 'business') {
        if (result.isApproved) {
          navigate('/dashboard');
        } else {
          navigate('/dashboard', { state: { isPending: true }});
        }
      } else {
        navigate('/home');
      }
    } catch (err) {
      toast.error(err.message || 'Neuspješna prijava');
    }
  };

  const renderLoginForm = () => (
    <>
      <div className="auth-header">
        <h2>Dobrodošli natrag</h2>
        <p>Unesite svoje podatke za pristup</p>
      </div>
      <form className="auth-form" onSubmit={handleLogin}>
        <div className="input-group">
          <input 
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleInputChange}
            disabled={loading}
            required
          />
        </div>
        <div className="input-group">
          <input 
            type="password" 
            placeholder="Lozinka" 
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            disabled={loading}
            required
          />
        </div>
        
        <div className="form-options">
          <label className="remember-me">
            <input type="checkbox" disabled={loading} /> Zapamti me
          </label>
          <a href="#" className="forgot-password">Zaboravili ste lozinku?</a>
        </div>
        <button 
          type="submit" 
          className="auth-button"
          disabled={loading}
        >
          {loading ? 'Prijava u tijeku...' : 'Prijavi se'}
        </button>
      </form>
      <div className="auth-footer">
        <p>
          Nemate račun?{' '}
          <a 
            href="#" 
            className="toggle-auth-mode"
            onClick={(e) => {
              e.preventDefault();
              setIsRegisterMode(true);
            }}
          >
            Registrirajte se
          </a>
        </p>
      </div>
    </>
  );

  const renderPrivateForm = () => (
    <>
      <div className="auth-header">
        <h2>Osobni podaci</h2>
        <p>Unesite svoje podatke za registraciju</p>
      </div>
      <form className="auth-form" onSubmit={handleSubmit}>
        <div className="input-group">
          <input
            type="text"
            placeholder="Ime"
            value={formData.firstName}
            onChange={handleInputChange}
            name="firstName"
            disabled={loading}
            required
          />
        </div>
        <div className="input-group">
          <input
            type="text"
            placeholder="Prezime"
            value={formData.lastName}
            onChange={handleInputChange}
            name="lastName"
            disabled={loading}
            required
          />
        </div>
        <div className="input-group">
          <input
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleInputChange}
            name="email"
            disabled={loading}
            required
          />
        </div>
        <div className="input-group phone-group">
          <select 
            className="phone-prefix"
            value={formData.phonePrefix}
            onChange={(e) => setFormData(prev => ({
              ...prev,
              phonePrefix: e.target.value
            }))}
            disabled={loading}
          >
            <option value="+385">+385</option>
            <option value="+386">+386</option>
            <option value="+387">+387</option>
            <option value="+381">+381</option>
          </select>
          <input
            type="tel"
            placeholder="Broj mobitela"
            value={formData.phone}
            onChange={(e) => handlePhoneChange(e.target.value)}
            disabled={loading}
            required
          />
        </div>
        <div className="input-group">
          <input
            type="password"
            placeholder="Lozinka"
            value={formData.password}
            onChange={handleInputChange}
            name="password"
            disabled={loading}
            required
          />
        </div>
        <div className="input-group">
          <input
            type="password"
            placeholder="Potvrdite lozinku"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            name="confirmPassword"
            disabled={loading}
            required
          />
        </div>
        <div className="auth-actions">
          <button 
            type="submit" 
            className="auth-button"
            disabled={loading}
          >
            {loading ? 'Registracija u tijeku...' : 'Nastavi'}
          </button>
          <button 
            type="button"
            className="auth-button secondary"
            onClick={() => setRegistrationStep('type')}
            disabled={loading}
          >
            Natrag
          </button>
        </div>
      </form>
    </>
  );

  const renderBusinessForm = () => (
    <>
      <div className="auth-header">
        <h2>Poslovni korisnički račun</h2>
        <p>Unesite svoje podatke za registraciju</p>
      </div>
      <form className="auth-form" onSubmit={handleSubmit}>
        <div className="input-group">
          <input
            type="text"
            placeholder="Ime"
            value={formData.firstName}
            onChange={handleInputChange}
            name="firstName"
            disabled={loading}
            required
          />
        </div>
        <div className="input-group">
          <input
            type="text"
            placeholder="Prezime"
            value={formData.lastName}
            onChange={handleInputChange}
            name="lastName"
            disabled={loading}
            required
          />
        </div>
        <div className="input-group">
          <input
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleInputChange}
            name="email"
            disabled={loading}
            required
          />
        </div>
        <div className="input-group phone-group">
          <select 
            className="phone-prefix"
            value={formData.phonePrefix}
            onChange={(e) => setFormData(prev => ({
              ...prev,
              phonePrefix: e.target.value
            }))}
            disabled={loading}
          >
            <option value="+385">+385</option>
            <option value="+386">+386</option>
            <option value="+387">+387</option>
            <option value="+381">+381</option>
          </select>
          <input
            type="tel"
            placeholder="Broj mobitela"
            value={formData.phone}
            onChange={(e) => handlePhoneChange(e.target.value)}
            disabled={loading}
            required
          />
        </div>
        <div className="input-group">
          <input
            type="password"
            placeholder="Lozinka"
            value={formData.password}
            onChange={handleInputChange}
            name="password"
            disabled={loading}
            required
          />
        </div>
        <div className="input-group">
          <input
            type="password"
            placeholder="Potvrdite lozinku"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            name="confirmPassword"
            disabled={loading}
            required
          />
        </div>
        <div className="auth-actions">
          <button 
            type="submit" 
            className="auth-button"
            disabled={loading}
          >
            {loading ? 'Registracija u tijeku...' : 'Nastavi'}
          </button>
          <button 
            type="button"
            className="auth-button secondary"
            onClick={() => setRegistrationStep('type')}
            disabled={loading}
          >
            Natrag
          </button>
        </div>
      </form>
    </>
  );

  const renderPinVerification = () => (
    <>
      <div className="auth-header">
        <h2>Verifikacija</h2>
        <p>Unesite 4-znamenkasti PIN kod poslan na {formData.email}</p>
      </div>
      <div className="pin-verification">
        <div className="pin-inputs">
          {[0, 1, 2, 3].map((index) => (
            <input
              key={index}
              type="text"
              maxLength="1"
              name={`pin-${index}`}
              value={pin[index]}
              onChange={(e) => handlePinChange(index, e.target.value)}
              className="pin-input"
              disabled={loading}
            />
          ))}
        </div>
        {loading && <p className="text-center">Provjera PIN-a u tijeku...</p>}
        {error && <p className="text-center text-red-500">{error}</p>}
        <div className="auth-actions">
          <button 
            type="button"
            className="auth-button secondary"
            onClick={() => {
              setRegistrationStep(userType === 'private' ? 'private-form' : 'business-form');
              setPin(['', '', '', '']);
            }}
            disabled={loading}
          >
            Natrag
          </button>
        </div>
      </div>
    </>
  );

  const renderUserTypeSelection = () => (
    <>
      <div className="auth-header">
        <h2>Registracija</h2>
        <p>Odaberite tip korisničkog računa</p>
      </div>
      <div className="user-type-selection">
        <button 
          className={`user-type-button ${userType === 'private' ? 'active' : ''}`}
          onClick={() => {
            setUserType('private');
            setRegistrationStep('private-form');
          }}
          type="button"
          disabled={loading}
        >
          <h3>Privatni korisnik</h3>
          <p>Za osobnu upotrebu i privatnu komunikaciju</p>
        </button>
        <button 
          className={`user-type-button ${userType === 'business' ? 'active' : ''}`}
          onClick={() => {
            setUserType('business');
            setRegistrationStep('business-form');
          }}
          type="button"
          disabled={loading}
        >
          <h3>Poslovni korisnik</h3>
          <p>Za tvrtke i poslovne korisnike</p>
        </button>
      </div>
    </>
  );

 const renderContent = () => {
    if (!isRegisterMode) return renderLoginForm();
    
    switch(registrationStep) {
      case 'type':
        return renderUserTypeSelection();
      case 'private-form':
        return renderPrivateForm();
      case 'business-form':
        return renderBusinessForm();
      case 'pin':
        return renderPinVerification();
      default:
        return renderUserTypeSelection();
    }
  };

  return (
    <div className="auth-panel">
      <div className="auth-container">
        <div className="auth-logo">
          <h1>influmes</h1>
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}
        </div>
        <div className="auth-content-scroll">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default AuthPanel;