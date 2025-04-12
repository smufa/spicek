import { Box, Button, Group, Stack, Title } from "@mantine/core";
import { Outlet, useNavigate } from "react-router-dom";

export const AppLayout = () => {
  const navigate = useNavigate();

  return (
    <Stack h="100%" p="0" w="100%">
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
