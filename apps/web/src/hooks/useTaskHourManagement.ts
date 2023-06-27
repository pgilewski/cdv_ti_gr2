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

const useTaskHourManagement = (workDay: WorkDay) => {
  const api = useApi();
  const queryClient = useQueryClient();

  const { userId, day } = useWorkDaySearchParams();

  const createTaskHourMutation = useMutation<TaskHour, Error, CreateTaskHourDto>(async (newData) => {
    const response = await api.post<TaskHour>(`/task-hour/add`, newData);
    return response.data;
  });

  const deleteTaskHourMutation = useMutation<void, Error, number>(async (id) => {
    await api.delete(`/task-hour/${id}`);
  });

  return {
    createTaskHourMutation,
    deleteTaskHourMutation,
  };
};

export default useTaskHourManagement;
