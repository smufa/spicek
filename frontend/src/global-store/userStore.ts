import { persistentAtom } from '@nanostores/persistent';

interface LoggedUser {
  accessToken: string;
}
export const $currUser = persistentAtom<LoggedUser | null>('user', null, {
  encode: JSON.stringify,
  decode: JSON.parse,
});
