import { MantineProvider } from '@mantine/core';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import App from './App';
import './index.css';
// remove index.css and create components using useStyles hook
import 'react-datepicker/dist/react-datepicker.css';

createRoot(document.getElementById('root') as HTMLElement).render(
  <StrictMode>
    <MantineProvider withNormalizeCSS withGlobalStyles>
      <App />
    </MantineProvider>
  </StrictMode>
);
