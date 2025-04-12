import { Button, Group, Stack } from "@mantine/core";
import { notifications } from "@mantine/notifications";

function App() {
  return (
    <Stack>
      <Group>
        <Stack>
          {/* <Badge variant="light">{user?.id}</Badge> */}
          <Button>logout</Button>
        </Stack>

        <Button
          onClick={() => {
            notifications.show({
              message: "im a notif",
            });
          }}
        >
          Push notification
        </Button>
      </Group>
    </Stack>
  );
}

export default App;
