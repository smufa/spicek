import { notifications } from '@mantine/notifications';

export const showError = (msg: string, title: string = 'error') => {
  notifications.show({
    message: msg,
    title: title,
    color: 'red',
  });
};
