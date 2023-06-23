import { useMutation, useQuery, UseQueryResult, UseMutationResult, useQueryClient } from 'react-query';

import { useApi } from '../features/ApiProvider';
import { TaskHour, WorkDay } from '../typings/types';
import useWorkDaySearchParams from './useWorkdaySearchParams';

interface DailyDataHandlerParams {
  userId?: string;
  day?: string;
}

export type CreateTaskHourDto = {
  taskId: number;
  workDayId: number;
  userId: number;
  startTime: string;
  endTime: string;
  note?: string;
};

const useTaskHourManagement = () => {
  const api = useApi();
  const queryClient = useQueryClient();

  const apiUrlAdd = `/task-hour/add`;
  const apiUrlDelete = (id: number) => `/task-hour/${id}`;

  const { userId, day } = useWorkDaySearchParams();

  const createTaskHourMutation = useMutation<TaskHour, Error, CreateTaskHourDto>(
    async (newData) => {
      const response = await api.post<TaskHour>(apiUrlAdd, newData);
      return response.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['workDay', userId, day]);
      },
    }
  );

  const deleteTaskHourMutation = useMutation<void, Error, number>(
    async (id) => {
      await api.delete(apiUrlDelete(id));
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['workDay', userId, day]);
      },
    }
  );

  return {
    createTaskHourMutation,
    deleteTaskHourMutation,
  };
};

export default useTaskHourManagement;
