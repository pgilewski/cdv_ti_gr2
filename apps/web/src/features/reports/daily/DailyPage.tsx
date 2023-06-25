import { Autocomplete, Button, Flex, Grid, Input, Paper, Text, Title } from '@mantine/core';

import { useContext, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Role, WorkDay } from '../../../typings/types';
import { ChangeDayNavbar } from '../ChangeDayNavbar';
import ReviewDayButton from '../ReviewDayButton';
import 'react-datepicker/dist/react-datepicker.css';
import useWorkDayManagement from '../../../hooks/useWorkDayManagement';
import useAuth from '../../../hooks/useAuth';
import dayjs from 'dayjs';

import TaskHoursTable from './TaskHoursTable';
import AddDailyData from './AddDailyData';
import { RotatingLines } from 'react-loader-spinner';
import Comments from './Comments';
import { useFetchUserIdByEmail } from '../../../hooks/useUserFromEmail';
import useWorkDaySearchParams from '../../../hooks/useWorkdaySearchParams';
import { NotyfContext } from '../../../hooks/useNotyf';
import RoleBasedRender from '../../../components/RoleBasedRender';

function useDebounce(value: string, delay: number) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

export default function DailyPage() {
  const [emailInput, setEmailInput] = useState<string>('');
  const debouncedEmailInput = useDebounce(emailInput, 300); // debounce by 500ms

  const { usersOptions, isLoading: logTypesLoading } = useFetchUserIdByEmail(debouncedEmailInput);

  const [date, setDate] = useState<Date | null>(new Date());

  // const dayNow = dayjs().format('YYYY-MM-DD');
  const { userInfo } = useAuth();
  // const params = useParams<DailyPageParams>();
  const [searchParams] = useSearchParams();
  const { userId, day } = useWorkDaySearchParams();

  const [selectedUserId, setSelectedUserId] = useState<string | undefined>();
  const notyf = useContext(NotyfContext);

  const { workDayQuery, createWorkDayMutation, updateWorkDayMutation, deleteWorkDayMutation } = useWorkDayManagement(
    day,
    selectedUserId !== undefined ? selectedUserId : userId
  );

  const userSearch = () => {
    const selectedUser = usersOptions.find((user) => {
      console.log(user.value, emailInput);

      return user.value === emailInput;
    });
    console.log(selectedUser, emailInput);

    if (selectedUser) {
      setSelectedUserId(String(selectedUser.id));
      console.log(String(selectedUser.id));
    } else {
      notyf.error('Nie udało się wybrać uzytkownika');
    }
  };

  return (
    <div>
      <Title>Daily raport</Title>
      <Grid>
        <Grid.Col span="auto">
          <Flex mt={'auto'}>
            {' '}
            <RoleBasedRender allowedRoles={[Role.Administrator, Role.Moderator]} userRole={userInfo?.role}>
              <Flex>
                <Autocomplete
                  data={usersOptions}
                  placeholder="Enter email"
                  value={emailInput}
                  onChange={setEmailInput}
                />
                <Button mx="sm" onClick={userSearch}>
                  Wyszukaj
                </Button>
              </Flex>
            </RoleBasedRender>
          </Flex>
        </Grid.Col>
        <Grid.Col span={4}>
          <ChangeDayNavbar date={date} setDate={setDate} />
        </Grid.Col>

        <Grid.Col span="auto">
          <Flex justify={'end'}>
            <ReviewDayButton
              reviewed={workDayQuery.data?.isReviewed}
              canEdit={true}
              workDay={workDayQuery.data}
              userInfo={userInfo}
            />
          </Flex>
        </Grid.Col>
      </Grid>

      <Flex justify={'center'} direction={'column'}>
        {workDayQuery.isLoading ? (
          <Flex justify={'center'}>
            <RotatingLines strokeColor="grey" strokeWidth="5" animationDuration="0.75" width="25" visible={true} />
          </Flex>
        ) : workDayQuery.data ? (
          <>
            <TaskHoursTable data={workDayQuery.data} userInfo={userInfo} />
            <Comments data={workDayQuery.data} />
          </>
        ) : (
          <AddDailyData createWorkDayMutation={createWorkDayMutation} date={day} userId={userId} />
        )}
      </Flex>
    </div>
  );
}
