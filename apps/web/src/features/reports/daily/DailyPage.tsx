import { Button, Flex, Grid, Table, Title, Modal, Group, Text, Select, TextInput, Container } from '@mantine/core';
import { useMutation, UseMutationResult, useQuery, useQueryClient } from 'react-query';
import { useDisclosure, useMediaQuery } from '@mantine/hooks';
import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import ReactDatePicker from 'react-datepicker';
import { Controller, useForm } from 'react-hook-form';
import ReactSelect from 'react-select';
import styled from '@emotion/styled';

import { Task, TaskHour, WorkDay } from '../../../typings/types';
import { ChangeDayNavbar } from '../ChangeDayNavbar';
import ReviewDayButton from '../ReviewDayButton';
import 'react-datepicker/dist/react-datepicker.css';
import useWorkDayManagement, { CreateWorkDayDto } from '../../../hooks/useWorkDayManagement';
import useAuth from '../../../hooks/useAuth';
import dayjs from 'dayjs';
import ButtonWithLoading from '../../../components/ButtonWithLoading';
import { formatDate } from '../../utils';
import { AddTaskHoursModal } from './AddTaskHours';

const SpaceForModal = styled.div`
  padding-bottom: 8rem;
`;
const SelectInputContainer = styled.div`
  padding: 0.5rem 0;
`;

type AddTaskHoursModalProps = {
  isOpen: boolean;
  onClose: () => void;
  workDay: WorkDay;
};

type DailyTable = {
  data: WorkDay;
  setWorkDay: React.Dispatch<React.SetStateAction<any>>;
};

const TaskHoursTable = ({ data, setWorkDay }: DailyTable) => {
  const [opened, { open, close }] = useDisclosure(false);

  const ths = (
    <tr>
      <th>Godziny</th>
      <th>Task</th>
      <th>Notatka</th>
      <th>Akcje</th>
    </tr>
  );
  console.log(data);
  // const rows = data.hours.map((taskHour) => (
  //   <tr key={taskHour.id}>
  //     <td>{taskHour.startTime}</td>
  //     <td>{taskHour.endTime}</td>
  //     <td>{taskHour.duration}</td>
  //     <td>{taskHour.task.name}</td>
  //     <td>{taskHour.task.project.title}</td>
  //   </tr>
  // ));
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
        {/* <tbody>{rows}</tbody> */}
        <tfoot>{ths}</tfoot>
      </Table>
    </Flex>
  );
};

const AddDailyData = ({
  userId,
  date,
  createWorkDayMutation,
  setWorkDay,
}: {
  userId: string;
  date: string;
  createWorkDayMutation: UseMutationResult<WorkDay, Error, CreateWorkDayDto, unknown>;
  setWorkDay: React.Dispatch<React.SetStateAction<any>>;
}) => {
  const queryClient = useQueryClient();

  const createWorkDay = () => {
    createWorkDayMutation.mutate(
      {
        userId,
        date,
      },
      {
        onSuccess: (data) => {
          setWorkDay(data);
          queryClient.invalidateQueries(['workDay', { userId, date }]);
        },
        onError: () => {
          console.error('Error creating work day');
        },
      }
    );
  };

  return (
    <Flex justify={'center'}>
      <ButtonWithLoading
        loading={createWorkDayMutation.isLoading}
        type={'button'}
        text={'Start day'}
        disabled={createWorkDayMutation.isLoading}
        key={'start-day'}
        onClick={createWorkDay}
        color={'green'}
      />
    </Flex>
  );
};
export default function DailyPage() {
  const dayNow = dayjs().format('YYYY-MM-DD');
  const { userInfo } = useAuth();
  // const params = useParams<DailyPageParams>();
  const [searchParams] = useSearchParams();
  const userId = searchParams.get('user') || String(userInfo?.id);
  const day = searchParams.get('day') || dayNow;
  console.log(userId, day);
  const { workDayQuery, createWorkDayMutation, updateWorkDayMutation, deleteWorkDayMutation } = useWorkDayManagement({
    userId,
    day,
  });

  const [date, setDate] = useState<Date | null>(new Date());
  const [workDay, setWorkDay] = useState<WorkDay | null>(null);

  useEffect(() => {
    if (workDayQuery?.data && workDayQuery.data[0]) {
      console.log('workDayQuery.data[0]', workDayQuery.data[0]);
      setWorkDay(workDayQuery.data[0]);
    } else {
      setWorkDay(null);
    }
  }, [workDayQuery.data]);

  if (workDayQuery.isLoading) {
    return <div>Loading...</div>;
  }

  const hasWorkDay = workDay !== null;
  console.log(workDay);
  return (
    <div>
      <Title>Daily raport</Title>
      <Grid m="0">
        <Grid.Col span="auto">{/* <RaportOwnerHeading /> */}</Grid.Col>
        <Grid.Col span={6}>
          <ChangeDayNavbar date={date} setDate={setDate} />
        </Grid.Col>

        <Grid.Col span="auto">
          <Flex justify={'end'}>
            <ReviewDayButton reviewed={true} canEdit={true} />
          </Flex>
        </Grid.Col>
      </Grid>

      <Flex justify={'center'} direction={'column'}>
        {hasWorkDay ? (
          <TaskHoursTable setWorkDay={setWorkDay} data={workDay} />
        ) : (
          <AddDailyData
            createWorkDayMutation={createWorkDayMutation}
            setWorkDay={setWorkDay}
            date={day}
            userId={userId}
          />
        )}
      </Flex>

      {/* <DailyTable setTable={setTable} data={dailyData} /> */}
    </div>
  );
}
