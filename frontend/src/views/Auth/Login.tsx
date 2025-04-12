import {
  Box,
  Button,
  Center,
  Container,
  Group,
  Paper,
  PasswordInput,
  Stack,
  Text,
  TextInput,
  Title,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { IconCircleKey } from '@tabler/icons-react';
import { useAuthControllerSignIn } from '../../api/auth/auth';
import { $currUser } from '../../global-store/userStore';
import { useNavigate, Link } from 'react-router-dom';

export function Login() {
  const { mutateAsync } = useAuthControllerSignIn();
  const navigate = useNavigate();

  const form = useForm({
    initialValues: {
      email: '',
      password: '',
    },

    // validate: {
    //   email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
    // },
  });

  return (
    <Box h="100vh" w="100vw">
      <Center h="100vh" w="100%">
        <Container size={620} miw={440}>
          <Group align="baseline">
            <Text c="dimmed">
              <IconCircleKey />
            </Text>
            <Title>Login</Title>
          </Group>

          <Paper withBorder shadow="md" p={30} mt={30} radius="md">
            <form
              onSubmit={form.onSubmit(async (values) => {
                mutateAsync({
                  data: {
                    password: values.password,
                    username: values.email,
                  },
                }).then((data) => {
                  $currUser.set({
                    accessToken: data.access_token,
                  });
                  navigate('/');
                });
              })}
            >
              <TextInput
                label="Email"
                placeholder="you@mantine.dev"
                required
                {...form.getInputProps('email')}
              />
              <PasswordInput
                label="Password"
                placeholder="Your password"
                required
                mt="md"
                {...form.getInputProps('password')}
              />

              <Stack gap="lg">
                <Button fullWidth mt="xl" type="submit">
                  Sign in
                </Button>

                <Button
                  size="sm"
                  component={Link}
                  to="/register"
                  variant="subtle"
                  fullWidth
                >
                  Don't have an account? Register now
                </Button>
              </Stack>
            </form>
          </Paper>
        </Container>
      </Center>
    </Box>
  );
}
