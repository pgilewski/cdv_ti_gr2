import { useContext, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button, Container, Table, TextInput, Title, useMantineTheme } from '@mantine/core';

import useUserManagement from '../../hooks/useUserManagement';
import { NotyfContext } from '../../hooks/useNotyf';

export default function UsersTable() {
  const notyf = useContext(NotyfContext);
  const {
    usersQuery: { data: users },
    createUserMutation,
    updateUserMutation,
    deleteUserMutation,
  } = useUserManagement();
  const { register, handleSubmit, reset } = useForm();
  const theme = useMantineTheme();
  const [activeUserId, setActiveUserId] = useState<string | null>(null);

  console.log(users);
  if (!users) {
    return null;
  }

  const onUserSubmit = (data: any) => {
    if (activeUserId) {
      updateUserMutation.mutate(
        { ...data, id: activeUserId },
        {
          onSuccess: () => {
            notyf.success('User updated successfully!');
            reset();
            setActiveUserId(null);
          },
          onError: () => {
            notyf.error('An error occurred while updating the user!');
          },
        }
      );
    } else {
      createUserMutation.mutate(data, {
        onSuccess: () => {
          notyf.success('User created successfully!');
          reset();
        },
        onError: (error) => {
          notyf.error('An error occurred while creating the user!');
        },
      });
    }
  };

  const onEditUser = (userId: number) => {
    const userToEdit = users.find((user) => user.id === userId);
    if (userToEdit) {
      setActiveUserId(String(userId));
      reset({
        name: userToEdit.firstName,
        email: userToEdit.email,
      });
    }
  };

  return (
    <Container>
      <Title order={1}>Users</Title>

      <Table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.firstName}</td>
              <td>{user.lastName}</td>
              <td>{user.email}</td>
              <td>
                <Button onClick={() => deleteUserMutation.mutate(String(user.id))} color="red">
                  Delete
                </Button>
                <Button onClick={() => onEditUser(user.id)}>Edit</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <form onSubmit={handleSubmit(onUserSubmit)}>
        <TextInput {...register('name')} label="Name" required placeholder="Enter user name" />
        <TextInput {...register('email')} label="Email" required placeholder="Enter user email" />
        <Button type="submit" color="blue">
          Save User
        </Button>
      </form>
    </Container>
  );
}
