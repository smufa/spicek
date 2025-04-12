import { atom } from 'nanostores';

interface LoggedUser {
  accessToken: string;
}
export const $currUser = atom<LoggedUser | null>(null);
