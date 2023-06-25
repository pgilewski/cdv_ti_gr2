import styled from '@emotion/styled';
import { Badge, Card, Paper, Table, Text, Title } from '@mantine/core';
import { Fragment, ReactNode } from 'react';
import { MonthlyData } from '../../../hooks/useMonthlyDataHandler';
import { TaskHour } from '../../../typings/types';
import { formatDate } from '../../utils';

interface MonthlyTableProps {
  data: MonthlyData;
}

interface TableContainerProps {
  children: ReactNode;
}

const TableContainer = styled(({ children, ...rest }: TableContainerProps) => (
  <Card shadow={'sm'} my={'xl'} {...rest}>
    {children}
  </Card>
))`
  min-width: 800px;
  margin: 0 auto;
  padding: 20px;
  display: flex;
  flex-direction: column;
`;

const Row = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 0;
`;

const Cell = styled.div`
  flex-basis: 20%;
  flex-grow: 1;
`;

const MonthlyTable = ({ data }: MonthlyTableProps) => {
  const renderRows = () => {
    if (data.workDays.length === 0) {
      return (
        <Row>
          <Text size="sm" color="gray">
            No workdays found.
          </Text>
        </Row>
      );
    }

    return data.workDays.map((workDay) => {
      const { taskHours } = workDay;

      return (
        <Fragment key={workDay.id}>
          <Row>
            <Cell>
              <Title order={4} style={{ marginBottom: '0.5rem' }}>
                {workDay.date}
              </Title>
            </Cell>
            <Cell></Cell>
            <Cell></Cell>
            <Cell></Cell>
            <Cell>
              {workDay.isReviewed ? <Badge color="green">Reviewed</Badge> : <Badge color="gray">NOT REVIEWED</Badge>}
            </Cell>
          </Row>
          {renderTaskHours(taskHours)}
        </Fragment>
      );
    });
  };

  const renderTaskHours = (taskHours?: TaskHour[]) => {
    if (!taskHours || taskHours.length === 0) {
      return (
        <Row>
          <Cell>
            <Text size="sm" color="gray">
              No task hours recorded.
            </Text>
          </Cell>
        </Row>
      );
    }

    return (
      <>
        <Row>
          <Cell>
            <Text size={'sm'} weight={500}>
              Nazwa taska
            </Text>
          </Cell>
          <Cell>
            <Text size={'sm'} weight={500}>
              Czas trwania (min)
            </Text>
          </Cell>
          <Cell>
            <Text size={'sm'} weight={500}>
              Notatka
            </Text>
          </Cell>
        </Row>
        {taskHours.map((taskHour) => (
          <Row key={taskHour.id}>
            <Cell>
              <Text>{taskHour.task ? taskHour.task.name : 'N/A'}</Text>
            </Cell>
            <Cell>
              <Text>{taskHour.duration}</Text>
            </Cell>
            <Cell>
              <Text>{taskHour.note || '-'}</Text>
            </Cell>
          </Row>
        ))}
      </>
    );
  };

  return (
    <TableContainer>
      {/* <Row>
        <Cell>
          <Text weight={700}>Date</Text>
        </Cell>
        <Cell>
          <Text weight={700}>Status</Text>
        </Cell>
      </Row> */}
      {renderRows()}
    </TableContainer>
  );
};

export default MonthlyTable;
