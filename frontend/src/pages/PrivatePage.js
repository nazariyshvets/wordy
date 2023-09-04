import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";

function PrivatePage({ children }) {
  const { user } = useContext(AuthContext);

  return user ? <>{children}</> : <Navigate to="/login" replace={true} />;
}

export default PrivatePage;
