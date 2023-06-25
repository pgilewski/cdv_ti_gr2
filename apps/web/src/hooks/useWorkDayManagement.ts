import { ChangeEvent, useState } from 'react';
import { useMutation, useQuery, UseQueryResult, UseMutationResult } from 'react-query';

import { useApi } from '../features/ApiProvider';
import { UserInfoType } from '../features/auth/AuthContext';
import { TaskHour, WorkDay } from '../typings/types';
import useWorkDaySearchParams from './useWorkdaySearchParams';

interface DailyDataHandlerParams {
  userId?: string;
  day?: string;
}

export type CreateWorkDayDto = {
  userId: string;
  date: string;
};

const useWorkDayManagement = (dayNow?: string, userId?: string) => {
  const { day } = useWorkDaySearchParams(dayNow, userId);
  const api = useApi();

  const apiUrl = `/reports/daily?userId=${userId}&day=${day}`;

  const workDayQuery = useQuery<WorkDay>(['workDay', userId, day], async () => {
    const response = await api.get<WorkDay>(apiUrl);
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
