import { useSearchParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import useAuth from './useAuth';

type MonthlySearchProps = {
  propsUserId: string | null;
  propsMonth: string | null;
};

const useMonthlySearchParams = ({ propsUserId, propsMonth }: MonthlySearchProps): { userId: string; month: string } => {
  const [searchParams] = useSearchParams();
  const { userInfo } = useAuth();
  const [params, setParams] = useState<{ userId: string; month: string }>({ userId: '', month: '' });

  useEffect(() => {
    const userId = propsUserId || searchParams.get('user') || String(userInfo?.id);
    const month = propsMonth || searchParams.get('month') || new Date().toISOString();
    setParams({ userId, month });
  }, [searchParams, userInfo, propsUserId, propsMonth]);

  return params;
};

export default useMonthlySearchParams;
