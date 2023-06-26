import { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import { useApi } from '../features/ApiProvider';
import { Comment, WorkDay } from '../typings/types';
import useWorkDaySearchParams from './useWorkdaySearchParams';

export type CreateCommentDto = {
  content: string;
  type: string;
  workDayId: number;
  userId: number;
};

const useCommentsManagement = () => {
  const api = useApi();
  const queryClient = useQueryClient();
  const { userId, day } = useWorkDaySearchParams();

  const apiUrlAdd = '/comments/add';
  const apiUrlDelete = (id: number) => `/comments/${id}`;

  const createCommentMutation = useMutation<Comment, Error, CreateCommentDto>(
    async (newData) => {
      const response = await api.post<Comment>(apiUrlAdd, newData);
      return response.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['workDay', userId, day]);
      },
    }
  );

  const deleteCommentMutation = useMutation<void, Error, number>(
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
    createCommentMutation,
    deleteCommentMutation,
  };
};

export default useCommentsManagement;
