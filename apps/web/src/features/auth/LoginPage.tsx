// LoginPage.tsx
import { Button, Card, Text, TextInput, Container } from '@mantine/core';
import styled from '@emotion/styled';
import { useState } from 'react';
import { Link } from 'react-router-dom';

import useAuth from '../../hooks/useAuth';

const LoginPage: React.FC = () => {
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    signIn(email, password);
  };

  const LoginContainer = styled.div`
    max-width: 400px;
    margin: 0 auto;
    padding: 30px;
  `;

  return (
    <LoginContainer>
      <Card shadow="sm" padding="xl">
        <Text align="center" size="xl" style={{ marginBottom: '20px' }}>
          Witamy!
        </Text>
        <form onSubmit={handleSubmit}>
          <TextInput
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Wprowadź adres email"
            withAsterisk
            style={{ marginBottom: '15px' }}
            required
          />
          <TextInput
            label="Hasło"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Wprowadź hasło"
            withAsterisk
            style={{ marginBottom: '15px' }}
            required
          />
          <Button type="submit" fullWidth style={{ marginBottom: '15px' }}>
            Zaloguj się
          </Button>
          <Link to="/register">
            <Button type="submit" fullWidth style={{ marginBottom: '15px' }}>
              Zarejestruj się
            </Button>
          </Link>
        </form>
      </Card>
    </LoginContainer>
  );
};

export default LoginPage;
