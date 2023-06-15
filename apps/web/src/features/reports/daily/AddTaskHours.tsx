import {
  Button,
  Flex,
  Grid,
  Table,
  Title,
  Modal,
  Group,
  Text,
  Select,
  TextInput,
  Container,
  UnstyledButton,
} from '@mantine/core';
import styled from '@emotion/styled';
import { useMediaQuery } from '@mantine/hooks';
import { Controller, useForm } from 'react-hook-form';
import { useMutation, useQuery } from 'react-query';
import { useSearchParams } from 'react-router-dom';
import ReactDatePicker from 'react-datepicker';
import ReactSelect from 'react-select';

import { Task, TaskHour, WorkDay } from '../../../typings/types';
import { useApi } from '../../ApiProvider';

const SpaceForModal = styled.div`
  padding-bottom: 8rem;
`;
const SelectInputContainer = styled.div`
  padding: 0.5rem 0;
`;

type AddTaskHoursModalProps = {
  isOpen: boolean;
  onClose: () => void;
  workDay: WorkDay;
};
async function submitData(data: any) {
  try {
    const response = await fetch('/api/task-hours', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to submit task hours data');
    }

    const taskHour = await response.json();
    return taskHour as TaskHour;
  } catch (error) {
    console.error('Error submitting task hours data:', error);
    throw error;
  }
}

export const AddTaskHoursModal = ({ isOpen, onClose, workDay }: AddTaskHoursModalProps) => {
  const { register, handleSubmit, control, watch, reset } = useForm();
  const userId = String(workDay.userId);
  const api = useApi();
  const { data: tasks, isLoading } = useQuery<Task[], Error>(['tasks', userId], async () => {
    const response = await api.get<Task[]>('/tasks?userId=' + userId);
    return response.data;
  });

  const mutation = useMutation(
    async (data: TaskHour) => {
      console.log('mutation data', data);
      const response = await api.post<TaskHour>(`/reports/${userId}/${workDay.id}`, data);
      return response.data;
    },
    {
      onSuccess: () => {
        reset();
        onClose();
      },
    }
  );

  const onSubmit = (data: any) => {
    console.log(data);
    mutation.mutate(data);
  };

  const startDate = watch('startDate');
  const endDate = watch('endDate');

  const isMobile = useMediaQuery('(max-width: 50em)');

  // if (isLoading) {
  //   console.log('isOpen', isOpen);

  //   return <div>Loading...</div>;
  // }

  // if (!tasks) {
  //   return <div>No tasks found</div>;
  // }

  const taskOptions = tasks?.map((task) => ({
    value: task.id,
    label: task.name,
  }));

  return (
    <Modal size={'xl'} opened={isOpen} onClose={onClose} title="" fullScreen={isMobile} centered>
      <SpaceForModal>
        <Text size="xl" weight={700}>
          Add task hours
        </Text>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Flex className="" gap={'sm'} justify={'space-evenly'}>
            <div>
              <label htmlFor="startDate">Start Date:</label>
              <Controller
                name="startDate"
                control={control}
                rules={{ required: 'This field is required' }}
                render={({ field }) => (
                  <ReactDatePicker
                    autoComplete="off"
                    selected={field.value}
                    onChange={(date) => field.onChange(date)}
                    showTimeSelect
                    showTimeSelectOnly
                    timeIntervals={15}
                    timeCaption="Time"
                    dateFormat="HH:mm"
                    timeFormat="HH:mm"
                  />
                )}
              />
            </div>
            <div>
              <label htmlFor="endDate">End Date:</label>
              <Controller
                name="endDate"
                control={control}
                rules={{ required: 'This field is required' }}
                render={({ field }) => (
                  <ReactDatePicker
                    autoComplete="off"
                    id="endDate"
                    selected={field.value}
                    onChange={(date) => field.onChange(date)}
                    showTimeSelect
                    showTimeSelectOnly
                    timeIntervals={15}
                    timeCaption="Time"
                    dateFormat="HH:mm"
                    timeFormat="HH:mm"
                  />
                )}
              />
            </div>
          </Flex>

          <SelectInputContainer>
            <div>
              <label htmlFor="task">Task:</label>
              <Controller
                name="taskId"
                control={control}
                rules={{ required: 'This field is required' }}
                render={({ field }) => (
                  <ReactSelect
                    id="task"
                    inputId="task"
                    value={taskOptions?.find((option) => option.value === field.value)}
                    options={isLoading ? [] : taskOptions}
                    isLoading={isLoading}
                    isDisabled={isLoading}
                    placeholder={isLoading ? 'Loading...' : 'Select a task'}
                    onChange={(option) => field.onChange(option?.value)}
                  />
                )}
              />
            </div>
            <div>
              <TextInput id="note" placeholder="Co robiles..." label="Note" {...register('note')} autoComplete="off" />
            </div>
          </SelectInputContainer>
          <button type="submit">Submit</button>
        </form>
      </SpaceForModal>
    </Modal>
  );
};
async function fetchTasksForUser(userId?: string) {
  if (!userId) {
    throw new Error('User ID is required');
  }

  try {
    const response = await fetch(`/api/tasks?userId=${userId}`);

    if (!response.ok) {
      throw new Error('Failed to fetch tasks');
    }

    const tasks = await response.json();
    return tasks as Task[];
  } catch (error) {
    console.error('Error fetching tasks:', error);
    throw error;
  }
}
