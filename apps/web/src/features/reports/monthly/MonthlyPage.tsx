import { Flex, Grid, Title, Card, Text, Divider, Group, Autocomplete, Button } from '@mantine/core';
import { MonthPickerInput } from '@mantine/dates';
import { useDisclosure } from '@mantine/hooks';
import { useContext, useEffect, useState } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import LoadingState from '../../../components/LoadingState';
import RoleBasedRender from '../../../components/RoleBasedRender';
import useAuth from '../../../hooks/useAuth';
import { useDebounce } from '../../../hooks/useDebounce';

import { useMonthlyData } from '../../../hooks/useMonthlyDataHandler';
import useMonthlySearchParams from '../../../hooks/useMonthlySearchParams';
import { NotyfContext } from '../../../hooks/useNotyf';
import { useFetchUserIdByEmail } from '../../../hooks/useUserFromEmail';
import { Role } from '../../../typings/types';
import ReviewDayButton from '../ReviewDayButton';
import MonthlySummary from './MonthlySummary';

import MonthlyTable from './MonthlyTable';

export default function MonthlyPage() {
  const [inputMonth, setInputMonth] = useState<Date | null>(new Date());

  const [selectedUser, setSelectedUser] = useState<string | null>(null);

  const { userInfo } = useAuth();

  const { userId, month } = useMonthlySearchParams({
    propsMonth: (inputMonth || new Date()).toISOString().slice(0, 7),
    propsUserId: selectedUser || (userInfo ? String(userInfo.id) : null),
  });
  const [emailInput, setEmailInput] = useState<string>('');

  const debouncedEmailInput = useDebounce(emailInput, 300); // debounce by 500ms
  const { usersOptions, isLoading: logTypesLoading } = useFetchUserIdByEmail(debouncedEmailInput);

  const {
    data: monthlyData,
    isLoading,
    isError,
  } = useMonthlyData({
    userId: userId,
    month: month,
  });

  const [opened, { open, close }] = useDisclosure(false);
  const [table, setTable] = useState<any>([]);

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (inputMonth) {
      const searchParams = new URLSearchParams(location.search);
      searchParams.set('date', inputMonth.toISOString().slice(0, 7));
      navigate({ search: searchParams.toString() });
    }
  }, [inputMonth]);
  const notyf = useContext(NotyfContext);
  const userSearch = () => {
    const selectedUser = usersOptions.find((user) => {
      console.log(user.value, emailInput);

      return user.value === emailInput;
    });
    console.log(selectedUser, emailInput);

    if (selectedUser) {
      setSelectedUser(String(selectedUser.id));
      console.log(String(selectedUser.id));
    } else {
      notyf.error('Nie udało się wybrać uzytkownika');
    }
  };

  return (
    <div>
      <Title>Monthly raport</Title>
      <Grid m="0" align="flex-end">
        <Grid.Col span="auto">
          <Flex justify={'space-between'} mt={'auto'}>
            <RoleBasedRender allowedRoles={[Role.Administrator, Role.Moderator]} userRole={userInfo?.role}>
              <Flex mt={'auto'} miw={'400px'}>
                <Autocomplete
                  w={'100%'}
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
          <Flex justify={'space-between'}>
            <div></div>
            <MonthPickerInput
              label="Wybierz miesiąc"
              placeholder="Wybierz miesiąc"
              value={inputMonth}
              onChange={setInputMonth}
              mx="auto"
              miw={200}
              maw={800}
              size={'lg'}
            />
          </Flex>
        </Grid.Col>
        <Grid.Col span="auto">
          <Flex justify={'end'}></Flex>
        </Grid.Col>
      </Grid>
      <Grid>
        {monthlyData ? (
          <>
            <Grid.Col>
              <Flex justify="center" ml="lg">
                <MonthlySummary monthlyData={monthlyData} />
              </Flex>
            </Grid.Col>
            <Grid.Col>
              <Flex>
                <MonthlyTable data={monthlyData} />
              </Flex>
            </Grid.Col>
          </>
        ) : (
          <Grid.Col span="auto">
            <LoadingState />
          </Grid.Col>
        )}
      </Grid>
    </div>
  );
}
