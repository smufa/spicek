import { createBrowserRouter } from 'react-router-dom';
import App from '../views/Main/App';
import { AppLayout } from '../views/Main/AppLayout';
import { Analyze } from '../views/Analyze/Analyze';
import { Record } from '../views/Record/Record';
import { Login } from '../views/Auth/Login';
import { Register } from '../views/Auth/Register';
import { ProtectedPath } from '../views/Auth/ProtectedPath';

export const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <ProtectedPath redirectUrl="/login">
        <AppLayout />
      </ProtectedPath>
    ),
    children: [
      {
        path: '/',
        element: <App />,
      },
      {
        path: '/analyze',
        element: <Analyze />,
      },
      {
        path: '/record',
        element: <Record />,
      },
    ],
  },

  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/register',
    element: <Register />,
  },
]);
