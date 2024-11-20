// src/components/features/auth/RegisterForm.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { toast } from 'react-hot-toast';
import { registerUser } from '@/store/slices/authSlice';
import { PendingOverlay } from '@/components/shared/PendingOverlay';
import '@/css/auth.css';

const RegisterForm = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    userType: 'personal'
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    
    // Required fields
    const requiredFields = ['firstName', 'lastName', 'email', 'password', 'confirmPassword'];
    requiredFields.forEach(field => {
      if (!formData[field]?.trim()) {
        newErrors[field] = 'Ovo polje je obavezno';
      }
    });

    // Email validation
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Unesite ispravnu email adresu';
    }

    // Password strength
    if (formData.password && formData.password.length < 8) {
      newErrors.password = 'Lozinka mora imati najmanje 8 znakova';
    }

    // Password match
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Lozinke se ne podudaraju';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    
    try {
      const result = await dispatch(registerUser(formData)).unwrap();
      toast.success('Uspješno ste se registrirali!');
      navigate('/verify-pin'); // ili gdje već trebamo ići nakon registracije
    } catch (error) {
      toast.error(error.message || 'Greška pri registraciji');
      setErrors(prev => ({ ...prev, submit: error.message }));
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <PendingOverlay message="Registracija u tijeku..." />;
  }

  return (
    <form onSubmit={handleSubmit} className="auth-form">
      <div className="form-group">
        <label htmlFor="firstName" className="form-label">Ime</label>
        <input
          id="firstName"
          type="text"
          name="firstName"
          value={formData.firstName}
          onChange={handleChange}
          className="form-input"
          placeholder="Unesite vaše ime"
        />
        {errors.firstName && <span className="form-error">{errors.firstName}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="lastName" className="form-label">Prezime</label>
        <input
          id="lastName"
          type="text"
          name="lastName"
          value={formData.lastName}
          onChange={handleChange}
          className="form-input"
          placeholder="Unesite vaše prezime"
        />
        {errors.lastName && <span className="form-error">{errors.lastName}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="email" className="form-label">Email</label>
        <input
          id="email"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className="form-input"
          placeholder="vas@email.com"
        />
        {errors.email && <span className="form-error">{errors.email}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="password" className="form-label">Lozinka</label>
        <input
          id="password"
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          className="form-input"
          placeholder="Minimalno 8 znakova"
        />
        {errors.password && <span className="form-error">{errors.password}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="confirmPassword" className="form-label">Potvrdite lozinku</label>
        <input
          id="confirmPassword"
          type="password"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          className="form-input"
          placeholder="Ponovite lozinku"
        />
        {errors.confirmPassword && <span className="form-error">{errors.confirmPassword}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="userType" className="form-label">Tip korisnika</label>
        <select
          id="userType"
          name="userType"
          value={formData.userType}
          onChange={handleChange}
          className="form-input"
        >
          <option value="personal">Osobni korisnik</option>
          <option value="business">Poslovni korisnik</option>
        </select>
      </div>

      {errors.submit && <div className="form-error text-center">{errors.submit}</div>}

      <button 
        type="submit" 
        className="form-button"
        disabled={isLoading}
      >
        {isLoading ? 'Registracija...' : 'Registriraj se'}
      </button>

      <p className="text-center mt-4">
        Već imate račun?{' '}
        <a href="/login" className="auth-link">
          Prijavite se
        </a>
      </p>
    </form>
  );
};

export default RegisterForm;