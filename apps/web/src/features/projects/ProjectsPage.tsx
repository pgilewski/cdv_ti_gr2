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
      <th>Title</th>
      <th>Description</th>
      <th>Actions</th>
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
        <Button onClick={() => deleteProject(project.id)} color="red">
          Delete
        </Button>
        <Button onClick={() => onViewProject(project.id)}>View</Button>
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
  return (
    <Container>
      <Grid gutter={theme.spacing.md}>
        <Col span={12}>
          <Title order={2}>Projects</Title>
          <Button
            color={'green'}
            onClick={() => {
              setActiveProjectId(null);
              resetProjectForm({
                title: '',
                description: '',
              });
            }}
          >
            Add Project
          </Button>

          <Table>
            <thead>{ths}</thead>
            <tbody>{rows}</tbody>
          </Table>
          <Col span={12}>
            {activeProjectId !== null ? (
              <Title order={3}>Edytuj projekt</Title>
            ) : (
              <Title order={3}>Dodaj projekt</Title>
            )}
          </Col>
          <form onSubmit={projectHandleSubmit(onProjectSubmit)}>
            <TextInput {...projectRegister('title')} label="Title" required placeholder="Enter project title" />
            <TextInput
              {...projectRegister('description')}
              label="Description"
              required
              placeholder="Enter project description"
            />
            <Button type="submit" color="blue">
              Save Project
            </Button>
          </form>
        </Col>

        {activeProjectId && (
          <Col span={12}>
            <Title order={2}>Tasks {projects.find((project) => project.id === activeProjectId)?.title}</Title>

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
                          <Button onClick={() => taskDelete(task.id)} color="red">
                            Delete
                          </Button>
                          <Button onClick={() => onEditTask(task.id)}>Edit</Button>
                        </th>
                      </tr>
                    ))}
              </tbody>
            </Table>

            <form onSubmit={taskHandleSubmit(onTaskSubmit)}>
              <TextInput {...taskRegister('name')} label="Name" required placeholder="Enter task name" />
              <TextInput
                {...taskRegister('description')}
                label="Description"
                required
                placeholder="Enter task description"
              />
              <Button m={'sm'} type="submit" color="blue">
                Save Task
              </Button>
            </form>
          </Col>
        )}
      </Grid>
    </Container>
  );
}
