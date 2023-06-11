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
  const { accessToken } = useAuth(); // <--- get accessToken from AuthContext

  useEffect(() => {
    // Add the request interceptor
    console.log('accessToken', accessToken);
    if (accessToken !== undefined)
      api.interceptors.request.use((config) => {
        config.headers['Authorization'] = `Bearer ${accessToken}`;
        console.log(accessToken);

        return config;
      });
  }, [accessToken]); // <--- re-run the effect when accessToken changes

  return <ApiContext.Provider value={api}>{children}</ApiContext.Provider>;
}
