import { useContext, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Button, Container, Select, Table, TextInput, Title, useMantineTheme } from '@mantine/core';
import useUserManagement from '../../hooks/useUserManagement';
import { NotyfContext } from '../../hooks/useNotyf';
import { useQueryClient } from 'react-query';
import ReactSelect from 'react-select';
import RoleBasedRender from '../../components/RoleBasedRender';
import { Role } from '../../typings/types';
import useAuth from '../../hooks/useAuth';
import LoadingState from '../../components/LoadingState';

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
  const { userInfo } = useAuth();
  console.log(users);

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
  if (!users) {
    return <LoadingState />;
  }
  return (
    <Container>
      <RoleBasedRender allowedRoles={[Role.Administrator, Role.Moderator]} userRole={userInfo?.role}>
        <Button
          color={'green'}
          my={'sm'}
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
          Dodaj użytkownika
        </Button>
      </RoleBasedRender>

      <Table>
        <thead>
          <tr>
            <th>Imię</th>
            <th>Nazwisko</th>
            <th>Email</th>
            <th>Rola</th>
            <RoleBasedRender allowedRoles={[Role.Administrator, Role.Moderator]} userRole={userInfo?.role}>
              <th>Akcje</th>
            </RoleBasedRender>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.firstName}</td>
              <td>{user.lastName}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
              <RoleBasedRender allowedRoles={[Role.Administrator, Role.Moderator]} userRole={userInfo?.role}>
                <td>
                  <Button mr={'md'} onClick={() => deleteUserMutation.mutate(String(user.id))} color="red">
                    Usuń
                  </Button>
                  <Button onClick={() => onEditUser(user.id)}>Edytuj</Button>
                </td>
              </RoleBasedRender>
            </tr>
          ))}
        </tbody>
      </Table>
      <RoleBasedRender allowedRoles={[Role.Administrator, Role.Moderator]} userRole={userInfo?.role}>
        <>
          {activeUserId ? (
            <Title mb={'sm'} mt="sm" order={3}>
              Edytuj użytkownika
            </Title>
          ) : (
            <Title mb={'sm'} mt="sm" order={3}>
              Dodaj użytkownika
            </Title>
          )}
          <form onSubmit={handleSubmit(onUserSubmit)}>
            <TextInput {...register('firstName')} label="Imię" required placeholder="Wpisz imię" mb="sm" />
            <TextInput {...register('lastName')} label="Nazwisko" required placeholder="Wpisz nazwisko" mb="sm" />
            <TextInput {...register('email')} label="Email" placeholder="Wpisz adres email" disabled mb="sm" />
            Rola:
            <Controller
              control={control}
              name="role"
              render={({ field: { onChange, value, name, ref } }) => (
                <ReactSelect
                  ref={ref}
                  placeholder="Wybierz rolę użytkownika"
                  classNamePrefix="addl-class"
                  options={selectOptions}
                  value={selectOptions.find((c) => c.value === value)}
                  onChange={(val) => onChange(val?.value)}
                />
              )}
            />
            <Button type="submit" color="blue" mt="sm">
              Zapisz
            </Button>
          </form>
        </>
      </RoleBasedRender>
    </Container>
  );
}
