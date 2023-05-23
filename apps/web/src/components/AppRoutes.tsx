import { Route, Routes } from 'react-router-dom';

import HomePage from '../features/home/HomePage';
import UsersPage from '../features/users/UsersPage';
import DailyPage from '../features/reports/daily/DailyPage';
import MonthlyPage from '../features/reports/monthly/MonthlyPage';

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
      {routes.map((route, index) => (
        <Route key={index} path={route.path} element={route.component} />
      ))}
    </Routes>
  );
};

export default AppRoutes;
