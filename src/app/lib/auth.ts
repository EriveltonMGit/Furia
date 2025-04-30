import api from './api';

interface UserData {
  email: string;
  password: string;

}

interface Credentials {
  email: string;
  password: string;
}

export const register = async (userData: UserData) => {
  const response = await api.post('/auth/register', userData);
  return response.data;
};

export const login = async (credentials: Credentials) => {
  const response = await api.post('/auth/login', credentials);
  if (response.data.token) {
    localStorage.setItem('token', response.data.token);
  }
  return response.data;
};

export const logout = () => {
  localStorage.removeItem('token');
};

export const getCurrentUser = async () => {
  const response = await api.get('/auth/me');
  return response.data;
};
