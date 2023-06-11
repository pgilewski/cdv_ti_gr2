import { useMutation, useQuery, UseQueryResult, UseMutationResult } from 'react-query';

import { useApi } from '../features/ApiProvider';
import { WorkDay } from '../typings/types';

interface DailyDataHandlerParams {
  userId?: string;
  day?: string;
}

export type CreateWorkDayDto = {
  userId: string;
  date: string;
};

const useWorkDayManagement = ({ userId, day }: DailyDataHandlerParams) => {
  const api = useApi();

  const queryParams: Record<string, string> = {};
  if (userId) {
    queryParams.userId = userId;
  }
  if (day) {
    queryParams.day = day;
  }
  const queryString = new URLSearchParams(queryParams).toString();
  const apiUrl = `/reports/daily${queryString ? `?${queryString}` : ''}`;

  const workDayQuery = useQuery<WorkDay[]>(['daily', queryString], async () => {
    const response = await api.get<WorkDay[]>(apiUrl);
    return response.data;
  });

  const createWorkDayMutation = useMutation<WorkDay, Error, CreateWorkDayDto>(async (newData) => {
    const response = await api.post<WorkDay>(apiUrl, newData);
    return response.data;
  });

  const updateWorkDayMutation = useMutation<WorkDay, Error, WorkDay>(async (updatedData) => {
    const response = await api.put<WorkDay>(apiUrl, updatedData);
    return response.data;
  });

  const deleteWorkDayMutation = useMutation<unknown, Error, void>(async () => {
    await api.delete(apiUrl);
  });

  return {
    workDayQuery,
    createWorkDayMutation,
    updateWorkDayMutation,
    deleteWorkDayMutation,
  };
};

export default useWorkDayManagement;
