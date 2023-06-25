import { Flex, Card, Text, Divider, Group } from '@mantine/core';

const MonthlySummary = () => {
  return (
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
  );
};

export default MonthlySummary;
