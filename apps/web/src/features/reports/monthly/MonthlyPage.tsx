import { Flex, Grid, Title, Card, Text, Divider, Group } from '@mantine/core';
import { MonthPickerInput } from '@mantine/dates';
import { useDisclosure } from '@mantine/hooks';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import useAuth from '../../../hooks/useAuth';

import { useMonthlyData } from '../../../hooks/useMonthlyDataHandler';
import ReviewDayButton from '../ReviewDayButton';
import MonthlySummary from './MonthlySummary';

import MonthlyTable from './MonthlyTable';

export default function MonthlyPage() {
  const [searchParams] = useSearchParams();
  const { userInfo } = useAuth();
  console.log(searchParams.get('month'));
  const {
    data: monthlyData,
    isLoading,
    isError,
  } = useMonthlyData({
    userId: searchParams.get('user') || undefined,
    month: searchParams.get('month') || undefined,
  });

  console.log(searchParams);

  const [opened, { open, close }] = useDisclosure(false);
  const [month, setMonth] = useState<Date | null>(new Date());
  const [table, setTable] = useState<any>([]);

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (month) {
      const searchParams = new URLSearchParams(location.search);
      searchParams.set('date', month.toISOString().slice(0, 7));
      navigate({ search: searchParams.toString() });
    }
  }, [month]);

  return (
    <div>
      <Title>Monthly raport</Title>
      <Grid m="0">
        <Grid.Col span="auto">
          <Flex justify={'space-between'}></Flex>
        </Grid.Col>
        <Grid.Col span={4}>
          <Flex justify={'space-between'}>
            <div></div>
            <MonthPickerInput
              label="Pick date"
              placeholder="Pick date"
              value={month}
              onChange={setMonth}
              mx="auto"
              miw={200}
              maw={800}
            />
          </Flex>
        </Grid.Col>
        <Grid.Col span="auto">
          <Flex justify={'end'}>{/* <ReviewDayButton reviewed={true} canEdit={true} userInfo={userInfo} /> */}</Flex>
        </Grid.Col>
        <Grid.Col>
          <Flex justify="center" ml="lg">
            {monthlyData && <MonthlySummary monthlyData={monthlyData} />}
          </Flex>
        </Grid.Col>
        <Grid.Col>
          <Flex>{monthlyData && <MonthlyTable data={monthlyData} />}</Flex>
        </Grid.Col>
      </Grid>
    </div>
  );
}
