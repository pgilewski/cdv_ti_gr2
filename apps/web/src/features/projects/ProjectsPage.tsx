import { useContext, useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  Button,
  Col,
  Container,
  Flex,
  Grid,
  Group,
  Modal,
  Paper,
  Table,
  Text,
  TextInput,
  Title,
  Select,
  UnstyledButton,
  useMantineTheme,
} from '@mantine/core';
import { useQueryClient } from 'react-query';

import useProjectManagement from '../../hooks/useProjectManagement';
import useTaskManagement from '../../hooks/useTaskManagement';
import { NotyfContext } from '../../hooks/useNotyf';
import LoadingState from '../../components/LoadingState';

export default function ProjectsPage() {
  const notyf = useContext(NotyfContext);
  const queryClient = useQueryClient();

  const {
    projectsQuery: { data: projects },
    createProjectMutation,
    updateProjectMutation,
    deleteProjectMutation,
  } = useProjectManagement();

  const {
    tasksQuery: { data: tasks },
    createTaskMutation,
    updateTaskMutation,
    deleteTaskMutation,
  } = useTaskManagement();

  const { register: projectRegister, handleSubmit: projectHandleSubmit, reset: resetProjectForm } = useForm();
  const { register: taskRegister, handleSubmit: taskHandleSubmit, reset: resetTaskForm } = useForm();

  const theme = useMantineTheme();
  const [activeProjectId, setActiveProjectId] = useState<number | null>(null);
  const [activeTaskId, setActiveTaskId] = useState<number | null>(null);

  const ths = (
    <tr>
      <th>Nazwa</th>
      <th>Opis</th>
      <th>Akcje</th>
    </tr>
  );

  if (!projects) {
    return null;
  }
  const deleteProject = (id: number) => {
    deleteProjectMutation.mutate(id, {
      onSuccess: () => {
        notyf.success('Project deleted successfully!');
        queryClient.invalidateQueries('projects');
      },
      onError: (error) => {
        notyf.error('An error occurred while deleting Project!');
      },
    });
  };

  const onViewProject = (projectId: number) => {
    if (!tasks) return null;

    const projectToEdit = projects.find((task) => task.id === projectId);
    if (projectToEdit) {
      setActiveProjectId(projectId);
      resetProjectForm({
        title: projectToEdit.title,
        description: projectToEdit.description,
      });
    }
    // setActiveProjectId(projectId);
  };

  const rows = projects.map((project) => (
    <tr key={project.id}>
      <th>{project.title}</th>
      <th>{project.description}</th>
      <th>
        <Button onClick={() => deleteProject(project.id)} color="red" mr={'md'}>
          Usuń
        </Button>
        <Button onClick={() => onViewProject(project.id)}>Zobacz</Button>
      </th>
    </tr>
  ));

  const onProjectSubmit = (data: any) => {
    if (activeProjectId) {
      updateProjectMutation.mutate(
        { ...data, id: activeProjectId },
        {
          onSuccess: () => {
            notyf.success('Project updated successfully!');
            queryClient.invalidateQueries('projects');
          },
          onError: () => {
            notyf.error('An error occurred while updating the project!');
          },
        }
      );
    } else {
      createProjectMutation.mutate(data, {
        onSuccess: () => {
          notyf.success('Project created successfully!');
          resetProjectForm();
          queryClient.invalidateQueries('projects');
        },
        onError: (error) => {
          notyf.error('An error occurred while creating the project!');
        },
      });
    }
  };

  const onTaskSubmit = (data: any) => {
    console.log('activeTaskId', activeTaskId);
    if (activeTaskId) {
      updateTaskMutation.mutate(
        { ...data, id: activeTaskId },
        {
          onSuccess: () => {
            notyf.success('Task updated successfully!');
            resetTaskForm();
            queryClient.invalidateQueries('tasks');
          },
          onError: (error) => {
            notyf.error('An error occurred while updating the task!');
          },
        }
      );
    } else {
      createTaskMutation.mutate(
        { ...data, projectId: activeProjectId },
        {
          onSuccess: () => {
            notyf.success('Task created successfully!');
            resetTaskForm();
            queryClient.invalidateQueries('tasks');
          },
          onError: (error) => {
            notyf.error('An error occurred while creating the task!');
          },
        }
      );
    }
  };
  const taskDelete = (id: number) => {
    deleteTaskMutation.mutate(id, {
      onSuccess: () => {
        notyf.success('Task deleted successfully!');
        queryClient.invalidateQueries('tasks');
      },
      onError: (error) => {
        notyf.error('An error occurred while deleting Task!');
      },
    });
  };

  const onEditTask = (taskId: number) => {
    if (!tasks) return null;

    const taskToEdit = tasks.find((task) => task.id === taskId);
    if (taskToEdit) {
      setActiveTaskId(taskId);
      resetTaskForm({
        name: taskToEdit.name,
        description: taskToEdit.description,
      });
    }
  };
  console.log(activeProjectId);

  if (!projects) {
    return <LoadingState />;
  }
  return (
    <div>
      <Title mb="md">Projekty i taski</Title>
      <Container>
        <Grid gutter={theme.spacing.md}>
          <Col span={12}>
            <Button
              color={'green'}
              my={'sm'}
              onClick={() => {
                setActiveProjectId(null);
                resetProjectForm({
                  title: '',
                  description: '',
                });
              }}
            >
              Dodaj projekt
            </Button>

            <Table>
              <thead>{ths}</thead>
              <tbody>{rows}</tbody>
            </Table>
          </Col>
          <Col span={12}>
            {activeProjectId !== null ? (
              <Title order={3}>Edytuj projekt</Title>
            ) : (
              <Title order={3}>Dodaj projekt</Title>
            )}
          </Col>
          <Col mb="sm">
            <form onSubmit={projectHandleSubmit(onProjectSubmit)}>
              <TextInput {...projectRegister('title')} label="Nazwa" required placeholder="Wpisz nazwę projektu" />
              <TextInput {...projectRegister('description')} label="Opis" required placeholder="Dodaj opis projektu" />
              <Button type="submit" color="blue" mt="sm">
                Zapisz projekt
              </Button>
            </form>
          </Col>

          {activeProjectId && (
            <Col span={12}>
              <Title order={3}>Tasks {projects.find((project) => project.id === activeProjectId)?.title}</Title>

              <Table>
                <thead>{ths}</thead>
                <tbody>
                  {tasks &&
                    tasks
                      .filter((task) => task.projectId === activeProjectId)
                      .map((task) => (
                        <tr key={task.id}>
                          <th>{task.name}</th>
                          <th>{task.description}</th>
                          <th>
                            <Button onClick={() => taskDelete(task.id)} color="red" mr={'md'}>
                              Usuń
                            </Button>
                            <Button onClick={() => onEditTask(task.id)}>Edytuj</Button>
                          </th>
                        </tr>
                      ))}
                </tbody>
              </Table>

              <form onSubmit={taskHandleSubmit(onTaskSubmit)}>
                <TextInput {...taskRegister('name')} label="Nazwa" required placeholder="Wpisz nazwę taska" />
                <TextInput {...taskRegister('description')} label="Opis" required placeholder="Dodaj opis taska" />
                <Button mt={'sm'} type="submit" color="blue">
                  Zapisz task
                </Button>
              </form>
            </Col>
          )}
        </Grid>
      </Container>
    </div>
  );
}
