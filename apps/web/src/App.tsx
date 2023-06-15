import { useState } from 'react';
import { AppShell, Navbar, Header, Footer, Aside, Text, MediaQuery, Burger, useMantineTheme } from '@mantine/core';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';

import SidebarElement from './components/SidebarElement';
import { AppContainer } from './components/AppContainer';
import AppRoutes from './components/AppRoutes';
import AuthProvider from './features/auth/AuthProvider';
import { ApiProvider } from './features/ApiProvider';
import 'notyf/notyf.min.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // default: true
    },
  },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <ApiProvider>
            <AppRoutes />
          </ApiProvider>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
