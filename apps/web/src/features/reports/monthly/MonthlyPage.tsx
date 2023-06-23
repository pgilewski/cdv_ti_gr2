import { Flex, Grid, Title, Card, Text, Divider, Group } from '@mantine/core';
import { MonthPickerInput } from '@mantine/dates';
import { useDisclosure } from '@mantine/hooks';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import useAuth from '../../../hooks/useAuth';

import { useMonthlyData } from '../../../hooks/useMonthlyDataHandler';
import ReviewDayButton from '../ReviewDayButton';

import { MonthlyTable } from './MonthlyTable';

export default function MonthlyPage() {
  const [searchParams] = useSearchParams();
  const { userInfo } = useAuth();
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
          <Flex justify={'end'}>{/* <ReviewDayButton reviewed={true} canEdit={true} userInfo={userInfo} /> */}</Flex>
        </Grid.Col>
        <Grid.Col>
          <Flex justify="center" ml="lg">
            <Card shadow="sm" padding="xl">
              <Text align="center" size="lg" style={{ marginBottom: '20px' }}>
                PODSUMOWANIE MIESIĄCA
              </Text>
              <Group position="center">
                <Flex justify="center" ml="lg" direction="column">
                  <Text fz={30} c="blue" mx={'auto'}>
                    93
                  </Text>
                  <Text>ilość godzin</Text>
                </Flex>
                <Divider orientation="vertical"></Divider>
                <Flex justify="center" ml="lg" direction="column">
                  <Text fz={30} c="blue" mx={'auto'}>
                    6 / 18
                  </Text>
                  <Text>dni potwierdzone/wszystkie dni</Text>
                </Flex>
              </Group>
              <Group>
                <Divider orientation="vertical"></Divider>
              </Group>
            </Card>
          </Flex>
        </Grid.Col>
      </Grid>
      <Flex>{monthlyData && <MonthlyTable data={monthlyData} />}</Flex>
    </div>
  );
}
