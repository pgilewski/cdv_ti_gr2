import { Text, Card, Button, TextInput } from '@mantine/core';
import styled from '@emotion/styled';

const RegisterContainer = styled.div`
  max-width: 400px;
  margin: 0 auto;
  padding: 30px;
  
`;

const RegisterPage = () => {
  return (
    <RegisterContainer>
      <Card shadow="sm" padding="xl">
        <Text align="center" size="xl" style={{ marginBottom: '20px' }}>
          Rejestracja
        </Text>
        <form>
          <TextInput
            required
            label="Email"
            placeholder="Wprowadź adres email"
            style={{ marginBottom: '15px' }}
          />
          <TextInput
            required
            type="password"
            label="Hasło"
            placeholder="Wprowadź hasło"
            style={{ marginBottom: '15px' }}
          />
          <TextInput
            required
            type="password"
            label="Powtórz hasło"
            placeholder="Powtórz hasło"
            style={{ marginBottom: '15px' }}
          />
          <Button fullWidth type="submit">
            Zarejestruj się
          </Button>
        </form>
      </Card>
    </RegisterContainer>
  );
};

export default RegisterPage;