import { useSearchParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import useAuth from './useAuth';

type MonthlySearchParams = {
  userId: string;
  month: string;
};

const useMonthlySearchParams = (controlledDate?: string): MonthlySearchParams => {
  const [searchParams] = useSearchParams();
  const { userInfo } = useAuth();
  const [params, setParams] = useState<MonthlySearchParams>({ userId: '', month: '' });

  useEffect(() => {
    const userId = searchParams.get('user') || String(userInfo?.id);
    const month = searchParams.get('month') || controlledDate || new Date().toISOString();
    setParams({ userId, month });
  }, [searchParams, userInfo, controlledDate]);

  return params;
};

export default useMonthlySearchParams;
