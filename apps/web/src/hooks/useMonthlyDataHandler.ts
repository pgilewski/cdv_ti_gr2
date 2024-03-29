import { useQuery, UseQueryResult } from 'react-query';
import axios from 'axios';

import { WorkDay } from '../typings/types';
import { useApi } from '../features/ApiProvider';

export interface MonthlyData {
  workDays: WorkDay[];
  reviewed: boolean;
  reviewedBy?: string;
  workDaysCount: number;
  totalMinutes: number;
  workDaysReviewedCount: number;
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
    queryParams.month = month;
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
