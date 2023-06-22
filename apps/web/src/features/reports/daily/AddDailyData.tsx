import { Flex } from '@mantine/core';
import { useState, Dispatch, SetStateAction } from 'react';
import { useQueryClient, UseMutationResult } from 'react-query';
import styled from 'styled-components';
import ButtonWithLoading from '../../../components/ButtonWithLoading';
import { CreateWorkDayDto } from '../../../hooks/useWorkDayManagement';
import useWorkDaySearchParams from '../../../hooks/useWorkdaySearchParams';
import { WorkDay } from '../../../typings/types';

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

const AddDailyData = ({
  userId,
  date,
  createWorkDayMutation,
}: {
  userId: string;
  date: string;
  createWorkDayMutation: UseMutationResult<WorkDay, Error, CreateWorkDayDto, unknown>;
}) => {
  const queryClient = useQueryClient();

  const { day } = useWorkDaySearchParams();

  const createWorkDay = () => {
    createWorkDayMutation.mutate(
      {
        userId,
        date,
      },
      {
        onSuccess: (data) => {
          queryClient.invalidateQueries(['workDay', userId, day]);
        },
        onError: () => {
          console.error('Error creating work day');
        },
      }
    );
  };

  return (
    <Flex justify={'center'}>
      <ButtonWithLoading
        loading={createWorkDayMutation.isLoading}
        type={'button'}
        text={'Start day'}
        disabled={createWorkDayMutation.isLoading}
        key={'start-day'}
        onClick={createWorkDay}
        color={'green'}
      />
    </Flex>
  );
};
export default AddDailyData;
