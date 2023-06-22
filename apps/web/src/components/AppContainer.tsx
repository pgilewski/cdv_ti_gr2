import { useState } from 'react';
import {
  AppShell,
  Navbar,
  Header,
  Footer,
  Aside,
  Text,
  MediaQuery,
  Burger,
  useMantineTheme,
  Button,
} from '@mantine/core';
import styled from '@emotion/styled';
import { Outlet, useNavigate } from 'react-router-dom';

import useAuth from '../hooks/useAuth';

import SidebarElement from './SidebarElement';

const HeaderText = styled.div`
  font-size: 1.25 rem;
  width: 16.75rem;
  text-align: center;
  font-family: monospace;
`;

export const AppContainer = () => {
  const theme = useMantineTheme();
  const [opened, setOpened] = useState(false);
  const { userInfo, signOut } = useAuth();
  const navigate = useNavigate();
  return (
    <AppShell
      styles={{
        main: {
          background: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[0],
        },
      }}
      navbarOffsetBreakpoint="sm"
      asideOffsetBreakpoint="sm"
      navbar={
        <Navbar p="md" hiddenBreakpoint="sm" hidden={!opened} width={{ sm: 200, lg: 300 }}>
          <SidebarElement to="/">Strona główna</SidebarElement>
          <SidebarElement to="/daily">Rejestr dzienny</SidebarElement>
          <SidebarElement to="/monthly">Rejestr miesięczny</SidebarElement>
          <SidebarElement to="/users">Użytkownicy</SidebarElement>
          <SidebarElement to="/projects">Projekty i taski</SidebarElement>
        </Navbar>
      }
      // aside={
      //   <MediaQuery smallerThan="sm" styles={{ display: 'none' }}>
      //     <Aside p="md" hiddenBreakpoint="sm" width={{ sm: 200, lg: 300 }}>
      //       <Text>Application sidebar</Text>
      //     </Aside>
      //   </MediaQuery>
      // }
      footer={
        <Footer height={60} p="md">
          Jesteś zalogowany jako: {userInfo?.email}
        </Footer>
      }
      header={
        <Header height={{ base: 50, md: 70 }} p="md">
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              height: '100%',
              justifyContent: 'space-between',
            }}
          >
            <MediaQuery largerThan="sm" styles={{ display: 'none' }}>
              <Burger
                opened={opened}
                onClick={() => setOpened((o) => !o)}
                size="sm"
                color={theme.colors.gray[6]}
                mr="xl"
              />
            </MediaQuery>
            <HeaderText>📝 Rejestr godzin 📝</HeaderText>
            <div>
              <Button
                variant="default"
                onClick={() => {
                  signOut();

                  navigate('/');
                }}
              >
                <Text>Wyloguj</Text>
              </Button>
            </div>
          </div>
        </Header>
      }
    >
      <Outlet />
    </AppShell>
  );
};
