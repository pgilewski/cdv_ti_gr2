import { useMutation, useQuery } from 'react-query';

import { useApi } from '../features/ApiProvider';
import { Project } from '../typings/types';

export type CreateProjectDto = Pick<Project, 'title' | 'description'>;

export type UpdateProjectDto = Partial<CreateProjectDto> & Pick<Project, 'id'>;

const useProjectManagement = () => {
  const api = useApi();

  const projectsQuery = useQuery<Project[]>('projects', async () => {
    const response = await api.get<Project[]>('/projects');
    return response.data;
  });

  const createProjectMutation = useMutation<Project, Error, CreateProjectDto>(async (newProject) => {
    const response = await api.post<Project>('/projects', newProject);
    return response.data;
  });

  const updateProjectMutation = useMutation<Project, Error, UpdateProjectDto>(async (updatedProject) => {
    const { id, ...rest } = updatedProject;
    const response = await api.put<Project>(`/projects/${id}`, rest);
    return response.data;
  });

  const deleteProjectMutation = useMutation<unknown, Error, number>(async (projectId) => {
    await api.delete(`/projects/${projectId}`);
  });

  return {
    projectsQuery,
    createProjectMutation,
    updateProjectMutation,
    deleteProjectMutation,
  };
};

export default useProjectManagement;
