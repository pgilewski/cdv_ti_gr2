import { useMutation, useQuery } from 'react-query';

import { useApi } from '../features/ApiProvider';
import { Task } from '../typings/types';

export type CreateTaskDto = Pick<Task, 'name' | 'description' | 'projectId'>;

export type UpdateTaskDto = Partial<CreateTaskDto> & Pick<Task, 'id'>;

const useTaskManagement = () => {
  const api = useApi();

  const tasksQuery = useQuery<Task[]>('tasks', async () => {
    const response = await api.get<Task[]>('/tasks');
    return response.data;
  });

  const createTaskMutation = useMutation<Task, Error, CreateTaskDto>(async (newTask) => {
    const response = await api.post<Task>('/tasks', newTask);
    return response.data;
  });

  const updateTaskMutation = useMutation<Task, Error, UpdateTaskDto>(async (updatedTask) => {
    const { id, ...rest } = updatedTask;
    const response = await api.put<Task>(`/tasks/${id}`, rest);
    return response.data;
  });

  const deleteTaskMutation = useMutation<unknown, Error, number>(async (taskId) => {
    await api.delete(`/tasks/${taskId}`);
  });

  return {
    tasksQuery,
    createTaskMutation,
    updateTaskMutation,
    deleteTaskMutation,
  };
};

export default useTaskManagement;
