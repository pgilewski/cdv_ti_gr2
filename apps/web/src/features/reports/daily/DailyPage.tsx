import { Flex, Grid, Title } from '@mantine/core';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { WorkDay } from '../../../typings/types';
import { ChangeDayNavbar } from '../ChangeDayNavbar';
import ReviewDayButton from '../ReviewDayButton';
import 'react-datepicker/dist/react-datepicker.css';
import useWorkDayManagement from '../../../hooks/useWorkDayManagement';
import useAuth from '../../../hooks/useAuth';
import dayjs from 'dayjs';

import TaskHoursTable from './TaskHoursTable';
import AddDailyData from './AddDailyData';
import { RotatingLines } from 'react-loader-spinner';

export default function DailyPage() {
  const dayNow = dayjs().format('YYYY-MM-DD');
  const { userInfo } = useAuth();
  // const params = useParams<DailyPageParams>();
  const [searchParams] = useSearchParams();
  const userId = searchParams.get('user') || String(userInfo?.id);
  const day = searchParams.get('day') || dayNow;
  console.log(userId, day);
  const { workDayQuery, createWorkDayMutation, updateWorkDayMutation, deleteWorkDayMutation } = useWorkDayManagement(
    userInfo,
    dayNow
  );

  const [date, setDate] = useState<Date | null>(new Date());

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
          <TaskHoursTable data={workDayQuery.data} />
        ) : (
          <AddDailyData createWorkDayMutation={createWorkDayMutation} date={day} userId={userId} />
        )}
      </Flex>

      {/* <DailyTable setTable={setTable} data={dailyData} /> */}
    </div>
  );
}
const DailyBody = {};
