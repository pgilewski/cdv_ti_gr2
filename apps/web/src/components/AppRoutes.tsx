import { Navigate, Outlet, Route, Routes } from 'react-router-dom';

import AuthContext from '../features/auth/AuthContext';
import HomePage from '../features/home/HomePage';
import UsersPage from '../features/users/UsersPage';
import DailyPage from '../features/reports/daily/DailyPage';
import MonthlyPage from '../features/reports/monthly/MonthlyPage';
import LoginPage from '../features/auth/LoginPage';
import RegisterPage from '../features/auth/RegisterPage';
import useAuth from '../hooks/useAuth';
import ProjectsPage from '../features/projects/ProjectsPage';

import { AppContainer } from './AppContainer';

const routes = [
  { path: '', component: <HomePage /> },
  { path: 'users', component: <UsersPage /> },
  { path: 'daily', component: <DailyPage /> },
  { path: 'daily/:userId', component: <DailyPage /> },
  { path: 'monthly', component: <MonthlyPage /> },
  { path: 'monthly/:userId', component: <MonthlyPage /> },
  { path: 'projects', component: <ProjectsPage /> },
];

const PrivateRoute = ({ path, ...props }: any) => {
  const { accessToken } = useAuth();

  return accessToken ? <Outlet /> : <Navigate to="/" />;
  // Render the protected route if authenticated
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/app" element={<AppContainer />}>
        <Route path="*" element={<PrivateRoute />}>
          <Route>
            {routes.map((route, index) => (
              <Route key={index} path={route.path} element={route.component} />
            ))}
          </Route>
        </Route>
      </Route>
    </Routes>
  );
};

export default AppRoutes;
