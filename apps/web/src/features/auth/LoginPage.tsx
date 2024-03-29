import { useContext, useEffect, useState } from 'react';

import useAuth from '../../hooks/useAuth';

import { Text, Card, Button, TextInput } from '@mantine/core';
import styled from '@emotion/styled';
import { useForm } from 'react-hook-form';
import { NotyfContext } from '../../hooks/useNotyf';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContainer } from './AuthStyles';

const LoginPage = () => {
  const { userInfo, accessToken, signIn } = useAuth();
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
      console.log(loginResponse);
    } catch (error) {
      notyf.error('Nie udało się zalogować.');
    }
  };
  // const navigate = useNavigate();

  // useEffect(() => {
  //   if (userInfo && accessToken) {
  //     notyf.success('Zalogowano pomyślnie');
  //     // navigate('/app');
  //   }
  // }, [userInfo, accessToken]);
  return (
    <AuthContainer>
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
    </AuthContainer>
  );
};

export default LoginPage;
