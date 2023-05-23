import styled from '@emotion/styled';
import { Text, useMantineTheme } from '@mantine/core';
import { Link } from 'react-router-dom';

interface Props {
  children: string;
  to: string;
}

const StyledDiv = styled.div`
  text-align: center;
  padding: 1.125rem;
  cursor: pointer;
  color: #1a1b1e;
  position: relative;
  font-family: monospace;
  transition: box-shadow 0.2s ease-in-out;
`;

const StyledSidebarElement = styled.div`
  font-family: monospace;
  transition: box-shadow 0.2s ease-in-out;
  &:hover {
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  }
  padding: 0.5rem;
  border-radius: 0.5rem;
`;

export default function SidebarElement({ children, to }: Props) {
  const theme = useMantineTheme();
  return (
    <Link to={to}>
      <StyledDiv>
        <StyledSidebarElement theme={theme}>{children}</StyledSidebarElement>
      </StyledDiv>
    </Link>
  );
}
