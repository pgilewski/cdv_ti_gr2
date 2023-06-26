import { useState, useEffect } from 'react';
import axios from 'axios';
import jwtDecode from 'jwt-decode';
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
      const refreshToken = localStorage.getItem('refreshToken');

      if (!refreshToken) throw new Error('No refresh token found');

      const response = await api.post('/authentication/refresh-tokens', { refreshToken }); // Send refreshToken to the API

      console.log(response);
      if (response.status === 200) {
        const { accessToken, userId } = response.data;
        console.log('accessToken', accessToken);

        // Set the new access token in the Authorization header
        api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
        setAccessToken(accessToken);

        localStorage.setItem('accessToken', response.data.accessToken);
        localStorage.setItem('refreshToken', response.data.refreshToken);

        // User info is also refreshed
        const data: decodedJwt = jwtDecode(accessToken);
        setUserInfo({ ...data, id: userId });
        console.log(userInfo);
        navigate('/app');
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
        const { accessToken, refreshToken, userId } = response.data;
        console.log('accessToken', accessToken);

        api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
        setAccessToken(accessToken);
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', response.data.refreshToken);

        const data: decodedJwt = jwtDecode(accessToken);

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

  function getActiveUser() {
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
      return null;
    }
    const decodedToken: decodedJwt = jwtDecode(accessToken);
    // add 'sub' to the returned object, which represents user id in the JWT
    return { ...decodedToken, id: decodedToken.sub };
  }

  const signOut = async () => {
    // Sign out on the server side
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    // const response = await api.post('/authentication/sign-out');

    setAccessToken(undefined);
    setUserInfo(null);
  };

  // Modify your useEffect function to look like this:
  useEffect(() => {
    // Get the refresh token from local storage
    const refreshToken = localStorage.getItem('refreshToken');
    if (refreshToken) {
      // If there is a refresh token, try to refresh the access token
      refreshAccessToken();
    } else {
      // If there's no refresh token, clear the user info and access token
      setUserInfo(null);
      setAccessToken(undefined);
    }
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
