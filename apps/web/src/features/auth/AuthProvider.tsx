import { useState, useEffect } from 'react';
import axios from 'axios';
import jwtDecode from 'jwt-decode';
import { Navigate, useNavigate } from 'react-router-dom';

import AuthContext, { UserInfoType } from './AuthContext';
import { Role } from '../../typings/types';
import { useMutation, useQuery, useQueryClient } from 'react-query';

type decodedJwt = {
  sub: number;
  email: string;
  role: Role;
  permissions: string[];
  iat: number;
  exp: number;
  aud: string;
  iss: string;
};

const AuthProvider = ({ children }: { children: any }) => {
  const queryClient = useQueryClient();

  const accessTokenQuery = useQuery<string | null>('accessToken', () =>
    Promise.resolve(localStorage.getItem('accessToken'))
  );

  const updateAccessToken = async (newAccessToken: string | undefined) => {
    if (!newAccessToken) {
      localStorage.removeItem('accessToken');
      return;
    }
    localStorage.setItem('accessToken', newAccessToken);
    return;
  };

  const setAccessTokenMutation = useMutation(updateAccessToken);

  const userInfoQuery = useQuery<UserInfoType | null>('userInfo', () => getActiveUser());

  const updateUserInfo = async (newUserInfo: UserInfoType | null) => {
    setUserInfo(newUserInfo);
  };

  const setUserInfoMutation = useMutation(updateUserInfo);

  // Replace api instance with a React Query mutation
  const refreshAccessTokenMutation = useMutation((refreshToken: string) =>
    api.post('/authentication/refresh-tokens', { refreshToken })
  );

  const registerMutation = useMutation((userData: { email: string; password: string }) =>
    api.post('/authentication/sign-up', userData)
  );

  // Replace navigate function with useNavigate hook
  const navigate = useNavigate();

  const [accessToken, setAccessToken] = useState<string | undefined>(undefined);
  const [userInfo, setUserInfo] = useState<UserInfoType | null>(null); // Update the type here

  // Set up axios to use with your API
  const api = axios.create({
    baseURL: 'http://localhost:2137',
    withCredentials: true, // This will make sure cookies are sent with every request
  });

  const refreshAccessToken = async () => {
    try {
      const refreshToken = localStorage.getItem('refreshToken');

      if (!refreshToken) throw new Error('No refresh token found');

      const response = await refreshAccessTokenMutation.mutateAsync(refreshToken);

      if (response.status === 200) {
        const { accessToken, userId } = response.data;

        // Set the new access token in the Authorization header
        setAccessTokenMutation.mutate(accessToken);

        localStorage.setItem('refreshToken', response.data.refreshToken);

        // User info is also refreshed
        const data: decodedJwt = jwtDecode(accessToken);
        setUserInfoMutation.mutate({ ...data, id: userId });

        navigate('/app');
      }
    } catch (error) {
      console.error('Failed to refresh access token:', error);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const response = await api.post('/authentication/sign-in', { email, password });
      if (response.status === 200) {
        const { accessToken, refreshToken, userId } = response.data;
        console.log('response.data', response.data);

        setAccessTokenMutation.mutate(accessToken);
        localStorage.setItem('refreshToken', refreshToken);

        const data: decodedJwt = jwtDecode(accessToken);
        setUserInfoMutation.mutate({ ...data, id: userId }, { onSuccess: () => navigate('/app') });

        return { ...data, id: userId };
      }
    } catch (error) {
      console.error('Failed to sign in:', error);
    }
  };

  const register = async (email: string, password: string): Promise<number> => {
    try {
      const response = await registerMutation.mutateAsync({ email, password });
      console.log(response);
      if (response.status === 201) {
        const { accessToken } = response.data;
        console.log('accessToken', accessToken);

        api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
        setAccessTokenMutation.mutate(accessToken);

        const { userInfo } = response.data;
        setUserInfoMutation.mutate(userInfo);
        return response.status;
      }
      return response.status ?? 0;
    } catch (error) {
      console.error('Failed to register:', error);
      throw error;
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
    localStorage.removeItem('refreshToken');

    setAccessTokenMutation.mutate(undefined);
    setUserInfoMutation.mutate(null);
  };

  useEffect(() => {
    const refreshTokens = async () => {
      await refreshAccessToken();
    };

    if (userInfoQuery.data === null) {
      refreshTokens();
    }
  }, [userInfoQuery.data]);

  useEffect(() => {
    refreshAccessToken();
  }, []);
  return (
    <AuthContext.Provider
      value={{
        accessToken: accessTokenQuery.data,
        userInfo: userInfo, // Update the value here
        signOut,
        signIn,
        register,
        refreshAccessToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
