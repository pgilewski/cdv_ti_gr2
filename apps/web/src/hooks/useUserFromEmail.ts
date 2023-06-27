import { useMemo } from 'react';
import { useQuery } from 'react-query';
import { useApi } from '../features/ApiProvider';

export const useFetchUserIdByEmail = (email: string) => {
  const api = useApi();
  const { data, error, isLoading } = useQuery<{ value: string; id: number }[]>(
    'logTypes',
    async () => {
      const response = await api.get<{ value: string; id: number }[]>(`/users/emails-and-ids?email=${email}`);
      return response.data;
    },
    {
      enabled: Boolean(email),
    }
  );

  const usersOptions = useMemo(() => {
    if (!data) {
      return [];
    }

    return data;
  }, [data]);

  return {
    data,
    error,
    isLoading,
    usersOptions,
  };
};
