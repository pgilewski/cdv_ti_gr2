import { useState } from 'react';
import { Button } from '@mantine/core';
import { useMutation, useQueryClient } from 'react-query';
import { WorkDay } from '../../typings/types';
import { UserInfoType } from '../auth/AuthContext';
import { useApi } from '../ApiProvider';
import useWorkDaySearchParams from '../../hooks/useWorkdaySearchParams';

type ReviewDayButtonProps = {
  reviewed?: boolean;
  canEdit: boolean;
  workDay: WorkDay | undefined;
  userInfo: UserInfoType | null;
};

const ReviewDayButton = ({ reviewed, canEdit, workDay, userInfo }: ReviewDayButtonProps) => {
  const api = useApi();
  const { userId, day } = useWorkDaySearchParams();
  const queryClient = useQueryClient();
  if (!userInfo) throw new Error('Missing userInfo');
  const { mutate } = useMutation(
    (reviewStatus: boolean) =>
      api.patch(`/reports/daily/${workDay?.id}`, { isReviewed: reviewStatus, reviewedBy: userInfo?.id }),

    {
      onSuccess: () => {
        queryClient.invalidateQueries(['workDay', userId, day]);
      },
      onError: (error: any) => {
        console.log('An error occurred:', error);
      },
    }
  );
  const handleClick = () => {
    if (canEdit) {
      mutate(!reviewed);
    }
  };

  return (
    <Button
      variant={reviewed ? 'gradient' : 'outline'}
      color={reviewed ? 'teal' : 'gray'}
      disabled={!canEdit}
      onClick={handleClick}
    >
      {reviewed ? 'Zatwierdzone' : 'Nie zatwierdzone'}
    </Button>
  );
};

export default ReviewDayButton;
