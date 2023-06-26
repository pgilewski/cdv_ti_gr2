import { createContext } from 'react';
import { Role } from '../../typings/types';

export type UserInfoType = {
  id: number;
  email: string;
  role: Role;
  permissions: string[];
};

export interface AuthContextProps {
  accessToken?: string | null;
  userInfo?: UserInfoType | null;
  refreshAccessToken: () => Promise<void>;
  signOut: () => void;
  signIn: (email: string, password: string) => Promise<UserInfoType | null | undefined>;
  register: (email: string, password: string) => Promise<number | undefined>;
}

const AuthContext = createContext<AuthContextProps>({
  accessToken: null,
  userInfo: null,
  refreshAccessToken: () => Promise.resolve(),
  signOut: () => 0,
  signIn: () => Promise.resolve(null),
  register: () => Promise.resolve(0),
});

export default AuthContext;
