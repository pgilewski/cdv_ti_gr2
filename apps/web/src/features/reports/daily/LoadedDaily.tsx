import { Button, Flex, Table, Text } from '@mantine/core';

import { TaskHour, WorkDay } from '../../../typings/types';

type HoursTableProps = {
  data: TaskHour[];
};
const HoursTable = ({ data }: HoursTableProps) => {
  console.log('hours data', data);

  const ths = (
    <tr>
      <th>Czas początku</th>
      <th>Czas końca</th>
      <th>Czas trwania</th>
      <th>Zadanie</th>
      <th>Akcje</th>
    </tr>
  );

  if (data.length === 0) {
    return (
      <Table>
        <thead>{ths}</thead>
        <caption>Brak wpisanych godzin.</caption>
      </Table>
    );
  }

  const rows = data.map((element) => (
    <tr key={element.id}>
      <td>{element.startTime}</td>
      <td>{element.endTime}</td>
      <td>{element.duration}</td>
      <td>{element.task.name}</td>
      <td>Action</td>
    </tr>
  ));

  console.log('data', data);
  return (
    <Table highlightOnHover>
      <caption></caption>
      <thead>{ths}</thead>
      <tbody>{rows}</tbody>
      <tfoot>{ths}</tfoot>
    </Table>
  );
};

const LoadedDaily = ({ dailyWorkDay, open }: { dailyWorkDay: WorkDay | null; open: () => void }) => {
  if (!dailyWorkDay) {
    return null;
  }

  return (
    <>
      <Flex justify={'center'} direction="column">
        <Text align="center">{dailyWorkDay.createdAt}</Text>

        <Flex justify={'center'}>
          <Button color="blue" onClick={open}>
            Add hours
          </Button>
        </Flex>
      </Flex>
      {dailyWorkDay.hours ? <HoursTable data={dailyWorkDay.hours} /> : null}
    </>
  );
};

export default LoadedDaily;
