import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createTheme, MantineProvider } from '@mantine/core';
import { RouterProvider } from 'react-router-dom';
import { router } from './router/router';

import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';
import '@mantine/spotlight/styles.css';
import '@mantine/charts/styles.css';
import { Notifications } from '@mantine/notifications';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { showError } from './commons/notifications';

const theme = createTheme({
  primaryColor: 'dark',
  primaryShade: 6,
});

export const queryClient = new QueryClient({
  defaultOptions: {
    mutations: {
      onSettled(_, error) {
        const axError = error as AxiosError;

        if (!axError) return;
        if (!axError.response) return;

        if (axError.response?.status === 403) {
          showError('Network error 403');
        }
      },
    },
    queries: {
      retry: (failureCount, error) => {
        const axError = error as AxiosError;

        // Dont retry on the following errors
        switch (axError.response?.status) {
          case 401: // Unauthorized
          case 403: // Forbidden
          case 404: // Not found
            return false;
        }

        if (failureCount < 2) return true;

        return false;
      },
    },
  },
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <MantineProvider theme={theme}>
        <Notifications />
        {/* <ModalsProvider modals={mantineModals}> */}
        <RouterProvider router={router} />
        {/* </ModalsProvider> */}
      </MantineProvider>
    </QueryClientProvider>
  </StrictMode>,
);
