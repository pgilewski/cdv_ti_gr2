import { useContext, useState } from 'react';

import useAuth from '../../hooks/useAuth';

import { Text, Card, Button, TextInput } from '@mantine/core';
import styled from '@emotion/styled';
import { useForm } from 'react-hook-form';
import { NotyfContext } from '../../hooks/useNotyf';

const AuthContainer = styled.div`
  max-width: 400px;
  margin: 0 auto;
  padding: 30px;
`;

const RegisterPage = () => {
  const { register: registerUser } = useAuth();
  const notyf = useContext(NotyfContext);

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<{ email: string; password: string; repeatPassword?: string }>();

  const onSubmit = async ({ email, password }: { email: string; password: string; repeatPassword?: string }) => {
    try {
      const registerResponse = await registerUser(email, password);
      if (registerResponse === 201) {
        notyf.success('Utworzono konto.');
      } else {
        notyf.error('Nie udało się utworzyć konta.');
      }
    } catch (error) {
      notyf.error('Nie udało się utworzyć konta.');
    }
  };

  // Basic react example (but we prefer to use react-hook-from)

  // const [email, setEmail] = useState('');
  // const [password, setPassword] = useState('');
  // const [repeatPassword, setRepeatPassword] = useState('');

  // const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
  //   event.preventDefault();

  //   if (password !== repeatPassword) {
  //     // Implement an alert or error message
  //     console.error('Passwords do not match');
  //     return;
  //   }

  //   registerUser(email, password);
  // };

  return (
    <AuthContainer>
      <Card shadow="sm" padding="xl">
        <Text align="center" size="xl" style={{ marginBottom: '20px' }}>
          Rejestracja
        </Text>
        <form onSubmit={handleSubmit(onSubmit)}>
          <TextInput
            required
            label="Email"
            placeholder="Wprowadź adres email"
            style={{ marginBottom: '15px' }}
            // basic react exmaple commented out
            // value={email}
            // onChange={(event) => setEmail(event.currentTarget.value)}
            {...register('email', { required: 'Email is required' })}
          />
          <TextInput
            required
            type="password"
            label="Hasło"
            placeholder="Wprowadź hasło"
            style={{ marginBottom: '15px' }}
            // value={password}
            // onChange={(event) => setPassword(event.currentTarget.value)}
            {...register('password', { required: 'Password is required' })}
          />
          <TextInput
            required
            type="password"
            label="Powtórz hasło"
            placeholder="Powtórz hasło"
            style={{ marginBottom: '15px' }}
            // value={repeatPassword}
            // onChange={(event) => setRepeatPassword(event.currentTarget.value)}
            {...register('repeatPassword', {
              required: 'Repeat password is required',
              validate: (value) => value === getValues('password') || 'Passwords do not match',
            })}
          />
          <Button fullWidth type="submit">
            Zarejestruj się
          </Button>
        </form>
      </Card>
    </AuthContainer>
  );
};

export default RegisterPage;
