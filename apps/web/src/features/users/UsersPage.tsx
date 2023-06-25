import { Title } from '@mantine/core';
import { useState } from 'react';

import UsersTable from './UsersTable';

function UsersPage() {
  return (
    <div>
      <Title mb="md">Użytkownicy</Title>
      <UsersTable />
    </div>
  );
}

export default UsersPage;
