import { useQuery, UseQueryResult } from 'react-query';
import axios from 'axios';

interface DailyData {
  // define the structure of the data returned from the /daily endpoint
  id: number;
}

interface DailyDataQueryParams {
  userId?: string;
  day?: string;
}

export const useDailyData = ({ userId, day }: DailyDataQueryParams): UseQueryResult<DailyData> => {
  const queryParams: Record<string, string> = {};

  if (userId) {
    queryParams.userId = userId;
  }

  if (day) {
    queryParams.day = day;
  }

  const queryString = new URLSearchParams(queryParams).toString();

  return useQuery<DailyData>(['daily', queryString], async () => {
    if (!userId && !day) {
      const response = await axios.get<DailyData>(`/daily`);
      return response.data;
    }
    const response = await axios.get<DailyData>(`/daily?${queryString}`);
    return response.data;
  });
};
