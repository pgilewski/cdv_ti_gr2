import { Flex, Grid, Title, Card, Text, Divider, Group } from '@mantine/core';
import { MonthPickerInput } from '@mantine/dates';
import { useDisclosure } from '@mantine/hooks';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import useAuth from '../../../hooks/useAuth';

import { useMonthlyData } from '../../../hooks/useMonthlyDataHandler';
import useMonthlySearchParams from '../../../hooks/useMonthlySearchParams';
import ReviewDayButton from '../ReviewDayButton';
import MonthlySummary from './MonthlySummary';

import MonthlyTable from './MonthlyTable';

export default function MonthlyPage() {
  const [inputMonth, setInputMonth] = useState<Date | null>(new Date());

  const [selectedUser, setSelectedUser] = useState<string | null>(null);

  const { userInfo } = useAuth();

  const { userId, month } = useMonthlySearchParams({
    propsMonth: (inputMonth || new Date()).toISOString().slice(0, 7),
    propsUserId: selectedUser || (userInfo ? String(userInfo.id) : null),
  });

  const {
    data: monthlyData,
    isLoading,
    isError,
  } = useMonthlyData({
    userId: userId,
    month: month,
  });

  const [opened, { open, close }] = useDisclosure(false);
  const [table, setTable] = useState<any>([]);

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (inputMonth) {
      const searchParams = new URLSearchParams(location.search);
      searchParams.set('date', inputMonth.toISOString().slice(0, 7));
      navigate({ search: searchParams.toString() });
    }
  }, [inputMonth]);

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
              value={inputMonth}
              onChange={setInputMonth}
              mx="auto"
              miw={200}
              maw={800}
            />
          </Flex>
        </Grid.Col>
        <Grid.Col span="auto">
          <Flex justify={'end'}></Flex>
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
