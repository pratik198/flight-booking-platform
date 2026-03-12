import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  loginStart,
  loginSuccess,
  loginFailure,
  logout,
} from '../store/slices/authSlice';
import authService from '../services/authService';
import { showToast } from '../store/slices/uiSlice';

export const useAuth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, token, isLoading, error, isAuthenticated } = useSelector(
    (state) => state.auth
  );

  const login = async (credentials) => {
    try {
      dispatch(loginStart());
      const data = await authService.login(credentials);
      dispatch(loginSuccess(data));
      dispatch(showToast({ message: 'Login successful!', type: 'success' }));
      navigate('/');
      return data;
    } catch (error) {
      dispatch(loginFailure(error.message));
      dispatch(showToast({ message: error.message, type: 'error' }));
      throw error;
    }
  };

  const register = async (userData) => {
    try {
      dispatch(loginStart());
      const data = await authService.register(userData);
      dispatch(loginSuccess(data));
      dispatch(showToast({ message: 'Registration successful!', type: 'success' }));
      navigate('/');
      return data;
    } catch (error) {
      dispatch(loginFailure(error.message));
      dispatch(showToast({ message: error.message, type: 'error' }));
      throw error;
    }
  };

  const logoutUser = () => {
    authService.logout();
    dispatch(logout());
    dispatch(showToast({ message: 'Logged out successfully', type: 'success' }));
    navigate('/login');
  };

  const updateProfile = async (userData) => {
    try {
      const data = await authService.updateProfile(userData);
      dispatch(updateProfile(data.user));
      dispatch(showToast({ message: 'Profile updated!', type: 'success' }));
      return data;
    } catch (error) {
      dispatch(showToast({ message: error.message, type: 'error' }));
      throw error;
    }
  };

  return {
    user,
    token,
    isLoading,
    error,
    isAuthenticated,
    login,
    register,
    logout: logoutUser,
    updateProfile,
  };
};