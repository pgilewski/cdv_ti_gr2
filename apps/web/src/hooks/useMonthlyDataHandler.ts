import { useQuery, UseQueryResult } from 'react-query';
import axios from 'axios';

import { WorkDay } from '../typings/types';

export interface MonthlyData {
  workDays: WorkDay[];
  hoursTotal: number;
  reviewed: boolean;
  reviewedBy?: string;
  // define the structure of the data returned from the /monthly endpoint
}

interface MonthlyDataQueryParams {
  userId?: string;
  date?: string;
}

export const useMonthlyData = ({ userId, date }: MonthlyDataQueryParams): UseQueryResult<MonthlyData> => {
  const queryParams: Record<string, string> = {};

  if (userId) {
    queryParams.userId = userId;
  }

  if (date) {
    queryParams.date = date;
  }

  const queryString = new URLSearchParams(queryParams).toString();

  const api = axios.create({
    baseURL: 'http://localhost:2137',
    withCredentials: true, // This will make sure cookies are sent with every request
  });

  return useQuery<MonthlyData>(['monthly', queryString], async () => {
    if (!userId && !date) {
      const response = await api.get<MonthlyData>(`/monthly`);
      return response.data;
    }
    const response = await api.get<MonthlyData>(`/monthly?${queryString}`);
    return response.data;
  });
};
