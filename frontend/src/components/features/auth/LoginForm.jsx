// src/components/features/auth/LoginForm.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '@/store/slices/authSlice';
import { toast } from 'react-hot-toast';
import { PendingOverlay } from '@/components/PendingOverlay/PendingOverlay';

const LoginForm = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email) {
      newErrors.email = 'Email je obavezan';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Unesite ispravan email';
    }
    
    if (!formData.password) {
      newErrors.password = 'Lozinka je obavezna';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
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

    try {
      await dispatch(login(formData)).unwrap();
      toast.success('Uspješna prijava!');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error || 'Greška pri prijavi');
    }
  };

  if (loading) {
    return <PendingOverlay message="Prijava u tijeku..." />;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          Email
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className={`mt-1 block w-full rounded-md shadow-sm ${
            errors.email ? 'border-red-500' : 'border-gray-300'
          } focus:ring-primary-500 focus:border-primary-500`}
          placeholder="vas@email.com"
        />
        {errors.email && (
          <p className="mt-1 text-sm text-red-600">{errors.email}</p>
        )}
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
          Lozinka
        </label>
        <input
          type="password"
          id="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          className={`mt-1 block w-full rounded-md shadow-sm ${
            errors.password ? 'border-red-500' : 'border-gray-300'
          } focus:ring-primary-500 focus:border-primary-500`}
        />
        {errors.password && (
          <p className="mt-1 text-sm text-red-600">{errors.password}</p>
        )}
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          id="rememberMe"
          name="rememberMe"
          checked={formData.rememberMe}
          onChange={handleChange}
          className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
        />
        <label htmlFor="rememberMe" className="ml-2 block text-sm text-gray-700">
          Zapamti me
        </label>
      </div>

      {error && (
        <div className="text-red-600 text-sm text-center">{error}</div>
      )}

      <button
        type="submit"
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        disabled={loading}
      >
        {loading ? 'Prijava...' : 'Prijavi se'}
      </button>

      <div className="text-center mt-4">
        <a 
          href="/forgot-password" 
          className="text-sm font-medium text-primary-600 hover:text-primary-500"
        >
          Zaboravili ste lozinku?
        </a>
      </div>

      <div className="text-center">
        <a 
          href="/register" 
          className="text-sm font-medium text-primary-600 hover:text-primary-500"
        >
          Nemate račun? Registrirajte se
        </a>
      </div>
    </form>
  );
};

export default LoginForm;