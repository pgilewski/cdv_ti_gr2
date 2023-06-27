import { useSearchParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import useAuth from './useAuth';

type WorkDaySearchParams = {
  userId: string;
  day: string;
};

const useWorkDaySearchParams = (controlledDate?: string, userId?: string): WorkDaySearchParams => {
  const [searchParams] = useSearchParams();
  const { userInfo } = useAuth();
  const [params, setParams] = useState<WorkDaySearchParams>({ userId: '', day: '' });

  useEffect(() => {
    const resolvedUserId = userId || searchParams.get('user') || String(userInfo?.id);
    const day = controlledDate || searchParams.get('day') || new Date().toISOString().slice(0, 10);
    setParams({ userId: resolvedUserId, day });
    console.log({ userId: resolvedUserId, day });
  }, [searchParams, userInfo, controlledDate, userId]);

  return params;
};

export default useWorkDaySearchParams;
