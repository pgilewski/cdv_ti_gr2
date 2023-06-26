import { createContext, useContext, useEffect } from 'react';
import axios from 'axios';

import useAuth from '../hooks/useAuth';

const api = axios.create({
  baseURL: 'http://localhost:2137',
  withCredentials: true,
});

const ApiContext = createContext(api);

export function useApi() {
  return useContext(ApiContext);
}

export function ApiProvider({ children }: any) {
  const { accessToken, refreshAccessToken } = useAuth(); // <--- get accessToken from AuthContext

  useEffect(() => {
    const requestInterceptor = api.interceptors.request.use((config) => {
      if (accessToken !== null && accessToken !== undefined) {
        config.headers['Authorization'] = `Bearer ${accessToken}`;
      }
      return config;
    });

    return () => {
      api.interceptors.request.eject(requestInterceptor);
    };
  }, [accessToken]);

  useEffect(() => {
    const responseInterceptor = api.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.response?.status === 401) {
          await refreshAccessToken();
          // Retry the original request with the new access token
          return api.request(error.config);
        }
        return Promise.reject(error);
      }
    );

    return () => {
      api.interceptors.response.eject(responseInterceptor);
    };
  }, [refreshAccessToken]);

  return <ApiContext.Provider value={api}>{children}</ApiContext.Provider>;
}
