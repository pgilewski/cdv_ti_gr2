import { createContext } from 'react';

export type UserInfoType = {
  id: number;
  email: string;
  role: string;
  permissions: string[];
};

export interface AuthContextProps {
  accessToken?: string;
  userInfo: UserInfoType | null;
  refreshAccessToken: () => Promise<{ statusCode?: number; message?: string }>;
  signOut: () => void;
  signIn: (email: string, password: string) => Promise<{ statusCode?: number; message?: string }>;
  register: (email: string, password: string) => Promise<{ statusCode?: number; message?: string }>;
}

const AuthContext = createContext<AuthContextProps>({
  userInfo: null,
  refreshAccessToken: () => Promise.resolve({}),
  signOut: () => 0,
  signIn: () => Promise.resolve({}),
  register: () => Promise.resolve({}),
});

export default AuthContext;
