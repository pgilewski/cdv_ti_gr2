import { Table, Title } from '@mantine/core';
import { useEffect, useState } from 'react';

const usersData = [
  { id: 1, name: 'John' },
  { id: 2, name: 'John' },
  { id: 3, name: 'John' },
  { id: 4, name: 'John' },
];

const UsersTable = () => {
  const [users, setUsers] = useState<null | { id: number; name: string }[]>(null);

  useEffect(() => {
    setUsers(usersData);
  }, []);

  return (
    <div>
      <Table verticalSpacing="xs">
        {users === null
          ? 'LOADING'
          : users.map((user) => {
              return <div key={user.id}>{user.name}</div>;
            })}
      </Table>
    </div>
  );
};

export default UsersTable;
