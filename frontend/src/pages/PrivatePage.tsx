import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import useAuth from "hooks/useAuth";

interface PrivatePageProps {
  children: ReactNode;
}

function PrivatePage({ children }: PrivatePageProps) {
  const { user } = useAuth();

  return user ? <>{children}</> : <Navigate to="/login" replace={true} />;
}

export default PrivatePage;
