import { createContext } from 'react';

type UserInfoType = {
  id: number;
  email: string;
  role: string;
  permissions: string[];
};

export interface AuthContextProps {
  accessToken?: string;
  userInfo: UserInfoType | null;
  refreshAccessToken: () => Promise<void>;
  signOut: () => void;
  signIn: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextProps>({
  userInfo: null,
  refreshAccessToken: () => Promise.resolve(),
  signOut: () => 0,
  signIn: () => Promise.resolve(),
  register: () => Promise.resolve(),
});

export default AuthContext;
