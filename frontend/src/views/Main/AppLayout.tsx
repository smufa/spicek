import { Stack } from '@mantine/core';
import { Outlet } from 'react-router-dom';

export const AppLayout = () => {
  // const usr = useStore($currUser);
  return (
    <Stack h="100vh" w="100%">
      <Outlet />
      {/* <Badge
        m="sm"
        size="xs"
        style={{
          position: 'absolute',
          bottom: '0',
          right: '0',
        }}
      >
        USR:{usr?.accessToken ? usr.accessToken : 'LOGGED OUT'}
      </Badge> */}
    </Stack>
  );
};
