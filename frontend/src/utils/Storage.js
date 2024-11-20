// src/utils/Storage.js
export const getAuthToken = () => {
  try {
    return localStorage.getItem('authToken');
  } catch (error) {
    console.warn('Unable to access localStorage:', error);
    return null;
  }
};

export const setAuthToken = (token) => {
  try {
    localStorage.setItem('authToken', token);
  } catch (error) {
    console.warn('Unable to access localStorage:', error);
  }
};

export const removeAuthToken = () => {
  try {
    localStorage.removeItem('authToken');
  } catch (error) {
    console.warn('Unable to access localStorage:', error);
  }
};