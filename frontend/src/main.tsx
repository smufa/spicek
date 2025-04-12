import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createTheme, MantineProvider } from "@mantine/core";
import { RouterProvider } from "react-router-dom";
import { router } from "./router/router";

import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";
import "@mantine/spotlight/styles.css";
import { Notifications } from "@mantine/notifications";

const theme = createTheme({});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <MantineProvider theme={theme}>
      <Notifications />
      {/* <ModalsProvider modals={mantineModals}> */}
      <RouterProvider router={router} />
      {/* </ModalsProvider> */}
    </MantineProvider>
  </StrictMode>
);
