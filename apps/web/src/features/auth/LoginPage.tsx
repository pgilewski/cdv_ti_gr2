// LoginPage.tsx
import { Button, Container } from '@mantine/core';
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

  return (
    <Container px={'sm'} py={'sm'}>
      <form onSubmit={handleSubmit}>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
        />
        <Button type="submit" mx={'sm'}>
          Sign In
        </Button>
        <Link to="/register">
          <Button type="submit">Register</Button>
        </Link>
      </form>
    </Container>
  );
};

export default LoginPage;
