import { useState } from 'react';
import { Button } from '@mantine/core';
import { useMutation } from 'react-query';

type ReviewDayButtonProps = {
  reviewed: boolean;
  canEdit: boolean;
};

const ReviewDayButton = ({ reviewed, canEdit }: ReviewDayButtonProps) => {
  const [isReviewed, setIsReviewed] = useState(reviewed);

  const { mutate } = useMutation(
    (reviewStatus: boolean) =>
      fetch('/api/review-day', {
        method: 'POST',
        body: JSON.stringify({ reviewed: reviewStatus }),
        headers: {
          'Content-Type': 'application/json',
        },
      }),
    {
      onSuccess: () => {
        setIsReviewed(!isReviewed);
      },
      onError: (error: any) => {
        console.log('An error occurred:', error);
      },
    }
  );
  const handleClick = () => {
    if (canEdit) {
      mutate(!isReviewed);
    }
  };

  return (
    <Button
      variant={isReviewed ? 'gradient' : 'outline'}
      color={isReviewed ? 'teal' : 'gray'}
      disabled={!canEdit}
      onClick={handleClick}
    >
      {isReviewed ? 'Reviewed' : 'Not reviewed'}
    </Button>
  );
};

export default ReviewDayButton;
