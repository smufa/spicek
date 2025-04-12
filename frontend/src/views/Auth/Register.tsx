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
import { useAuthControllerSignUp } from '../../api/auth/auth';
import { Link, useNavigate } from 'react-router-dom';
import { notifications } from '@mantine/notifications';

export function Register() {
  const { mutateAsync } = useAuthControllerSignUp();
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
            <Title>Register</Title>
          </Group>

          <Paper withBorder shadow="md" p={30} mt={30} radius="md">
            <form
              onSubmit={form.onSubmit(async (values) => {
                mutateAsync({
                  data: {
                    password: values.password,
                    username: values.email,
                  },
                }).then(() => {
                  navigate('/login');
                  notifications.show({
                    title: 'Signup sucessfull',
                    message: 'redirecting to login',
                  });
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
                  to="/login"
                  variant="subtle"
                  fullWidth
                >
                  Already have an account? Log in
                </Button>
              </Stack>
            </form>
          </Paper>
        </Container>
      </Center>
    </Box>
  );
}
