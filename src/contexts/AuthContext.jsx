import { createContext, useContext, useEffect, useReducer } from 'react';
import { AuthService } from '../services/AuthService';
import { UserService } from '../services/UserService';

const authReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'LOGIN_START':
      return { ...state, authError: null };
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        authError: null,
        isLoading: false,
      };
    case 'LOGIN_FAILURE':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        authError: action.payload,
        isLoading: false,
      };
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        authError: null,
        isLoading: false,
      };
    case 'CLEAR_ERROR':
      return { ...state, authError: null };
    case 'UPDATE_PROFILE':
      return { ...state, user: action.payload };
    default:
      return state;
  }
};

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, {
    user: null,
    isAuthenticated: false,
    authError: null,
    isLoading: true,
  });

  useEffect(() => {
    const checkAuth = async () => {
      dispatch({ type: 'SET_LOADING', payload: true });
      const accessToken = localStorage.getItem('accessToken');
      const userData = localStorage.getItem('user');

      if (accessToken && userData) {
        try {
          const user = JSON.parse(userData);
          dispatch({ type: 'LOGIN_SUCCESS', payload: user });
        } catch (error) {
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          localStorage.removeItem('user');
          dispatch({ type: 'LOGIN_FAILURE', payload: 'Invalid user data' });
        }
      } else {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };

    checkAuth();
  }, []);

  const login = async (username, password) => {
    dispatch({ type: 'LOGIN_START' });
    try {
      const resData = await AuthService.login(username, password);
      const { accessToken, refreshToken } = resData;
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
    } catch (error) {
      const msg = error.response?.data?.message || error.message || 'Fail to login';
      dispatch({
        type: 'LOGIN_FAILURE',
        payload: msg,
      });
      return;
    }
    try {
      const resData = await UserService.getProfile();
      const { user } = resData;
      user.userRole = user.userRole.toLowerCase();
      localStorage.setItem('user', JSON.stringify(user));
      dispatch({ type: 'LOGIN_SUCCESS', payload: user });
    } catch (error) {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      const msg = error.response?.data?.message || error.message || 'Fail to fetch user profile';
      dispatch({
        type: 'LOGIN_FAILURE',
        payload: msg,
      });
      return;
    }
    clearError();
  };

  const logout = async () => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      await AuthService.logout(localStorage.getItem('accessToken'), localStorage.getItem('refreshToken'));
    } catch (error) {
      const msg = error.response?.data?.message || error.message || 'Fail to logout';
      console.error(`Logout error: ${msg}`);
    }
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    dispatch({ type: 'LOGOUT' });
  };

  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  return (
    <AuthContext.Provider
      value={{
        state,
        login,
        logout,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
