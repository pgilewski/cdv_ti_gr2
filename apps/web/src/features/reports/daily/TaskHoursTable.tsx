import { Button, Flex, Grid, Table, Text } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useQueryClient } from 'react-query';
import useTaskHourManagement from '../../../hooks/useTaskHourManagement';
import { WorkDay } from '../../../typings/types';
import { UserInfoType } from '../../auth/AuthContext';
import { formatDate } from '../../utils';
import { AddTaskHoursModal } from './AddTaskHours';

type DailyTable = {
  data: WorkDay;
  userInfo?: UserInfoType | null;
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
        cursor: 'pointer',
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
const TaskHoursTable = ({ data, userInfo }: DailyTable) => {
  const [opened, { open, close }] = useDisclosure(false);
  const { deleteTaskHourMutation } = useTaskHourManagement(data);
  const queryClient = useQueryClient();
  const deleteTaskHour = (taskHourId: number, data: WorkDay) => {
    deleteTaskHourMutation.mutate(taskHourId, {
      onSuccess: () => {
        console.log(data);
        console.log('ADsadsad');
        queryClient.invalidateQueries(['workDay', String(data.userId), data.date]);
      },
      onError: () => {
        console.log('ADsadsad');

        console.error('Error creating work day');
      },
    });
  };
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
            <span onClick={() => deleteTaskHour(taskHour.id, data)}>
              <BinIcon />
            </span>
          </td>
        </tr>
      ))
    : null;
  return (
    <Flex direction={'column'} justify={'center'}>
      <Flex justify={'space-between'}>
        {/* <Flex>
          <Text size="lg" weight={600}>
            Ostatnio aktualizowane:
          </Text>
          <Text ml={'4px'} size="lg">
            {formatDate(data.updatedAt)}
          </Text>
        </Flex> */}
      </Flex>
      <AddTaskHoursModal workDay={data} isOpen={opened} onClose={close} />

      <Grid>
        <Grid.Col span="auto">
          {data.userId !== userInfo?.id ? (
            <>
              <Text size="md">Konto {data.user.email}</Text>
            </>
          ) : null}
        </Grid.Col>
        <Grid.Col span={3}>
          <Flex justify={'center'}>
            <Button color="blue" onClick={open}>
              Dodaj godziny
            </Button>
          </Flex>
        </Grid.Col>
        <Grid.Col span="auto">
          <Text ml={'auto'} size="md" align="end">
            Ostatnio aktualizowane: {formatDate(data.updatedAt)}
          </Text>
        </Grid.Col>
        <div></div>{' '}
      </Grid>

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
