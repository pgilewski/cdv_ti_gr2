import { useContext, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Button, Container, Select, Table, TextInput, Title, useMantineTheme } from '@mantine/core';
import useUserManagement from '../../hooks/useUserManagement';
import { NotyfContext } from '../../hooks/useNotyf';
import { useQueryClient } from 'react-query';
import ReactSelect from 'react-select';

export default function UsersTable() {
  const notyf = useContext(NotyfContext);
  const {
    usersQuery: { data: users },
    createUserMutation,
    updateUserMutation,
    deleteUserMutation,
  } = useUserManagement();
  const { register, handleSubmit, reset, control } = useForm();
  const theme = useMantineTheme();
  const [activeUserId, setActiveUserId] = useState<string | null>(null);
  const queryClient = useQueryClient();

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
            queryClient.invalidateQueries('users');
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
          queryClient.invalidateQueries('users');
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
        firstName: userToEdit.firstName,
        lastName: userToEdit.lastName,
        email: userToEdit.email,
        role: userToEdit.role,
      });
    }
  };
  // const [value, setValue] = useStat<string | null>(null);
  const selectOptions = [
    { value: 'Pracownik', label: 'Pracownik' },
    { value: 'Moderator', label: 'Moderator' },
    { value: 'Administrator', label: 'Administrator' },
  ];
  return (
    <Container>
      <Button
        color={'green'}
        onClick={() => {
          setActiveUserId(null);
          reset({
            firstName: '',
            lastName: '',
            email: '',
            role: 'Pracownik',
          });
        }}
      >
        Add user
      </Button>
      <Table>
        <thead>
          <tr>
            <th>Imie</th>
            <th>Nazwisko</th>
            <th>Email</th>
            <th>Rola</th>
            <th>Akcje</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.firstName}</td>
              <td>{user.lastName}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
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
      {activeUserId ? <Title order={3}>Edytuj użytkownika</Title> : <Title order={3}>Dodaj użytkownika</Title>}
      <form onSubmit={handleSubmit(onUserSubmit)}>
        <TextInput {...register('firstName')} label="Name" required placeholder="Wpisz imie" />
        <TextInput {...register('lastName')} label="Name" required placeholder="Wpisz nazwisko" />
        <TextInput {...register('email')} label="Email" placeholder="Enter user email" disabled />
        Rola:
        <Controller
          control={control}
          name="role"
          render={({ field: { onChange, value, name, ref } }) => (
            <ReactSelect
              ref={ref}
              classNamePrefix="addl-class"
              options={selectOptions}
              value={selectOptions.find((c) => c.value === value)}
              onChange={(val) => onChange(val?.value)}
            />
          )}
        />
        <Button type="submit" color="blue">
          Save User
        </Button>
      </form>
    </Container>
  );
}
