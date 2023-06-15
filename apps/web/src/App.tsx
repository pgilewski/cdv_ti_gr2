import { useState } from 'react';
import { AppShell, Navbar, Header, Footer, Aside, Text, MediaQuery, Burger, useMantineTheme } from '@mantine/core';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import React from 'react';

import SidebarElement from './components/SidebarElement';
import { AppContainer } from './components/AppContainer';
import AppRoutes from './components/AppRoutes';

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
        <AppContainer>
          <AppRoutes />
        </AppContainer>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
