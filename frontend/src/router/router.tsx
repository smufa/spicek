import { createBrowserRouter } from "react-router-dom";
import { Authentication } from "../views/Auth";
import App from "../views/Main/App";
import { AppLayout } from "../views/Main/AppLayout";
import { Analyze } from "../views/Analyze/Analyze";
import { Record } from "../views/Record/Record";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [
      {
        path: "/",
        element: <App />,
      },
      {
        path: "/analyze",
        element: <Analyze />,
      },
      {
        path: "/record",
        element: <Record />,
      },
    ],
  },

  {
    path: "/auth",
    element: <Authentication />,
  },
]);
