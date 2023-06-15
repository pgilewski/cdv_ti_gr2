import { useMutation, useQuery } from 'react-query';

import { useApi } from '../features/ApiProvider';
import { User } from '../typings/types';

export type CreateUserDto = {
  name: string;
  email: string;
};

export type UpdateUserDto = Partial<CreateUserDto> & { id: string };

const useUserManagement = () => {
  const api = useApi();

  const usersQuery = useQuery<User[]>('users', async () => {
    const response = await api.get<User[]>('/users');
    return response.data;
  });

  const createUserMutation = useMutation<User, Error, CreateUserDto>(async (newUser) => {
    const response = await api.post<User>('/users', newUser);
    return response.data;
  });

  const updateUserMutation = useMutation<User, Error, UpdateUserDto>(async (updatedUser) => {
    const { id, ...rest } = updatedUser;
    const response = await api.patch<User>(`/users/${id}`, rest);
    return response.data;
  });

  const deleteUserMutation = useMutation<unknown, Error, string>(async (userId) => {
    await api.delete(`/users/${userId}`);
  });

  return {
    usersQuery,
    createUserMutation,
    updateUserMutation,
    deleteUserMutation,
  };
};

export default useUserManagement;
