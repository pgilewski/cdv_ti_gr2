import { Title } from '@mantine/core';
import { useState } from 'react';

import ProjectsTable from './ProjectsTable';

function ProjectsPage() {
  return (
    <div>
      <Title mb="md">Projekty i taski</Title>
      <ProjectsTable />
    </div>
  );
}

export default ProjectsPage;
