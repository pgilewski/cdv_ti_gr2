import { Button, Flex, Grid, Table, Title, Modal, Group, Text, Select, TextInput, Container } from '@mantine/core';
import { useMutation, useQuery } from 'react-query';
import { useDisclosure, useMediaQuery } from '@mantine/hooks';
import { useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import ReactDatePicker from 'react-datepicker';
import { Controller, useForm } from 'react-hook-form';
import ReactSelect from 'react-select';
import styled from '@emotion/styled';

import { useDailyData } from '../../../hooks/useDailyData';
import { Task, TaskHour } from '../../../types';
import { ChangeDayNavbar } from '../ChangeDayNavbar';
import ReviewDayButton from '../ReviewDayButton';
import 'react-datepicker/dist/react-datepicker.css';

const SpaceForModal = styled.div`
  padding-bottom: 8rem;
`;
const SelectInputContainer = styled.div`
  padding: 0.5rem 0;
`;

type AddTaskHoursModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const AddTaskHoursModal = ({ isOpen, onClose }: AddTaskHoursModalProps) => {
  const { register, handleSubmit, control, watch, reset } = useForm();
  const [searchParams] = useSearchParams();
  const userId = searchParams.get('user') || undefined;

  const { data: tasks, isLoading } = useQuery<Task[], Error>(['tasks', userId], () => fetchTasksForUser(userId));

  const mutation = useMutation(submitData, {
    onSuccess: () => {
      reset();
      onClose();
    },
  });

  const onSubmit = (data: any) => {
    console.log(data);
    mutation.mutate(data);
  };

  const startDate = watch('startDate');
  const endDate = watch('endDate');

  const isMobile = useMediaQuery('(max-width: 50em)');

  // if (isLoading) {
  //   console.log('isOpen', isOpen);

  //   return <div>Loading...</div>;
  // }

  // if (!tasks) {
  //   return <div>No tasks found</div>;
  // }

  const taskOptions = tasks?.map((task) => ({
    value: task.id,
    label: task.name,
  }));

  return (
    <Modal size={'xl'} opened={isOpen} onClose={onClose} title="" fullScreen={isMobile} centered>
      <SpaceForModal>
        <Text size="xl" weight={700}>
          Add task hours
        </Text>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Flex className="" gap={'sm'} justify={'space-evenly'}>
            <div>
              <label htmlFor="startDate">Start Date:</label>
              <Controller
                name="startDate"
                control={control}
                rules={{ required: 'This field is required' }}
                render={({ field }) => (
                  <ReactDatePicker
                    autoComplete="off"
                    selected={field.value}
                    onChange={(date) => field.onChange(date)}
                    showTimeSelect
                    showTimeSelectOnly
                    timeIntervals={15}
                    timeCaption="Time"
                    dateFormat="HH:mm"
                    timeFormat="HH:mm"
                  />
                )}
              />
            </div>
            <div>
              <label htmlFor="endDate">End Date:</label>
              <Controller
                name="endDate"
                control={control}
                rules={{ required: 'This field is required' }}
                render={({ field }) => (
                  <ReactDatePicker
                    autoComplete="off"
                    id="endDate"
                    selected={field.value}
                    onChange={(date) => field.onChange(date)}
                    showTimeSelect
                    showTimeSelectOnly
                    timeIntervals={15}
                    timeCaption="Time"
                    dateFormat="HH:mm"
                    timeFormat="HH:mm"
                  />
                )}
              />
            </div>
          </Flex>

          <SelectInputContainer>
            <div>
              <label htmlFor="task">Task:</label>
              <Controller
                name="taskId"
                control={control}
                rules={{ required: 'This field is required' }}
                render={({ field }) => (
                  <ReactSelect
                    id="task"
                    inputId="task"
                    value={taskOptions?.find((option) => option.value === field.value)}
                    options={isLoading ? [] : taskOptions}
                    isLoading={isLoading}
                    isDisabled={isLoading}
                    placeholder={isLoading ? 'Loading...' : 'Select a task'}
                    onChange={(option) => field.onChange(option?.value)}
                  />
                )}
              />
            </div>
            <div>
              <TextInput id="note" placeholder="Co robiles..." label="Note" {...register('note')} autoComplete="off" />
            </div>
          </SelectInputContainer>
          <button type="submit">Submit</button>
        </form>
      </SpaceForModal>
    </Modal>
  );
};
async function fetchTasksForUser(userId?: string) {
  if (!userId) {
    throw new Error('User ID is required');
  }

  try {
    const response = await fetch(`/api/tasks?userId=${userId}`);

    if (!response.ok) {
      throw new Error('Failed to fetch tasks');
    }

    const tasks = await response.json();
    return tasks as Task[];
  } catch (error) {
    console.error('Error fetching tasks:', error);
    throw error;
  }
}

async function submitData(data: any) {
  try {
    const response = await fetch('/api/task-hours', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to submit task hours data');
    }

    const taskHour = await response.json();
    return taskHour as TaskHour;
  } catch (error) {
    console.error('Error submitting task hours data:', error);
    throw error;
  }
}

type DailyTable = {
  data: any;
  setTable: React.Dispatch<React.SetStateAction<any>>;
};

const DailyTable = ({ data, setTable }: DailyTable) => {
  const elements = [
    { position: 6, mass: 12.011, symbol: 'C', name: 'Carbon' },
    { position: 7, mass: 14.007, symbol: 'N', name: 'Nitrogen' },
  ];
  const ths = (
    <tr>
      <th>Godziny</th>
      <th>Task</th>
      <th>Notatka</th>
      <th>Akcje</th>
    </tr>
  );

  const rows = elements.map((element) => (
    <tr key={element.name}>
      <td>{element.position}</td>
      <td>{element.name}</td>
      <td>{element.symbol}</td>
      <td>{element.mass}</td>
    </tr>
  ));
  return (
    <Table highlightOnHover>
      <caption></caption>
      <thead>{ths}</thead>
      <tbody>{rows}</tbody>
      <tfoot>{ths}</tfoot>
    </Table>
  );
};

export default function DailyPage() {
  // take from url params day and month and year and fetch data

  // const params = useParams<DailyPageParams>();
  const [searchParams] = useSearchParams();

  const {
    data: dailyData,
    isLoading,
    isError,
  } = useDailyData({
    userId: searchParams.get('user') || undefined,
    day: searchParams.get('day') || undefined,
  });

  console.log(searchParams);

  const [opened, { open, close }] = useDisclosure(false);
  const [date, setDate] = useState<Date | null>(new Date());
  const [table, setTable] = useState<any>([]);
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

      <AddTaskHoursModal isOpen={opened} onClose={close} />
      <Flex justify={'center'}>
        <Button color="blue" onClick={open}>
          Add hours
        </Button>
      </Flex>

      <DailyTable setTable={setTable} data={dailyData} />
    </div>
  );
}
