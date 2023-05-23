import { Avatar, Button, Flex, UnstyledButton, useMantineTheme, createStyles } from '@mantine/core';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import { IconArrowLeft, IconArrowRight } from '@tabler/icons-react';

const useIconButtonStyles = createStyles((theme) => ({
  button: {
    display: 'flex',
    width: '2.3rem',
    height: '2.3rem',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: theme.radius.sm,
    color: 'white',

    backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.blue[6],
    transition: 'background-color 200ms ease',
    '&:hover': {
      backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.colors.blue[7],
    },
    boxShadow: 'rgba(99, 99, 99, 0.2) 0px 2px 8px 0px',
  },
}));

function IconButton({ children, ...rest }: any) {
  const theme = useMantineTheme();
  const { classes } = useIconButtonStyles();

  return (
    <Flex align={'center'} p={'xs'}>
      <UnstyledButton className={classes.button} {...rest}>
        {children}
      </UnstyledButton>
    </Flex>
  );
}
function addDays(date: Date, days: number) {
  const newDate = new Date(date);
  newDate.setDate(newDate.getDate() + days);
  return newDate;
}

export const ChangeDayNavbar = ({
  setDate,
  date,
}: {
  setDate: React.Dispatch<React.SetStateAction<Date | null>>;
  date: Date | null;
}) => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (date) {
      const searchParams = new URLSearchParams(location.search);
      searchParams.set('day', date.toISOString().slice(0, 10));
      navigate({ search: searchParams.toString() });
    }
  }, [date]);

  return (
    <Flex justify={'center'} className="" id="main_datepicker">
      <Flex>
        <IconButton>
          <IconArrowLeft
            onClick={() => setDate((prevDate) => addDays(prevDate || new Date(), -1))}
            width={'2.3rem'}
            height={'2.3rem'}
          />
        </IconButton>
        <DatePicker
          // open={open}
          // date={date}
          // onClose={() => setOpen(false)}
          onChange={setDate}
          selected={date}
        />
        <IconButton>
          <IconArrowRight
            onClick={() => setDate((prevDate) => addDays(prevDate || new Date(), 1))}
            width={'2.3rem'}
            height={'2.3rem'}
          />
        </IconButton>
      </Flex>
    </Flex>
  );
};
