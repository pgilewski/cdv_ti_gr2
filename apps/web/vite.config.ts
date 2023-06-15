import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';

// See: https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  define: {
    global: {},
    // eslint-disable-next-line turbo/no-undeclared-env-vars
    'process.env.REACT_SPINKIT_NO_STYLES': JSON.stringify(process.env.REACT_SPINKIT_NO_STYLES),
  },
});
