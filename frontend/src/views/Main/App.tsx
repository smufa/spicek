import { Button, Group, Stack } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useNavigate } from "react-router-dom";

function App() {
  const navigate = useNavigate();
  return (
    <Stack>
      <Group>
        <Button
          onClick={() => {
            navigate("/record");
          }}
        >
          Record
        </Button>
        <Button
          onClick={() => {
            navigate("/analyze");
          }}
        >
          Analyze
        </Button>
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
