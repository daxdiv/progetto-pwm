import { Navigate } from "react-router-dom";
import useAuth from "./hooks/useAuth";

function Protected({ children }: { children: React.ReactNode }) {
  const auth = useAuth();

  if (!auth) {
    return (
      <Navigate
        to="/?error=Devi effettuare prima il login"
        replace
      />
    );
  }
  return children;
}
export default Protected;
