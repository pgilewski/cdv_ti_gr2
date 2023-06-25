import { ReactNode } from 'react';
import { Role } from '../typings/types';

type RoleBasedRenderProps = {
  userRole?: Role;
  allowedRoles: Role[];
  children: ReactNode;
};

const RoleBasedRender = ({ userRole, allowedRoles, children }: RoleBasedRenderProps) => {
  if (!userRole) return null;

  if (allowedRoles.includes(userRole)) {
    return <>{children}</>;
  }

  return null;
};

export default RoleBasedRender;
