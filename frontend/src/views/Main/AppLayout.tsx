import { Box, Button, Group, Stack, Title } from "@mantine/core";
import { Outlet, useNavigate } from "react-router-dom";

export const AppLayout = () => {
  const navigate = useNavigate();

  return (
    <Stack>
      <Group>
        <Title>nekaj</Title>
        <Button
          onClick={() => {
            navigate("/");
          }}
        >
          HOME
        </Button>
      </Group>
      <Box flex={1}>
        <Outlet />
      </Box>
    </Stack>
  );
};
