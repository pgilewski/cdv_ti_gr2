import React, { useState } from 'react';
import { PasswordInput, TextInput, Flex, Button, Stack } from '@mantine/core';

export default function LoginPage() {
type LoginProps = {
  onLogin: (email: string, password: string) => void;
};

function onLogin(email: string, password: string) {
  throw new Error('Function not implemented.');
}

// const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    onLogin(email, password);
  };
//}

  return (
    <Flex
    mih={50}
    bg="rgba(0, 0, 0, 0)"
    gap="xl"
    justify="center"
    align="center"
    direction="column"
    wrap="wrap"
  >
    <Stack>
      <TextInput                 
          value={email}
          label="Email"
          placeholder="Enter your email"
          withAsterisk
          onChange={(e) => setEmail(e.target.value)}
        />
        <PasswordInput               
          value={password}
          label="Password"
          placeholder="Enter your password"
          withAsterisk
          onChange={(e) => setPassword(e.target.value)}
        />
    </Stack>
    <Button onClick={handleLogin}>Login</Button>
    </Flex>
  );
};



