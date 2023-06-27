import { Flex, Card, Text, Divider, Group } from '@mantine/core';
import { MonthlyData } from '../../../hooks/useMonthlyDataHandler';

const MonthlySummary = ({ monthlyData }: { monthlyData: MonthlyData }) => {
  console.log(monthlyData);
  const { workDaysCount, workDaysReviewedCount, totalMinutes } = monthlyData;
  return (
    <Card shadow="sm" padding="xl">
      <Text align="center" size="lg" style={{ marginBottom: '20px' }}>
        PODSUMOWANIE MIESIĄCA
      </Text>
      <Group position="center">
        <Flex justify="center" ml="lg" direction="column">
          <Text fz={30} c="blue" mx={'auto'}>
            {(totalMinutes / 60).toFixed(2)}
          </Text>
          <Text>ilość godzin</Text>
        </Flex>
        <Divider orientation="vertical"></Divider>
        <Flex justify="center" ml="lg" direction="column">
          <Text fz={30} c="blue" mx={'auto'}>
            {workDaysReviewedCount} / {workDaysCount}
          </Text>
          <Text>dni potwierdzone/wszystkie dni</Text>
        </Flex>
      </Group>
      <Group>
        <Divider orientation="vertical"></Divider>
      </Group>
    </Card>
  );
};

export default MonthlySummary;
