import { Title } from '@mantine/core';
import { useState } from 'react';
import { Navigate } from 'react-router-dom';

function HomePage() {
  return (
    // <div>
    //   <Title>Strona główna</Title>
    // </div>
    <Navigate to="daily" />
  );
}

export default HomePage;
