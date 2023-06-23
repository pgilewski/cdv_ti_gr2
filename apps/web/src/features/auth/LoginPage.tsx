import { useContext, useState } from 'react';

import useAuth from '../../hooks/useAuth';

import { Text, Card, Button, TextInput } from '@mantine/core';
import styled from '@emotion/styled';
import { useForm } from 'react-hook-form';
import { NotyfContext } from '../../hooks/useNotyf';
import { Link } from 'react-router-dom';

const RegisterContainer = styled.div`
  max-width: 400px;
  margin: 0 auto;
  padding: 30px;
`;

const LoginPage = () => {
  const { signIn } = useAuth();
  const notyf = useContext(NotyfContext);

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<{ email: string; password: string }>();

  const onSubmit = async ({ email, password }: { email: string; password: string }) => {
    try {
      const loginResponse = await signIn(email, password);
    } catch (error) {
      notyf.error('Nie udało się zalogować.');
    }
  };

  const LoginContainer = styled.div`
    max-width: 400px;
    margin: 0 auto;
    padding: 30px;
  `;

  return (
    <RegisterContainer>
      <Card shadow="sm" padding="xl">
        <Text align="center" size="xl" style={{ marginBottom: '20px' }}>
          Logowanie
        </Text>
        <form onSubmit={handleSubmit(onSubmit)}>
          <TextInput
            required
            label="Email"
            placeholder="Wprowadź adres email"
            style={{ marginBottom: '15px' }}
            {...register('email', { required: 'Email is required' })}
          />
          <TextInput
            required
            type="password"
            label="Hasło"
            placeholder="Wprowadź hasło"
            style={{ marginBottom: '15px' }}
            {...register('password', { required: 'Password is required' })}
          />

          <Button fullWidth type="submit">
            Zaloguj się
          </Button>
          <Link to="/register">
            <Button fullWidth my={'sm'} type="submit">
              Rejestracja
            </Button>
          </Link>
        </form>
      </Card>
    </RegisterContainer>
  );
};

export default LoginPage;
