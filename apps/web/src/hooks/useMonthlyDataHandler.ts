import { useQuery, UseQueryResult } from 'react-query';
import axios from 'axios';

import { WorkDay } from '../typings/types';
import { useApi } from '../features/ApiProvider';

export interface MonthlyData {
  workDays: WorkDay[];
  hoursTotal: number;
  reviewed: boolean;
  reviewedBy?: string;
  // define the structure of the data returned from the /monthly endpoint
}

interface MonthlyDataQueryParams {
  userId?: string;
  month?: string;
}

export const useMonthlyData = ({ userId, month }: MonthlyDataQueryParams): UseQueryResult<MonthlyData> => {
  const queryParams: Record<string, string> = {};

  if (userId) {
    queryParams.userId = userId;
  }

  if (month) {
    queryParams.day = month;
  }

  const queryString = new URLSearchParams(queryParams).toString();

  const api = useApi();

  return useQuery<MonthlyData>(['monthly', queryString], async () => {
    if (!userId && !month) {
      const response = await api.get<MonthlyData>(`/reports/monthly`);
      return response.data;
    }
    const response = await api.get<MonthlyData>(`/reports/monthly?${queryString}`);
    return response.data;
  });
};
