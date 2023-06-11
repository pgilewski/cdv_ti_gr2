import { useContext } from 'react';

import AuthContext, { AuthContextProps } from '../features/auth/AuthContext';

const useAuth = (): AuthContextProps => {
  const auth = useContext(AuthContext);

  if (!auth) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return auth;
};

export default useAuth;
