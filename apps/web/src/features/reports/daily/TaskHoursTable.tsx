import { Button, Flex, Table, Text } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import useTaskHourManagement from '../../../hooks/useTaskHourManagement';
import { WorkDay } from '../../../typings/types';
import { formatDate } from '../../utils';
import { AddTaskHoursModal } from './AddTaskHours';

type DailyTable = {
  data: WorkDay;
};

const BinIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 14 14"
      style={{
        width: '20px',
        height: '20px',
      }}
    >
      <g id="recycle-bin-2--remove-delete-empty-bin-trash-garbage">
        <path id="Vector" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" d="M1 3.5H13" />
        <path
          id="Vector_2"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M2.5 3.5H11.5V12.5C11.5 12.7652 11.3946 13.0196 11.2071 13.2071C11.0196 13.3946 10.7652 13.5 10.5 13.5H3.5C3.23478 13.5 2.98043 13.3946 2.79289 13.2071C2.60536 13.0196 2.5 12.7652 2.5 12.5V3.5Z"
        />
        <path
          id="Vector_3"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M4.5 3.5V3C4.5 2.33696 4.76339 1.70107 5.23223 1.23223C5.70107 0.763392 6.33696 0.5 7 0.5C7.66304 0.5 8.29893 0.763392 8.76777 1.23223C9.23661 1.70107 9.5 2.33696 9.5 3V3.5"
        />
        <path
          id="Vector_4"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M5.5 6.50146V10.503"
        />
        <path
          id="Vector_5"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M8.5 6.50146V10.503"
        />
      </g>
    </svg>
  );
};
const TaskHoursTable = ({ data }: DailyTable) => {
  const [opened, { open, close }] = useDisclosure(false);
  const { deleteTaskHourMutation } = useTaskHourManagement();

  const ths = (
    <tr>
      <th>Start</th>
      <th>Koniec</th>
      <th>Trwanie</th>
      <th>Nazwa taska</th>
      <th>Notatka</th>
      <th>Projekt</th>
      <th>Akcje</th>
    </tr>
  );
  console.log(data);
  const rows = data.taskHours
    ? data.taskHours.map((taskHour) => (
        <tr key={taskHour.id}>
          <td>{formatDate(taskHour.startTime)}</td>
          <td>{formatDate(taskHour.endTime)}</td>
          <td>{taskHour.duration}</td>
          <td>{taskHour.task.name}</td>
          <td>{taskHour.note}</td>
          <td>{taskHour.task.project.title}</td>
          <td>
            <span onClick={() => deleteTaskHourMutation.mutate(taskHour.id)}>
              <BinIcon />
            </span>
          </td>
        </tr>
      ))
    : null;
  return (
    <Flex direction={'column'} justify={'center'}>
      <Flex>
        <Text size="lg" weight={600}>
          Updated at:
        </Text>
        <Text ml={'4px'} size="lg">
          {formatDate(data.updatedAt)}
        </Text>
      </Flex>
      <AddTaskHoursModal workDay={data} isOpen={opened} onClose={close} />

      <Flex justify={'center'}>
        <Button color="blue" onClick={open}>
          Add hours
        </Button>
      </Flex>

      <Table highlightOnHover>
        <caption></caption>
        <thead>{ths}</thead>
        <tbody>{rows}</tbody>
        <tfoot>{ths}</tfoot>
      </Table>
    </Flex>
  );
};

export default TaskHoursTable;
