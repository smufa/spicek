import { useStore } from '@nanostores/react';
import { PropsWithChildren } from 'react';
import { Navigate } from 'react-router-dom';
import { $currUser } from '../../global-store/userStore';

interface ProtectedPathProps extends PropsWithChildren {
  redirectUrl: string;
}

export const ProtectedPath = ({
  children,
  redirectUrl,
}: ProtectedPathProps) => {
  const user = useStore($currUser);

  if (user == null) {
    return <Navigate to={redirectUrl} />;
  }

  return <>{children}</>;
};
