import { useState, useEffect } from 'react';
import axios from 'axios';
import jwt_decode from 'jwt-decode';
import { Navigate, useNavigate } from 'react-router-dom';

import AuthContext from './AuthContext';

type decodedJwt = {
  sub: number;
  email: string;
  role: string;
  permissions: string[];
  iat: number;
  exp: number;
  aud: string;
  iss: string;
};

const AuthProvider = ({ children }: { children: any }) => {
  const navigate = useNavigate();

  const [accessToken, setAccessToken] = useState<string | undefined>(undefined);
  const [userInfo, setUserInfo] = useState<{ id: number; email: string; role: string; permissions: string[] } | null>(
    null
  );

  // Set up axios to use with your API
  const api = axios.create({
    baseURL: 'http://localhost:2137',
    withCredentials: true, // This will make sure cookies are sent with every request
  });

  const refreshAccessToken = async () => {
    try {
      const response = await api.post('/authentication/refresh-tokens'); // Your refresh token endpoint
      console.log(response);
      if (response.status === 200) {
        const { accessToken, userId } = response.data;
        console.log('accessToken', accessToken);

        // Set the new access token in the Authorization header
        api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
        setAccessToken(accessToken);

        // User info is also refreshed
        const { userInfo }: any = jwt_decode(accessToken);
        setUserInfo({ ...userInfo, id: userId });
        console.log(userInfo);
      }
    } catch (error) {
      console.error('Failed to refresh access token:', error);
      signOut();
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const response = await api.post('/authentication/sign-in', { email, password });
      console.log(response);

      if (response.status === 200) {
        const { accessToken, userId } = response.data;
        console.log('accessToken', accessToken);

        api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
        setAccessToken(accessToken);

        // User info is also refreshed
        const data: decodedJwt = jwt_decode(accessToken);
        setUserInfo({ ...data, id: userId });
        navigate('/app');
      }
    } catch (error) {
      console.error('Failed to sign in:', error);
    }
  };

  const register = async (email: string, password: string) => {
    try {
      const response = await api.post('/authentication/sign-up', { email, password });

      if (response.status === 201) {
        const { accessToken } = response.data;
        console.log('accessToken', accessToken);

        api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
        setAccessToken(accessToken);

        const { userInfo } = response.data;
        setUserInfo(userInfo);
      }
    } catch (error) {
      console.error('Failed to register:', error);
    }
  };

  const signOut = () => {
    // Clear tokens from local storage
    setAccessToken(undefined);
    setUserInfo(null);

    // Sign out on the server side
    api.post('/sign-out');
  };

  useEffect(() => {
    // Try to refresh the access token when the app loads
    refreshAccessToken();
  }, []);

  // Add an interceptor to handle if an API call returns an unauthorized response
  api.interceptors.response.use(
    (config) => {
      console.log('accessToken', accessToken);

      config.headers['Authorization'] = `Bearer ${accessToken}`;
      return config;
    },
    async (error) => {
      const originalRequest = error.config;

      // Check if the status is 401 and the request was not previously retried
      if (
        error.response.status === 401 &&
        !originalRequest._retry &&
        originalRequest.url !== '/authentication/refresh-tokens'
      ) {
        originalRequest._retry = true;
        await refreshAccessToken();
        return api(originalRequest);
      }

      return Promise.reject(error);
    }
  );

  return (
    <AuthContext.Provider value={{ accessToken, userInfo, signOut, signIn, register, refreshAccessToken }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
