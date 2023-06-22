import { useSearchParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import useAuth from './useAuth';

type WorkDaySearchParams = {
  userId: string;
  day: string;
};

const useWorkDaySearchParams = (controlledDate?: string): WorkDaySearchParams => {
  const [searchParams] = useSearchParams();
  const { userInfo } = useAuth();
  const [params, setParams] = useState<WorkDaySearchParams>({ userId: '', day: '' });

  useEffect(() => {
    const userId = searchParams.get('user') || String(userInfo?.id);
    const day = searchParams.get('day') || controlledDate || new Date().toISOString();
    setParams({ userId, day });
  }, [searchParams, userInfo, controlledDate]);

  return params;
};

export default useWorkDaySearchParams;
