import { Route, Routes } from 'react-router-dom';

import HomePage from '../features/home/HomePage';
import UsersPage from '../features/users/UsersPage';
import DailyPage from '../features/reports/daily/DailyPage';
import MonthlyPage from '../features/reports/monthly/MonthlyPage';
import { LoginPage } from '../features/login/LoginPage';

import { AppContainer } from './AppContainer';

const routes = [
  { path: '/', component: <HomePage /> },
  { path: '/users', component: <UsersPage /> },
  { path: '/daily', component: <DailyPage /> },
  { path: '/daily/:userId', component: <DailyPage /> },
  { path: '/monthly', component: <MonthlyPage /> },
  { path: '/monthly/:userId', component: <MonthlyPage /> },
];

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} /> {/* LoginPage is kept outside of AppContainer */}
      <Route
        path="/app/*"
        element={
          <AppContainer>
            {/* All other routes are wrapped inside AppContainer */}
            <Routes>
              {routes.map((route, index) => (
                <Route key={index} path={route.path} element={route.component} />
              ))}
            </Routes>
          </AppContainer>
        }
      />
    </Routes>
  );
};

export default AppRoutes;
