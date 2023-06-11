import { Flex, Grid, Title } from '@mantine/core';
import { MonthPickerInput } from '@mantine/dates';
import { useDisclosure } from '@mantine/hooks';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';

import { useMonthlyData } from '../../../hooks/useMonthlyDataHandler';
import ReviewDayButton from '../ReviewDayButton';

import { MonthlyTable } from './MonthlyTable';

export default function MonthlyPage() {
  const [searchParams] = useSearchParams();

  const {
    data: monthlyData,
    isLoading,
    isError,
  } = useMonthlyData({
    userId: searchParams.get('user') || undefined,
    date: searchParams.get('date') || undefined,
  });

  console.log(searchParams);

  const [opened, { open, close }] = useDisclosure(false);
  const [date, setDate] = useState<Date | null>(new Date());
  const [table, setTable] = useState<any>([]);

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (date) {
      const searchParams = new URLSearchParams(location.search);
      searchParams.set('date', date.toISOString().slice(0, 7));
      navigate({ search: searchParams.toString() });
    }
  }, [date]);

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
              value={date}
              onChange={setDate}
              mx="auto"
              miw={200}
              maw={800}
            />
          </Flex>
        </Grid.Col>
        <Grid.Col span="auto">
          <Flex justify={'end'}>
            <ReviewDayButton reviewed={true} canEdit={true} />
          </Flex>
        </Grid.Col>
      </Grid>
      <Flex>{monthlyData && <MonthlyTable data={monthlyData} />}</Flex>
    </div>
  );
}
