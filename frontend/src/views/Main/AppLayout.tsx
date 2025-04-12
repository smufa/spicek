import { Box, Group, Stack } from "@mantine/core";
import { Outlet } from "react-router-dom";

export const AppLayout = () => {
  return (
    <Stack h="100%" p="0" w="100%">
      <Group></Group>
      <Box flex={1}>
        <Outlet />
      </Box>
    </Stack>
  );
};
