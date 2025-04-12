import Axios, { AxiosError, AxiosRequestConfig } from 'axios';
import { $currUser } from '../../global-store/userStore';
import qs from 'qs';
import { showError } from '../../commons/notifications';

export const AXIOS_INSTANCE = Axios.create({
  baseURL: import.meta.env.VITE_BACKEND_API,
  paramsSerializer: {
    // Important to use qs instead of the default URLSearchParams
    serialize: (params) => {
      return qs.stringify(params, { arrayFormat: 'comma' });
    },
  },
});

export const customInstance = <T>(
  config: AxiosRequestConfig,
  options?: AxiosRequestConfig,
): Promise<T> => {
  const source = Axios.CancelToken.source();

  const promise = AXIOS_INSTANCE({
    ...config,
    ...options,
    cancelToken: source.token,
  }).then(({ data }) => data);

  // @ts-expect-error neki cudno
  promise.cancel = () => {
    source.cancel('Query was cancelled');
  };

  return promise;
};

AXIOS_INSTANCE.interceptors.request.use(
  (config) => {
    const token = $currUser.get()?.accessToken;

    config.headers.Authorization = token ? `Bearer ${token}` : '';

    return config;
  },
  (error) => Promise.reject(error),
);

AXIOS_INSTANCE.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status == 401) {
      // showError('Seja je potekla.');
      console.log('session expired, relogging');
    }

    if (error.response?.status == 403) {
      showError('403 Error');
    }

    throw error;
  },
);

// In some case with react-query and swr you want to be able to override the return error type so you can also do it here like this
export type ErrorType<Error> = AxiosError<Error>;
// function showError(arg0: string) {
//   throw new Error('Function not implemented.');
// }
